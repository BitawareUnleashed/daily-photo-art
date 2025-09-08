# Daily Photo Art - Guida Sviluppatore

## Panoramica del Progetto

Daily Photo Art è un'estensione Chrome che trasforma ogni nuova scheda in un'esperienza visiva personalizzata con immagini artistiche, meteo locale, gestione todo e citazioni motivazionali. L'architettura è modulare e basata su un design system glassmorphism per un'interfaccia moderna e accessibile.

## Indice della Documentazione

### 📁 Documentazione JavaScript
- **[main.js](js/main.md)** - Controller principale e orchestrazione moduli
- **[newtab.js](js/newtab.md)** - Gestione interfaccia nuova scheda e modalità clean
- **[downloadBackground.js](js/downloadBackground.md)** - Sistema download e gestione immagini di sfondo
- **[meteo.js](js/meteo.md)** - API meteo, geolocalizzazione e visualizzazione dati
- **[todo.js](js/todo.md)** - Task management, persistenza locale e interfaccia utente
- **[popover.js](js/popover.md)** - Sistema overlay modali e menu dropdown
- **[sw.js](js/sw.md)** - Service Worker, cache e gestione offline
- **[utils.js](js/utils.md)** - Utility condivise e funzioni helper
- **[quotes.js](js/quotes.md)** - Sistema citazioni con API esterna e cache
- **[quotes_fixed.js](js/quotes_fixed.md)** - Sistema citazioni locale (DEPRECATED - non utilizzato)

### 🎨 Documentazione CSS
- **[variables.css](css/variables-css.md)** - Design tokens, colori e proprietà CSS custom
- **[layout.css](css/layout-css.md)** - Sistema griglia, flexbox e layout responsive
- **[buttons.css](css/buttons-css.md)** - Bottoni glassmorphism e elementi interattivi
- **[popover.css](css/popover-css.md)** - Overlay modali e pannelli flottanti
- **[todo.css](css/todo-css.md)** - Interfaccia gestione task e checkbox personalizzati
- **[weather.css](css/weather-css.md)** - Componenti visualizzazione meteo
- **[welcome.css](css/welcome-css.md)** - Schermate onboarding e configurazione
- **[animations.css](css/animations-css.md)** - Animazioni, transizioni e effetti visivi

## Architettura del Sistema

### 🔧 Struttura Modulare

```
daily-photo-art/
├── manifest.json          # Configurazione estensione Chrome
├── newtab.html            # Template principale nuova scheda
├── sw.js                  # Service Worker
├── js/                    # Moduli JavaScript
│   ├── main.js           # Entry point e coordinazione
│   ├── newtab.js         # Interfaccia utente principale
│   ├── downloadBackground.js # Sistema immagini
│   ├── meteo.js          # Servizi meteorologici
│   ├── todo.js           # Gestione task
│   ├── popover.js        # Overlay e menu
│   ├── utils.js          # Utility condivise
│   └── quotes.js         # Sistema citazioni
├── css/                  # Fogli di stile modulari
│   ├── variables.css     # Design system foundations
│   ├── layout.css        # Layout e griglia
│   ├── buttons.css       # Componenti interattivi
│   ├── popover.css       # Overlay e modal
│   ├── todo.css          # Interfaccia task
│   ├── weather.css       # Componenti meteo
│   ├── welcome.css       # Onboarding
│   └── animations.css    # Effetti e transizioni
└── assets/               # Risorse statiche
    ├── default-bg.jpg
    ├── favicon.ico
    └── icon128.png
```

### 🔄 Flusso di Inizializzazione

1. **Service Worker** (`sw.js`) - Cache e gestione offline
2. **Main Controller** (`main.js`) - Coordinazione moduli
3. **Interfaccia Utente** (`newtab.js`) - Rendering componenti
4. **Servizi Esterni** (`meteo.js`, `quotes.js`) - Caricamento dati
5. **Background System** (`downloadBackground.js`) - Gestione immagini

### 🎨 Design System

#### Glassmorphism Theme
- **Trasparenze**: `rgba(255, 255, 255, 0.1)` - `rgba(255, 255, 255, 0.25)`
- **Backdrop Blur**: `blur(10px)` per effetti vetro
- **Border Radius**: 8px-15px per consistenza visiva
- **Shadows**: Sottili ombre per profondità

#### Tipografia
- **Font Family**: System fonts con fallback sicuri
- **Sizing Scale**: 12px-24px con incrementi logici
- **Line Height**: 1.4-1.6 per leggibilità ottimale

## Guide di Sviluppo

### 🚀 Setup Ambiente di Sviluppo

1. **Clona Repository**
   ```bash
   git clone https://github.com/BitawareUnleashed/daily-photo-art.git
   cd daily-photo-art/extension
   ```

2. **Caricamento in Chrome**
   - Vai a `chrome://extensions/`
   - Abilita "Modalità sviluppatore"
   - Clicca "Carica estensione non pacchettizzata"
   - Seleziona la cartella `extension`

3. **Tools Raccomandati**
   - VS Code con estensioni: ESLint, Prettier, Live Server
   - Chrome DevTools per debugging
   - Git per version control

### 🔧 Aggiungere Nuove Funzionalità

#### 1. Nuovo Modulo JavaScript

```javascript
// 1. Creare file in js/nome-modulo.js
export class NuovoModulo {
    constructor() {
        this.inizializza();
    }
    
    inizializza() {
        // Logica di inizializzazione
    }
}

// 2. Aggiungere in main.js
import { NuovoModulo } from './js/nome-modulo.js';

// 3. Inizializzare nel DOMContentLoaded
const nuovoModulo = new NuovoModulo();
```

#### 2. Nuovo Componente CSS

```css
/* 1. Aggiungere variabili in variables.css */
:root {
    --nuovo-componente-bg: rgba(255, 255, 255, 0.1);
    --nuovo-componente-radius: 10px;
}

/* 2. Creare css/nuovo-componente.css */
.nuovo-componente {
    background: var(--nuovo-componente-bg);
    border-radius: var(--nuovo-componente-radius);
    backdrop-filter: blur(10px);
}

/* 3. Importare in newtab.html */
<link rel="stylesheet" href="css/nuovo-componente.css">
```

### 🔍 Testing e Debugging

#### JavaScript Debugging
```javascript
// Usa console.log strategici
console.log('[ModuleName]:', 'Messaggio debug', variabile);

// Gestione errori
try {
    // Codice potenzialmente problematico
} catch (error) {
    console.error('[ModuleName] Errore:', error);
}
```

#### CSS Debugging
```css
/* Outline temporaneo per layout debugging */
* {
    outline: 1px solid red !important;
}

/* Verificare z-index */
.debug-z-index {
    position: relative;
    z-index: 9999 !important;
    background: rgba(255, 0, 0, 0.3) !important;
}
```

### 🛠️ Manutenzione

#### 1. Aggiornamento API
- **Meteo**: Verificare endpoint OpenWeatherMap in `meteo.js`
- **Citazioni**: Controllare API quotable.io in `quotes.js`
- **Immagini**: Monitorare source immagini in `downloadBackground.js`

#### 2. Performance Monitoring
- **Memoria**: Verificare gestione immagini e cache
- **Network**: Ottimizzare chiamate API
- **Storage**: Pulire periodicamente localStorage obsoleto

#### 3. Compatibilità Browser
- **Chrome Extensions**: Seguire Manifest V3 guidelines
- **CSS**: Verificare supporto proprietà moderne
- **JavaScript**: Mantenere compatibilità ES6+

## Workflow di Sviluppo

### 🔄 Processo di Feature Development

1. **Analisi Requisiti**
   - Identificare moduli coinvolti
   - Verificare impatti su performance
   - Pianificare testing

2. **Implementazione**
   - Seguire pattern architetturali esistenti
   - Mantenere separazione concerns
   - Documentare durante sviluppo

3. **Testing**
   - Test funzionale su Chrome
   - Verificare responsiveness
   - Controllare performance

4. **Documentazione**
   - Aggiornare file .md relevanti
   - Aggiornare questa guida se necessario
   - Documentare breaking changes

### 📝 Convenzioni Naming

#### JavaScript
```javascript
// Classi: PascalCase
class GestoreImmagini {}

// Funzioni: camelCase  
function caricaImmagine() {}

// Costanti: UPPER_SNAKE_CASE
const API_KEY_METEO = 'xyz';

// Variabili: camelCase
let statoCorrente = 'loading';
```

#### CSS
```css
/* Classi: kebab-case */
.glassmorphism-button {}

/* ID: kebab-case */
#weather-display {}

/* Variabili CSS: kebab-case */
--primary-color: #ffffff;
```

### 🚨 Troubleshooting Comune

#### Problemi Frequenti

1. **Immagini non si caricano**
   - Verificare permessi manifest.json
   - Controllare CORS headers
   - Debug network tab DevTools

2. **Stili non applicati**
   - Verificare ordine import CSS
   - Controllare specificità selettori
   - Validare CSS syntax

3. **JavaScript errors**
   - Verificare import/export modules
   - Controllare async/await handling
   - Debug console errors

#### Debug Commands
```javascript
// Stato globale estensione
console.log('Extension State:', {
    weather: window.weatherData,
    todos: localStorage.getItem('todos'),
    background: document.body.style.backgroundImage
});

// Performance metrics
console.time('InitTime');
// ... codice da misurare
console.timeEnd('InitTime');
```

## Roadmap e Miglioramenti Futuri

### 🎯 Feature Pianificate
- [ ] Sistema temi personalizzabili
- [ ] Integrazione calendar eventi
- [ ] Widget productivity aggiuntivi
- [ ] Sync cross-device settings
- [ ] Accessibilità avanzata (screen readers)

### 🔧 Refactoring Tecnico
- [ ] Migrazione completa Manifest V3
- [ ] TypeScript conversion
- [ ] Unit testing framework
- [ ] Performance monitoring
- [ ] Bundle optimization

### 📊 Metriche di Qualità
- **Performance**: Tempo caricamento < 500ms
- **Accessibilità**: WCAG 2.1 AA compliance
- **Code Quality**: ESLint/Prettier enforcement
- **Documentation**: 100% API coverage

## Contatti e Supporto

- **Repository**: [BitawareUnleashed/daily-photo-art](https://github.com/BitawareUnleashed/daily-photo-art)
- **Issues**: Utilizzare GitHub Issues per bug reports
- **Documentazione**: Mantenere aggiornati i file .md
- **Code Review**: Richiesto per tutte le modifiche

---

*Questa guida è viva e deve essere aggiornata con ogni modifica significativa al codebase. Ogni sviluppatore ha la responsabilità di mantenere la documentazione sincronizzata con il codice.*
