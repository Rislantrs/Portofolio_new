export const siteTheme = {
  colors: {
    bg: "#050505",
    surface: "#161616",
    text: "#f4f4f4",
    muted: "#a8a8a8",
    accent: "#d7d7d7",
    accentLight: "#ffffff",
  },
};

export const performanceConfig = {
  smallScreenMax: 390,
  mobileMax: 767,
  tabletMax: 1024,
  // Threshold "benar-benar kentang" diperketat: hanya hardware ekstrem (≤2GB RAM atau ≤2 core)
  // yang dikombinasikan dengan true mobile device yang masuk lite mode
  lowMemoryGB: 2,
  lowCpuCores: 2,
  enableSmoothScrollOnMobile: true,   // Lenis aktif di mobile agar scroll tidak kaku
  enableCustomCursorOnTouch: false,
  enableInkCanvasInLiteMode: false,
  enableHeroBlobLoopInLiteMode: false,
};
