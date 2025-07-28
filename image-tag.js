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

	// Whether we have encountered an error loading this image.
	haveError = false;
	// The template for our fallback element.
	fallbackElementTemplate = null;
	// Our created fallback element.
	fallbackElement = null;

	constructor() {
		super();

		this.initialiseShadow();

		this.initialiseFallbackTemplate();
	}

	// Lifecycle handling

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
	 * @param	{string}	name
	 *		 The name of the attribute that has changed.
	 * @param	{string}	oldValue
	 *		 The old value of the attribute.
	 * @param	{string}	newValue
	 *		 The new value of the attribute.
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

	// Shadow DOM

	/**
	 * Initialise our shadow, including basic styling.
	 */
	initialiseShadow() {
		this.shadow = this.attachShadow({ mode: "open" });

		this.applyStyles();
	}

	/**
	 * Apply our basic styles to our fallback image.
	 */
	applyStyles() {
		const style = document.createElement("style");

		style.textContent = `
			.image-tag-img {
				height: var(--image-height, 100%);
				width: var(--image-width, 100%);
			}

			.image-tag-fallback {
				align-items: center;
				background-color: var(--fallback-background, oklch(98.4% 0.003 247.858));
				border-radius: var(--fallback-border-radius, 0);
				color: var(--fallback-icon-colour, oklch(27.9% 0.041 260.031));
				display: flex;
				height: var(--fallback-height, var(--image-height, 100%));
				justify-content: center;
				width: var(--fallback-width, var(--image-width, 100%));
			}

			.image-tag-fallback-icon {
				aspect-ratio: 1 / 1;
				height: auto;
				max-width: 100%;
				width: var(--fallback-icon-size, 1.5rem);
			}
		`;

		this.shadow.appendChild(style);
	}

	// Image handling

	/**
	 * Generate an instance of our image, removing any existing image, copying
	 * appropriate attributes, and attaching our event listener.
	 */
	generateImage() {
		// If we don't have a valid source, ignore it for now.
		if (typeof this.imageSource !== "string" || this.imageSource === "") {
			return;
		}

		this.haveError = false;

		// Remove any existing image or fallback, so we have a clean slate.
		this.destroyImage();
		this.destroyFallback();

		this.imageElement = document.createElement("img");

		this.applyImageAttributes();

		this.shadow.appendChild(this.imageElement);

		this.monitorImage();
	}

	/**
	 * Copy attributes from our root element down to our image, and apply any
	 * custom attributes as required.
	 */
	applyImageAttributes() {
		this.applyAttributes(this.imageElement);

		// We apply our source last, just in case.
		this.imageElement.src = this.imageSource;
		this.imageElement.classList.add("image-tag-img");
	}

	/**
	 * Monitor our image. If we detect an error, set our error state.
	 */
	monitorImage() {
		this.imageElement.addEventListener("error", () => {
			this.generateFallback();
		});
	}

	/**
	 * Destroy our image and references to it. Removing the element from our
	 * shadow DOM will automatically remove event listeners if there are no
	 * references to it remaining.
	 */
	destroyImage() {
		if (!this.imageElement) {
			return;
		}

		this.shadow.removeChild(this.imageElement);

		this.imageElement = null;
	}

	// Fallback handling

	/**
	 * Initialise our fallback element, ready to display if the image fails to
	 * load.
	 */
	initialiseFallbackTemplate() {
		this.fallbackElementTemplate = document.createElement('template');

		this.fallbackElementTemplate.innerHTML = `
			<div class="image-tag-fallback">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" role="presentation" class="image-tag-fallback-icon">
					<g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
						<path stroke="currentColor" d="m6.837 12.493 5.206-5.2a1 1 0 0 1 1.414 0l3.043 3.043" />
						<path stroke="currentColor" d="M2 7v6.5a2 2 0 0 0 2 2h8.5" />
						<rect width="11.5" height="9.5" x="5" y="3" stroke="currentColor" rx="2" transform="rotate(180 10.75 7.75)" />
						<path fill="currentColor" fill-rule="nonzero" d="M8.25 7.25c-.551 0-1-.449-1-1s.449-1 1-1 1 .449 1 1-.449 1-1 1" />
					</g>
				</svg>
			</div>
		`;
	}

	/**
	 * Generate a fallback to display to replace our image. This is used when
	 * the image fails to load.
	 */
	generateFallback() {
		this.destroyImage();

		const fallbackClone = this.fallbackElementTemplate.content.cloneNode(true);

		// We look for the first element in our clone so that we use the content
		// of the template, not the template itself.
		this.fallbackElement = fallbackClone.querySelector("*");

		this.applyFallbackAttributes();

		this.shadow.appendChild(this.fallbackElement);
	}

	/**
	 * Copy attributes from our root element down to our fallback.
	 */
	applyFallbackAttributes() {
		this.applyAttributes(this.fallbackElement);
	}

	/**
	 * Destroy our fallback element.
	 */
	destroyFallback() {
		if (!this.fallbackElement) {
			return;
		}

		this.shadow.removeChild(this.fallbackElement);

		this.fallbackElement = null;
	}

	// Utilities

	/**
	 * Copy attributes from ImageTag to the provided target.
	 */
	applyAttributes(target) {
		for (const attributeName of this.getAttributeNames()) {
			if (!ImageTag.observedAttributes.includes(attributeName)) {
				// We don't pass down classes, since any CSS applied to them
				// doesn't get applied through the shadow boundary anyway.
				if (attributeName === "class") {
					continue;
				}

				const attributeValue = this.getAttribute(attributeName);

				// Attributes without values are treated as boolean attributes,
				// and the value of other attributes is copied.
				if (attributeValue === "" || attributeValue === null) {
					target.setAttribute(attributeName, "");
				} else {
					target.setAttribute(attributeName, attributeValue);
				}
			}
		}
	}
}

customElements.define("image-tag", ImageTag);
