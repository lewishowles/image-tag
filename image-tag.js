class ImageTag extends HTMLElement {
	// Our shadow root, to which we attach our elements.
	shadow = null;

	constructor() {
		super();

		// Initialise our shadow
		this.shadow = this.attachShadow({ mode: "open" });
	}
}

customElements.define("image-tag", ImageTag);
