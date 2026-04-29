/**
 * Glassmorphism style utilities
 * Creates frosted glass effect using transparency and borders
 */

/**
 * Get glassmorphism background color based on theme
 * @param {boolean} isDark - dark mode flag
 * @param {number} opacity - background opacity (0-1)
 * @returns {string} rgba color string
 */
export const getGlassBackground = (isDark = false, opacity = 0.72) => {
  if (isDark) {
    return `rgba(15, 23, 42, ${opacity})`;
  }
  return `rgba(255, 255, 255, ${opacity})`;
};

/**
 * Get glassmorphism border color based on theme
 * @param {boolean} isDark - dark mode flag
 * @param {number} opacity - border opacity (0-1)
 * @returns {string} rgba color string
 */
export const getGlassBorder = (isDark = false, opacity = 0.5) => {
  if (isDark) {
    return `rgba(255, 255, 255, ${opacity * 0.2})`;
  }
  return `rgba(255, 255, 255, ${opacity})`;
};

/**
 * Create glassmorphism style object
 * @param {Object} options
 * @param {boolean} options.isDark - dark mode
 * @param {number} options.bgOpacity - background opacity
 * @param {number} options.borderOpacity - border opacity
 * @param {number} options.borderRadius - border radius
 * @returns {Object} style object
 */
export const createGlassmorphism = ({
  isDark = false,
  bgOpacity = 0.72,
  borderOpacity = 0.5,
  borderRadius = 24,
} = {}) => ({
  backgroundColor: getGlassBackground(isDark, bgOpacity),
  borderWidth: 1,
  borderColor: getGlassBorder(isDark, borderOpacity),
  borderRadius,
  ...(isDark ? {} : {
    borderTopColor: `rgba(255, 255, 255, ${borderOpacity + 0.2})`,
    borderLeftColor: `rgba(255, 255, 255, ${borderOpacity + 0.2})`,
  }),
});

/**
 * Predefined glass styles for common use cases
 */
export const glassStyles = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderTopColor: 'rgba(255, 255, 255, 0.85)',
    borderLeftColor: 'rgba(255, 255, 255, 0.85)',
  },
  dark: {
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
  },
  subtle: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  strong: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    borderLeftColor: 'rgba(255, 255, 255, 0.95)',
  },
};
