# image-tag

`image-tag` is an HTML custom element intended to represent the functionality of [`image-tag`](https://components.howles.dev/display/image-tag) in the [@lewishowles/components](https://components.howles.dev) library.

This was chosen as a simple, but non-trivial component, and an introduction to what is and isn't possible within a custom element.

## Usage

As custom elements require a closing tag, basic usage takes the form:

```html
<image-tag src="https://picsum.photos/300/300"></image-tag>
```

The source of the image is applied to an internal `img` tag, and if that image fails to load, our fallback appears instead.
