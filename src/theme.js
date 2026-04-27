export const colors = {
  background: 'var(--os-bg)',
  panel: 'var(--os-panel)',
  windowBg: 'var(--os-window)',
  accentPrimary: 'var(--os-accent)',
  accentSecondary: 'var(--os-highlight)',
  accentTertiary: 'var(--os-success)',
  accentQuaternary: 'var(--os-danger)',
  textPrimary: 'var(--os-text)',
  textSecondary: 'var(--os-text-soft)',
  textMuted: 'var(--os-text-muted)',
  textInverted: 'var(--os-bg)',
  hover: 'var(--os-panel-strong)',
  active: 'var(--os-panel-strong)',
  error: 'var(--os-danger)',
  success: 'var(--os-success)',
  warning: 'var(--os-warning)',
  info: 'var(--os-accent)'
}

export const typography = {
  system: '"Space Grotesk", "Segoe UI", sans-serif',
  heading: '"Space Grotesk", "Segoe UI", sans-serif',
  terminal: '"IBM Plex Mono", "JetBrains Mono", monospace',
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  sizes: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '32px'
  }
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px'
}

export const dimensions = {
  windowPadding: '16px',
  windowMargin: '8px',
  windowHeaderHeight: '42px',
  windowBorderRadius: '14px',
  iconSize: '48px',
  iconLabelHeight: '20px',
  taskbarHeight: '48px',
  buttonPadding: '8px 16px',
  buttonBorderRadius: '8px',
  inputPadding: '10px 12px',
  inputBorderRadius: '8px'
}

export const animations = {
  windowOpen: 'transform 180ms ease-out, opacity 180ms ease-out, box-shadow 180ms ease-out',
  windowClose: 'transform 180ms ease-in, opacity 180ms ease-in',
  hover: 'transform 150ms ease-in-out, box-shadow 150ms ease-in-out, background-color 150ms ease-in-out',
  scaleUp: 'transform 150ms ease-in-out',
  backgroundNoise: 'noise 20s linear infinite',
  scaleIn: 'scale(0.96)',
  scaleOut: 'scale(1.03)',
  scaleNormal: 'scale(1)'
}

export const shadows = {
  window: '0 24px 80px rgba(2, 6, 23, 0.48)',
  windowHover: '0 28px 90px rgba(2, 6, 23, 0.6)',
  button: '0 10px 30px rgba(2, 6, 23, 0.18)',
  buttonHover: '0 12px 34px rgba(2, 6, 23, 0.25)',
  inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
}

export const zIndex = {
  desktop: 1,
  icon: 5,
  window: 2000,
  windowDragging: 2500,
  contextMenu: 3000,
  overlay: 15000
}

export const theme = {
  colors,
  typography,
  spacing,
  dimensions,
  animations,
  shadows,
  zIndex
}

export const createWindowStyle = (isActive = false) => ({
  backgroundColor: theme.colors.windowBg,
  borderRadius: theme.dimensions.windowBorderRadius,
  boxShadow: isActive ? theme.shadows.windowHover : theme.shadows.window,
  border: `1px solid ${isActive ? 'var(--os-accent-muted)' : 'var(--os-border-strong)'}`,
  transition: theme.animations.windowOpen,
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)'
})

export default theme
