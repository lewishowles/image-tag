class ImageTag extends HTMLElement {
	static observedAttributes = ["src"];

	// Our shadow root, to which we attach our elements.
	shadow = null;
	// Whether the instance has been connected yet.
	isConnected = false;
	// Our created image element.
	imageElement = null;
	// The source URL for our image.
	imageSource = null;
	// We monitor individual attributes
	imageAttributes = {};

	constructor() {
		super();

		// Initialise our shadow
		this.shadow = this.attachShadow({ mode: "open" });
	}

	// "connected" defines when an instance of our element has been created and
	// added to the page.
	connectedCallback() {
		// We track our connection so that we don't create multiple elements
		// unnecessarily, for example if attributes are "changed" before the
		// element is connected.
		this.isConnected = true;

		this.generateImage();
	}

	/**
	 * Monitor attribute changes, reacting appropriately.
	 *
	 * @param  {string}  name
	 *     The name of the attribute that has changed.
	 * @param  {string}  oldValue
	 *     The old value of the attribute.
	 * @param  {string}  newValue
	 *     The new value of the attribute.
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		// If nothing has changed, we don't need to do anything.
		if (newValue === oldValue) {
			return;
		}

		switch(name) {
			case "src":
				this.imageSource = newValue;
			break;
		}

		// Initial attributes are often "changed" before the instance is
		// connected. In this case, we'll generate our image when connected
		// instead.
		if (!this.isConnected) {
			return;
		}

		this.generateImage();
	}

	/**
	 * Generate an instance of our image.
	 */
	generateImage() {
		// If we don't have a valid source, ignore it for now.
		if (typeof this.imageSource !== "string" || this.imageSource === "") {
			return;
		}

		// Remove any existing image, so we have a clean slate.
		if (this.imageElement) {
			this.shadow.removeChild(this.imageElement);
		}

		this.imageElement = document.createElement("img");

		// Copy over any additional attributes that may appear on the original
		// custom element definition.
		for (const attributeName of this.getAttributeNames()) {
			if (!ImageTag.observedAttributes.includes(attributeName)) {
				const attributeValue = this.getAttribute(attributeName);

				// Attributes without values are treated as boolean attributes,
				// and the value of other attributes is copied.
				if (attributeValue === "" || attributeValue === null) {
					this.imageElement.setAttribute(attributeName, "");
				} else {
					this.imageElement.setAttribute(attributeName, attributeValue);
				}
			}
		}

		// We apply our source last, just in case.
		this.imageElement.src = this.imageSource;

		this.shadow.appendChild(this.imageElement);
	}
}

customElements.define("image-tag", ImageTag);
