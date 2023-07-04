const template = document.createElement("template");
template.innerHTML = `
<details>
    <summary>
        <slot name="title"></slot>
    </summary>
    <slot name="content"></slot>
</details>
`;

class VisualizerControlBlock extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
  }
}

customElements.define("visualizer-control-block", VisualizerControlBlock);
