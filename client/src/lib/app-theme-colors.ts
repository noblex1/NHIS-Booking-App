/**
 * RGB values for PDF/export — converted from client/src/styles.css (:root oklch tokens).
 * Keep in sync with --primary, --secondary, --foreground, etc.
 */
export type Rgb = readonly [number, number, number];

export const APP_THEME_RGB = {
  /** --primary oklch(0.62 0.16 250) */
  primary: [4, 64, 193] as Rgb,
  /** --primary-glow oklch(0.72 0.14 240) */
  primaryGlow: [13, 109, 228] as Rgb,
  /** gradient-hero end oklch(0.7 0.14 200) */
  primaryGradientEnd: [0, 121, 135] as Rgb,
  /** --primary-foreground */
  primaryForeground: [255, 255, 255] as Rgb,
  /** --secondary oklch(0.7 0.14 155) */
  secondary: [16, 121, 47] as Rgb,
  /** --secondary-foreground */
  secondaryForeground: [255, 255, 255] as Rgb,
  /** --foreground oklch(0.22 0.04 240) */
  foreground: [0, 3, 6] as Rgb,
  /** --muted-foreground oklch(0.5 0.03 240) */
  mutedForeground: [23, 34, 44] as Rgb,
  /** --muted oklch(0.96 0.01 230) */
  muted: [213, 229, 238] as Rgb,
  /** --accent oklch(0.95 0.04 200) */
  accent: [162, 238, 242] as Rgb,
  /** --accent-foreground oklch(0.3 0.08 240) */
  accentForeground: [0, 8, 21] as Rgb,
  /** --border oklch(0.92 0.015 230) */
  border: [181, 203, 215] as Rgb,
  /** --background oklch(0.99 0.005 220) */
  background: [240, 250, 253] as Rgb,
  /** --card */
  card: [255, 255, 255] as Rgb,
  /** --destructive oklch(0.6 0.22 27) */
  destructive: [202, 6, 7] as Rgb,
} as const;
