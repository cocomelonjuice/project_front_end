/**
 * UI Design Tokens
 * Centralized design system constants for consistent styling across the application
 */

// Color Palette - Based on indigo theme from navbar/sidebar
export const UI_COLORS = {
  // Primary colors (indigo)
  primary: {
    main: '#6366f1', // indigo-500
    light: '#818cf8', // indigo-400
    dark: '#4f46e5', // indigo-600
    contrast: '#ffffff',
  },
  // Secondary colors
  secondary: {
    main: '#8b5cf6', // violet-500
    light: '#a78bfa', // violet-400
    dark: '#7c3aed', // violet-600
  },
  // Status colors
  success: {
    main: '#10b981', // emerald-500
    light: '#34d399', // emerald-400
    dark: '#059669', // emerald-600
    bg: '#d1fae5', // emerald-100
  },
  error: {
    main: '#ef4444', // red-500
    light: '#f87171', // red-400
    dark: '#dc2626', // red-600
    bg: '#fee2e2', // red-100
  },
  warning: {
    main: '#f59e0b', // amber-500
    light: '#fbbf24', // amber-400
    dark: '#d97706', // amber-600
    bg: '#fef3c7', // amber-100
  },
  info: {
    main: '#3b82f6', // blue-500
    light: '#60a5fa', // blue-400
    dark: '#2563eb', // blue-600
    bg: '#dbeafe', // blue-100
  },
  // Neutral colors
  text: {
    primary: '#1f2937', // gray-800
    secondary: '#6b7280', // gray-500
    disabled: '#9ca3af', // gray-400
    hint: '#9ca3af', // gray-400
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    subtle: '#f9fafb', // gray-50
    hover: '#f3f4f6', // gray-100
  },
  border: {
    light: '#e5e7eb', // gray-200
    medium: '#d1d5db', // gray-300
    dark: '#9ca3af', // gray-400
  },
  // Navbar/Sidebar colors (already established)
  navbar: {
    bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.85) 0%, rgba(79, 70, 229, 0.85) 100%)',
    text: '#ffffff',
  },
  sidebar: {
    bg: 'rgba(255, 255, 255, 0.6)',
    text: '#1f2937',
    active: '#6366f1',
  },
} as const;

// Typography Scale
export const UI_TYPOGRAPHY = {
  // Font families
  fontFamily: {
    primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },
  // Font sizes
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
} as const;

// Spacing Scale (based on 4px grid)
export const UI_SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const;

// Border Radius
export const UI_BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Shadows
export const UI_SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// Transitions
export const UI_TRANSITIONS = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
} as const;

// Z-index scale
export const UI_Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Button styles (for consistent button styling)
export const UI_BUTTON_STYLES = {
  primary: {
    backgroundColor: UI_COLORS.primary.main,
    color: UI_COLORS.primary.contrast,
    '&:hover': {
      backgroundColor: UI_COLORS.primary.dark,
      boxShadow: UI_SHADOWS.md,
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      backgroundColor: UI_COLORS.border.light,
      color: UI_COLORS.text.disabled,
    },
  },
  secondary: {
    backgroundColor: 'transparent',
    color: UI_COLORS.primary.main,
    border: `1px solid ${UI_COLORS.primary.main}`,
    '&:hover': {
      backgroundColor: UI_COLORS.primary.main,
      color: UI_COLORS.primary.contrast,
      boxShadow: UI_SHADOWS.sm,
    },
  },
  text: {
    color: UI_COLORS.primary.main,
    '&:hover': {
      backgroundColor: UI_COLORS.background.hover,
    },
  },
} as const;

// Form input styles
export const UI_INPUT_STYLES = {
  default: {
    '& .MuiOutlinedInput-root': {
      borderRadius: UI_BORDER_RADIUS.md,
      backgroundColor: UI_COLORS.background.default,
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: UI_COLORS.primary.light,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: UI_COLORS.primary.main,
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: UI_COLORS.text.secondary,
      '&.Mui-focused': {
        color: UI_COLORS.primary.main,
      },
    },
  },
} as const;

// Card styles
export const UI_CARD_STYLES = {
  default: {
    borderRadius: UI_BORDER_RADIUS.lg,
    boxShadow: UI_SHADOWS.md,
    backgroundColor: UI_COLORS.background.paper,
    transition: `box-shadow ${UI_TRANSITIONS.normal}, transform ${UI_TRANSITIONS.normal}`,
    '&:hover': {
      boxShadow: UI_SHADOWS.lg,
      transform: 'translateY(-2px)',
    },
  },
} as const;



