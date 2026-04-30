// App Constants
// export const API_ORIGIN = 'https://localhost:7200';
export const API_ORIGIN = 'https://handiness-sprang-elude.ngrok-free.dev';
export const API_BASE_URL = `${API_ORIGIN}/api`;
export const SOCKET_BASE_URL = API_ORIGIN;

export const USER_ROLES = {
  STUDENT: 'student',
  SHOPKEEPER: 'shopkeeper',
  DELIVERER: 'deliverer',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  PICKED: 'picked',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
};

export const DELIVERY_CHARGE = 100; // PKR

// ==========================================
// LAYOUT CONSTANTS - Responsive Spacing
// ==========================================
// Tab Bar Height (CustomTabBar)
export const TAB_BAR_HEIGHT = 72; // Container height
export const TAB_BAR_BOTTOM_MARGIN = 16; // bottom: 16 in CustomTabBar
export const TAB_BAR_TOTAL_HEIGHT = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN; // ~88px

// Safe Area Padding (for iPhone notch/Android system bar)
export const SAFE_AREA_BOTTOM = 0; // Additional safe area padding

// Total bottom spacing needed for content to clear the tab bar
export const CONTENT_BOTTOM_PADDING = TAB_BAR_TOTAL_HEIGHT + SAFE_AREA_BOTTOM; // ~104px

export const PRODUCT_CATEGORIES = [
  'Food & Beverages',
  'Stationery',
  'Electronics',
  'Clothing',
  'Books',
  'Sports',
  'Others',
];

// ==========================================
// MODERN DESIGN SYSTEM - Premium Campus UI
// ==========================================

// Primary Palette: Deep Blue + Emerald Accent
export const COLORS = {
  // Primary
  primary: '#1D4ED8',         // Deep Royal Blue
  primaryLight: '#3B82F6',    // Lighter blue
  primaryDark: '#1E3A5F',     // Navy
  primaryMuted: '#DBEAFE',    // Very light blue

  // Secondary
  secondary: '#0F172A',       // Slate 900
  secondaryLight: '#334155',  // Slate 700
  secondaryMuted: '#CBD5E1',  // Slate 300

  // Accent
  accent: '#10B981',          // Emerald 500
  accentLight: '#34D399',     // Emerald 400
  accentDark: '#059669',      // Emerald 600
  accentMuted: '#D1FAE5',     // Emerald 100

  // Semantic
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Neutrals (Slate)
  dark: '#0F172A',            // Slate 900
  darkSecondary: '#1E293B',   // Slate 800
  darkTertiary: '#334155',    // Slate 700
  gray: '#64748B',            // Slate 500
  grayLight: '#94A3B8',       // Slate 400
  grayMuted: '#CBD5E1',       // Slate 300
  light: '#F1F5F9',           // Slate 100
  lightSecondary: '#E2E8F0',  // Slate 200
  white: '#FFFFFF',
  offWhite: '#F8FAFC',        // Slate 50

  // Background
  background: '#F8FAFC',
  backgroundDark: '#0F172A',
  surface: '#FFFFFF',
  surfaceDark: '#1E293B',
  surfaceElevated: '#FFFFFF',

  // Glassmorphism
  glassLight: 'rgba(255, 255, 255, 0.72)',
  glassLightBorder: 'rgba(255, 255, 255, 0.5)',
  glassDark: 'rgba(15, 23, 42, 0.72)',
  glassDarkBorder: 'rgba(255, 255, 255, 0.1)',

  // Legacy compatibility mappings
  border: '#E2E8F0',
  card: '#FFFFFF',
};

// Modern Dark Mode Colors
export const DARK_COLORS = {
  ...COLORS,
  primary: '#60A5FA',
  primaryLight: '#93C5FD',
  primaryDark: '#3B82F6',
  primaryMuted: '#1E3A5F',

  // Background
  background: '#0F172A',
  backgroundDark: '#020617',
  surface: '#1E293B',
  surfaceDark: '#334155',
  surfaceElevated: '#1E293B',

  // Neutrals inverted
  dark: '#F1F5F9',
  darkSecondary: '#E2E8F0',
  darkTertiary: '#CBD5E1',
  gray: '#94A3B8',
  grayLight: '#64748B',
  grayMuted: '#475569',
  light: '#1E293B',
  lightSecondary: '#334155',
  white: '#0F172A',
  offWhite: '#1E293B',

  // Glassmorphism
  glassLight: 'rgba(15, 23, 42, 0.72)',
  glassLightBorder: 'rgba(255, 255, 255, 0.1)',
  glassDark: 'rgba(0, 0, 0, 0.72)',
  glassDarkBorder: 'rgba(255, 255, 255, 0.08)',

  border: '#334155',
  card: '#1E293B',
};

export const SIZES = {
  // Base unit (4px grid system)
  base: 4,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,

  // Legacy compatibility
  font: 14,
  padding: 16,
  radius: 16,
  h1: 32,
  h2: 24,
  h3: 18,
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const FONTS = {
  // Font sizes with scale
  display: { size: 40, weight: '700', lineHeight: 48, letterSpacing: -1 },
  h1: { size: 32, weight: '700', lineHeight: 40, letterSpacing: -0.5 },
  h2: { size: 24, weight: '700', lineHeight: 32, letterSpacing: -0.3 },
  h3: { size: 20, weight: '600', lineHeight: 28, letterSpacing: -0.2 },
  h4: { size: 18, weight: '600', lineHeight: 24, letterSpacing: -0.1 },
  body: { size: 16, weight: '400', lineHeight: 24, letterSpacing: 0 },
  bodySmall: { size: 14, weight: '400', lineHeight: 20, letterSpacing: 0 },
  caption: { size: 12, weight: '400', lineHeight: 16, letterSpacing: 0.2 },
  overline: { size: 11, weight: '500', lineHeight: 16, letterSpacing: 0.5 },
  button: { size: 16, weight: '600', lineHeight: 24, letterSpacing: 0.2 },

  // Legacy
  large: 18,
  medium: 14,
  small: 12,
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 48,
    elevation: 16,
  },
  colored: {
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  accent: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
    spring: 'spring',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};
