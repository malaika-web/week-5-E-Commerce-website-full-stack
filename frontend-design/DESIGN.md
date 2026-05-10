---
name: NovaCart Luminescence
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1d1b20'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#63597c'
  on-secondary: '#ffffff'
  secondary-container: '#e1d4fd'
  on-secondary-container: '#645a7d'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 32px
  margin-page: 64px
  section-gap: 120px
  element-gap: 24px
---

## Brand & Style

This design system is built for a high-end, futuristic e-commerce experience that blends the precision of modern SaaS with the tactile luxury of physical fashion. The brand personality is visionary, sophisticated, and effortless.

The visual style is a refined **Glassmorphism**, emphasizing depth through translucent layers, frosted textures, and spectral light play. The atmosphere mimics a digital showroom—clean, expansive, and high-contrast—utilizing floating elements and animated "aura" blobs to create a sense of living, breathing technology. Every interaction should feel like a premium ritual, evoking trust through structural clarity and delight through ethereal aesthetics.

## Colors

The palette is anchored by the "Electric Violet" primary gradient, which serves as the signature of luxury and innovation. Backgrounds utilize a "Cool-to-Neutral" progression from Ice Blue to pure White, providing a crisp, airy foundation that allows products to pop.

Accent colors are used sparingly for micro-interactions and status indicators (e.g., Emerald for success, Vivid Blue for informational highlights). Dark Slate is reserved for high-contrast typography to ensure legibility against the luminous background layers.

## Typography

This design system utilizes the **Inter** font family exclusively to maintain a systematic, architectural feel. The hierarchy is driven by extreme scale: oversized, bold headlines create a confident editorial look, while body text remains neutral and functional with generous line heights.

- **Headlines:** Use tight letter spacing for large headers to create a "blocky" high-end feel.
- **Labels:** Use uppercase for metadata and navigation categories to contrast with sentence-case headings.
- **Color:** Headlines should always use Slate Dark; secondary body text uses Slate Gray for subtle depth.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for desktop, centered within the viewport to maintain a gallery-like focus. 

- **Grid:** A 12-column system with wide 32px gutters to prevent visual clutter.
- **Rhythm:** Spacing follows a 4px baseline, but emphasizes large, "breathable" margins between sections (120px+) to signify luxury.
- **Alignment:** Content is generally left-aligned to ground the futuristic elements in a logical, easy-to-read structure.

## Elevation & Depth

Hierarchy is established through **optical layering** rather than traditional drop shadows.

1.  **Level 0 (Background):** Alice Blue or Ice Blue base with blurred gradient blobs (opacity 20-40%).
2.  **Level 1 (Cards/Sheets):** Pure White or 80% translucent White with a `24px` backdrop blur. Borders are `1px` solid white or a very faint Primary Gradient.
3.  **Level 2 (Active/Floating):** Use an "Ambient Glow"—a highly diffused shadow tinted with the Deep Indigo color (#6246EA) at 10% opacity, with a `40px` blur radius.
4.  **Glass Effect:** All overlays must include a subtle `inner-glow` (1px white stroke at 30% opacity) on the top and left edges to simulate light hitting glass.

## Shapes

The design system favors generous, organic curves. The standard radius for cards and major containers is `24px`, creating a soft, approachable silhouette. 

Interactive elements like inputs use a more refined `12px` radius. Pill shapes (`100px`) are reserved for chips, tags, and specific CTA buttons to distinguish them from structural layout elements.

## Components

- **Buttons:** Primary buttons feature the full Gradient fill with a soft purple outer glow (`0 8px 20px rgba(127, 90, 240, 0.3)`). Secondary buttons use a transparent background with a `1.5px` gradient border and white text.
- **Cards:** Product cards must use the Glassmorphism style: `backdrop-filter: blur(20px)`, a thin white border, and the `24px` corner radius. Content inside should be padded by at least `32px`.
- **Input Fields:** Subtly recessed or "hollow" looks. A light Ice Blue fill with a Slate Gray placeholder. On focus, the border transitions to the Electric Violet primary color.
- **Chips/Tags:** Small pill-shaped containers with Soft Lavender backgrounds and Deep Indigo text for high legibility.
- **Floating Navigation:** A bottom-fixed or top-centered navigation bar using a heavy glass blur, making it appear as if it is floating over the content blobs.
- **Animated Blobs:** Randomly positioned, slow-pulsing shapes behind the main content area to provide the "futuristic" atmosphere without distracting from the UI.