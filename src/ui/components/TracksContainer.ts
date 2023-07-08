(() => {
  const template = document.createElement("template");
  template.innerHTML = `
    <div></div>
  `;

  class TracksContainer extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const shadow = this.attachShadow({ mode: "open" });
      shadow.append(template.content.cloneNode(true));
    }
  }

  customElements.define("tracks-container", TracksContainer);
})();
