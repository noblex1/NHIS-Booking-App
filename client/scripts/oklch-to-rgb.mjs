function oklchToRgb(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  let l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = l - 0.0894841775 * a - 1.291485548 * b;
  l_ = l_ ** 3;
  m_ = m_ ** 3;
  s_ = s_ ** 3;
  const r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const g = -1.2684380046 * l_ + 2.6097574015 * m_ - 0.3413193965 * s_;
  const bl = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
  const clip = (x) => Math.max(0, Math.min(255, Math.round(x * 255)));
  return [clip(r), clip(g), clip(bl)];
}

const tokens = {
  primary: [0.62, 0.16, 250],
  primaryGlow: [0.72, 0.14, 240],
  secondary: [0.7, 0.14, 155],
  foreground: [0.22, 0.04, 240],
  muted: [0.96, 0.01, 230],
  mutedForeground: [0.5, 0.03, 240],
  accent: [0.95, 0.04, 200],
  border: [0.92, 0.015, 230],
  background: [0.99, 0.005, 220],
  card: [1, 0, 0],
  destructive: [0.6, 0.22, 27],
  primaryForeground: [1, 0, 0],
};

console.log(JSON.stringify(
  Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [k, oklchToRgb(...v)]),
  ),
  null,
  2,
));
