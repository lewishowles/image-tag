# image-tag

`image-tag` is an HTML custom element intended to represent the functionality of [`image-tag`](https://components.howles.dev/display/image-tag) in the [@lewishowles/components](https://components.howles.dev) library.

This was chosen as a simple, but non-trivial component, and an introduction to what is and isn't possible within a custom element.

## Usage

As custom elements require a closing tag, basic usage takes the form:

```html
<image-tag src="https://picsum.photos/300/300"></image-tag>
```

The source of the image is applied to an internal `img` tag, and if that image fails to load, our fallback appears instead.

## Styling

Various CSS variables are available to customise the image, and, primarily, the fallback.

| Variable Name | Default Value |
|-|-|
| `--image-height` | `100%` |
| `--image-width` | `100%` |
| `--fallback-background` | `oklch(98.4% 0.003 247.858)` |
| `--fallback-border-radius` | `0` |
| `--fallback-icon-colour` | `oklch(27.9% 0.041 260.031)` |
| `--fallback-height` | `var(--image-height, 100%)` |
| `--fallback-width` | `var(--image-width, 100%)` |
| `--fallback-icon-size` | `1.5rem` |

### Applying styles globally

To apply styles to all `image-tag` elements, the simplest method is to target the `image-tag` itself.

```css
image-tag {
	--image-height: 15rem;
	--image-width: 15rem;
}
```

### Applying styles locally

To apply styles to a single, or a subset or `image-tag` elements, you can target a custom selector, such as:

```css
.rose-fallback {
	--fallback-background: oklch(96.9% 0.015 12.422);
	--fallback-border-radius: 1rem;
	--fallback-icon-colour: oklch(45.5% 0.188 13.697);
	--fallback-icon-size: 2rem;
}
```
