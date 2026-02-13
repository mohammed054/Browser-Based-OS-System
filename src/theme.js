/**
 * Design System & Theme Tokens
 * Custom design system for Browser-Based OS System
 */

// Color Palette
export const colors = {
  // Backgrounds
  background: '#0B0F14',
  panel: '#111827',
  windowBg: '#0F172A',
  
  // Accents
  accentPrimary: '#38BDF8',    // Cyan
  accentSecondary: '#A855F7',  // Purple
  accentTertiary: '#22C55E',   // Green
  accentQuaternary: '#EF4444', // Red
  
  // Text
  textPrimary: '#E5E7EB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textInverted: '#0B0F14',
  
  // Interactive
  hover: '#1F2937',
  active: '#0B1220',
  
  // Semantic
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#38BDF8'
};

// Typography
export const typography = {
  // System Font Stack
  system: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  
  // Heading Font Stack
  heading: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  
  // Terminal Font Stack
  terminal: '"JetBrains Mono", "Fira Code", "Consolas", "Monaco", monospace',
  
  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  // Font Sizes
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
};

// Spacing & Layout
export const spacing = {
  // Base unit: 8px
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
};

// Window & Component Dimensions
export const dimensions = {
  // Window
  windowPadding: '16px',
  windowMargin: '8px',
  windowHeaderHeight: '40px',
  windowBorderRadius: '12px',
  
  // Desktop Icons
  iconSize: '48px',
  iconLabelHeight: '20px',
  
  // Taskbar
  taskbarHeight: '48px',
  
  // Buttons
  buttonPadding: '8px 16px',
  buttonBorderRadius: '8px',
  
  // Inputs
  inputPadding: '8px',
  inputBorderRadius: '6px'
};

// Animations
export const animations = {
  // Window Transitions
  windowOpen: 'transform 180ms ease-out, opacity 180ms ease-out',
  windowClose: 'transform 180ms ease-in, opacity 180ms ease-in',
  
  // Hover Effects
  hover: 'transform 150ms ease-in-out, box-shadow 150ms ease-in-out',
  scaleUp: 'transform 150ms ease-in-out',
  
  // Background
  backgroundNoise: 'noise 20s linear infinite',
  
  // Transforms
  scaleIn: 'scale(0.96)',
  scaleOut: 'scale(1.05)',
  scaleNormal: 'scale(1)'
};

// Shadows
export const shadows = {
  window: '0 20px 40px rgba(0, 0, 0, 0.4)',
  windowHover: '0 25px 50px rgba(56, 189, 248, 0.2)',
  button: '0 4px 12px rgba(0, 0, 0, 0.3)',
  buttonHover: '0 6px 20px rgba(56, 189, 248, 0.4)',
  inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
};

// Z-Index Scale
export const zIndex = {
  desktop: 1,
  window: 2000,
  windowDragging: 2500,    // Increased to ensure windows stay above context menus when dragging
  contextMenu: 3000,       // Reduced to allow window dragging above it
  overlay: 15000
};

// Theme Object
export const theme = {
  colors,
  typography,
  spacing,
  dimensions,
  animations,
  shadows,
  zIndex
};

// CSS-in-JS Style Helpers
export const createWindowStyle = (isActive = false) => ({
  backgroundColor: theme.colors.windowBg,
  borderRadius: theme.dimensions.windowBorderRadius,
  boxShadow: isActive ? theme.shadows.windowHover : theme.shadows.window,
  border: `1px solid ${theme.colors.accentPrimary}`,
  transition: theme.animations.windowOpen,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
});

export const createButtonStyle = (variant = 'primary') => {
  const baseStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.dimensions.buttonBorderRadius,
    border: 'none',
    cursor: 'pointer',
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.system,
    transition: theme.animations.hover,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm
  };

  const variants = {
    primary: {
      ...baseStyle,
      backgroundColor: theme.colors.accentPrimary,
      color: theme.colors.textInverted,
      boxShadow: theme.shadows.button,
      '&:hover': {
        transform: theme.animations.scaleOut,
        boxShadow: theme.shadows.buttonHover,
        filter: 'brightness(1.1)'
      },
      '&:active': {
        transform: theme.animations.scaleIn,
        boxShadow: theme.shadows.inset
      }
    },
    secondary: {
      ...baseStyle,
      backgroundColor: theme.colors.panel,
      color: theme.colors.textPrimary,
      border: `1px solid ${theme.colors.accentPrimary}`,
      '&:hover': {
        backgroundColor: theme.colors.hover,
        transform: theme.animations.scaleOut
      }
    },
    danger: {
      ...baseStyle,
      backgroundColor: theme.colors.error,
      color: theme.colors.textInverted,
      '&:hover': {
        filter: 'brightness(1.1)',
        transform: theme.animations.scaleOut
      }
    }
  };

  return variants[variant] || variants.primary;
};

export const createInputStyle = () => ({
  backgroundColor: theme.colors.panel,
  color: theme.colors.textPrimary,
  border: `1px solid ${theme.colors.accentPrimary}`,
  borderRadius: theme.dimensions.inputBorderRadius,
  padding: theme.dimensions.inputPadding,
  fontSize: theme.typography.sizes.base,
  fontFamily: theme.typography.system,
  transition: theme.animations.hover,
  '&:focus': {
    outline: 'none',
    border: `2px solid ${theme.colors.accentSecondary}`,
    boxShadow: `0 0 15px ${theme.colors.accentSecondary}40`
  },
  '&::placeholder': {
    color: theme.colors.textMuted
  }
});

export default theme;
