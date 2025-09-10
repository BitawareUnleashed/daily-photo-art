// Esempio d'uso
// setBackgroundAndReadExif("https://example.com/path/photo.jpg", document.getElementById("hero"))
//   .then(exif => {
//     // se serve, puoi ruotare l’elemento in base a exif.orientation
//     console.log("Fatto. EXIF:", exif);
//   })
//   .catch(err => console.error(err));



async function setBackgroundAndReadExif(url) {
  // 1) scarica come Blob e ArrayBuffer
  const res = await fetch(url, { mode: "cors" }); // il server deve permettere CORS
  if (!res.ok) throw new Error("Download fallito: " + res.status);
  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();
  const view = new DataView(buffer);

  // 2) JPEG? FF D8
  if (view.getUint16(0) !== 0xFFD8) {
    console.warn("Non è un JPEG o non ha marker standard. EXIF potrebbe non esserci.");
  }

  // 3) trova APP1 EXIF
  let offset = 2;
  let exifStart = -1;
  while (offset + 4 <= view.byteLength) {
    const marker = view.getUint16(offset); offset += 2;
    if ((marker & 0xFF00) !== 0xFF00) break; // non è un marker valido
    const size = view.getUint16(offset); offset += 2; // include i 2 byte di size
    if (marker === 0xFFE1) { // APP1
      // deve iniziare con "Exif\0\0"
      const isExif =
        view.getUint8(offset)   === 0x45 && // E
        view.getUint8(offset+1) === 0x78 && // x
        view.getUint8(offset+2) === 0x69 && // i
        view.getUint8(offset+3) === 0x66 && // f
        view.getUint8(offset+4) === 0x00 &&
        view.getUint8(offset+5) === 0x00;
      if (isExif) {
        exifStart = offset + 6; // inizio header TIFF
      }
      break; // ci fermiamo al primo APP1
    } else {
      offset += size - 2; // salta il segmento
    }
  }

  let exif = {};
  if (exifStart >= 0) {
    exif = parseExif(view, exifStart);
    console.log("EXIF:", exif);
    if (exif.lensModel) {
      console.log("Lens Model:", exif.lensModel);
    }
    if (exif.exposureTimeStr) {
      console.log("Exposure Time:", exif.exposureTimeStr, "(", exif.exposureTime, "s)");
    }
  } else {
    console.log("Nessun segmento EXIF trovato.");
  }

  return exif;
}



function parseExif(view, tiffStart) {
  // Byte order: "II" 0x4949 little endian, "MM" 0x4D4D big endian
  const byteOrder = view.getUint16(tiffStart);
  const little = byteOrder === 0x4949;
  const get16 = (o) => view.getUint16(o, little);
  const get32 = (o) => view.getUint32(o, little);

  const magic = get16(tiffStart + 2);
  if (magic !== 0x002A) return {};

  const ifd0Offset = get32(tiffStart + 4);
  const ifd0Ptr = tiffStart + ifd0Offset;
  const numEntries = get16(ifd0Ptr);

  const TAG_ORIENTATION = 0x0112;
  const TAG_DATETIME    = 0x0132;
  const TAG_EXPOSURETIME = 0x829A; // Exposure time (in EXIF IFD)
  const TAG_LENSMODEL = 0xA434;    // Lens model (in EXIF IFD)

  const TYPE_BYTE = 1, TYPE_ASCII = 2, TYPE_SHORT = 3, TYPE_LONG = 4; // bastano per i tag che leggiamo
  const typeSize = { 1:1, 2:1, 3:2, 4:4 };

  let result = {};

  for (let i = 0; i < numEntries; i++) {
    const entry = ifd0Ptr + 2 + i * 12;
    const tag   = get16(entry);
    const type  = get16(entry + 2);
    const count = get32(entry + 4);
    const valueOrOffset = entry + 8; // contains value inline or offset to data
    const unit = typeSize[type] || 1;
    const byteCount = unit * count;

    let valuePtr;
    if (byteCount <= 4) {
      valuePtr = valueOrOffset;
    } else {
      const dataOffset = get32(valueOrOffset);
      valuePtr = tiffStart + dataOffset;
    }

    if (tag === TAG_ORIENTATION && type === TYPE_SHORT && count === 1) {
      result.orientation = view.getUint16(valuePtr, little);
    }

    if (tag === TAG_DATETIME && type === TYPE_ASCII && count >= 10) {
      // typical format "YYYY:MM:DD HH:MM:SS"
      let chars = [];
      for (let k = 0; k < count; k++) {
        const c = view.getUint8(valuePtr + k);
        if (c === 0) break;
        chars.push(String.fromCharCode(c));
      }
      result.dateTime = chars.join("");
    }

    // Lens Model (TAG_LENSMODEL, ASCII)
    if (tag === TAG_LENSMODEL && type === TYPE_ASCII && count > 0) {
      let chars = [];
      for (let k = 0; k < count; k++) {
        const c = view.getUint8(valuePtr + k);
        if (c === 0) break;
        chars.push(String.fromCharCode(c));
      }
      result.lensModel = chars.join("");
    }
  }

  // To get ExposureTime, need to parse EXIF IFD (not in IFD0)
  // Find pointer to EXIF IFD (tag 0x8769)
  const TAG_EXIFIFD = 0x8769;
  for (let i = 0; i < numEntries; i++) {
    const entry = ifd0Ptr + 2 + i * 12;
    const tag   = get16(entry);
    if (tag === TAG_EXIFIFD) {
      const exifIfdOffset = get32(entry + 8);
      const exifIfdPtr = tiffStart + exifIfdOffset;
      const exifNumEntries = get16(exifIfdPtr);
      for (let j = 0; j < exifNumEntries; j++) {
        const exifEntry = exifIfdPtr + 2 + j * 12;
        const exifTag   = get16(exifEntry);
        const exifType  = get16(exifEntry + 2);
        const exifCount = get32(exifEntry + 4);
        const exifValueOrOffset = exifEntry + 8;
        const exifUnit = typeSize[exifType] || 1;
        const exifByteCount = exifUnit * exifCount;
        let exifValuePtr;
        if (exifByteCount <= 4) {
          exifValuePtr = exifValueOrOffset;
        } else {
          const exifDataOffset = get32(exifValueOrOffset);
          exifValuePtr = tiffStart + exifDataOffset;
        }
        // ExposureTime is a RATIONAL (type 5)
        if (exifTag === TAG_EXPOSURETIME && exifType === 5 && exifCount === 1) {
          // RATIONAL: 2x 4 bytes (numerator, denominator)
          const num = view.getUint32(exifValuePtr, little);
          const den = view.getUint32(exifValuePtr + 4, little);
          if (den !== 0) {
            result.exposureTime = num / den;
            result.exposureTimeStr = num + "/" + den;
          }
        }
      }
    }
  }

  return result;
}

// Make the function available globally if in a browser environment
if (typeof window !== 'undefined') {
  window.setBackgroundAndReadExif = setBackgroundAndReadExif;
}