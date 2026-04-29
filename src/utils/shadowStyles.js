import { SHADOWS } from '../constants';

/**
 * Get shadow style by name
 * @param {string} name - shadow name: none | sm | md | lg | xl | 2xl | colored | accent
 * @returns {Object} shadow style object
 */
export const getShadow = (name = 'md') => {
  return SHADOWS[name] || SHADOWS.md;
};

/**
 * Create custom shadow
 * @param {Object} options
 * @param {string} options.color - shadow color
 * @param {number} options.opacity - shadow opacity
 * @param {number} options.radius - blur radius
 * @param {Object} options.offset - {width, height}
 * @param {number} options.elevation - Android elevation
 * @returns {Object} shadow style
 */
export const createShadow = ({
  color = '#000',
  opacity = 0.08,
  radius = 12,
  offset = { width: 0, height: 4 },
  elevation = 6,
}) => ({
  shadowColor: color,
  shadowOffset: offset,
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

/**
 * Colored shadow for primary color elements
 */
export const primaryShadow = createShadow({
  color: '#1D4ED8',
  opacity: 0.25,
  radius: 16,
  offset: { width: 0, height: 6 },
  elevation: 8,
});

/**
 * Colored shadow for accent color elements
 */
export const accentShadow = createShadow({
  color: '#10B981',
  opacity: 0.25,
  radius: 16,
  offset: { width: 0, height: 6 },
  elevation: 8,
});

/**
 * Soft shadow for cards
 */
export const cardShadow = createShadow({
  color: '#0F172A',
  opacity: 0.06,
  radius: 20,
  offset: { width: 0, height: 8 },
  elevation: 8,
});

/**
 * Inner shadow simulation (using border and inset-like effect)
 */
export const innerShadow = {
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.05)',
};
