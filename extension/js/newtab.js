class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const wrapper = document.createElement('div');
    wrapper.style.border = '1px solid #ccc';
    wrapper.style.padding = '16px';
    wrapper.style.borderRadius = '6px';
    wrapper.style.background = '#f0f0f0';
    wrapper.style.fontFamily = 'sans-serif';

    const title = document.createElement('h3');
    title.textContent = this.getAttribute('title') || 'Senza titolo';
    title.style.margin = '0 0 6px';

    const content = document.createElement('p');
    content.textContent = this.getAttribute('content') || '';

    wrapper.appendChild(title);
    wrapper.appendChild(content);
    this.shadowRoot.appendChild(wrapper);
  }
}

customElements.define('my-card', MyCard);

console.log("✅ newtab.js caricato");
