import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, SHADOWS } from '../../constants';
import { usePressAnimation } from '../../utils/animationUtils';

const ModernCard = ({
  children,
  onPress,
  variant = 'elevated',
  borderRadius = BORDER_RADIUS['2xl'],
  padding = 20,
  margin,
  style,
  ...props
}) => {
  const { colors, isDark } = useTheme();
  const { scaleValue, onPressIn, onPressOut } = usePressAnimation();

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'flat':
        return {
          backgroundColor: colors.light,
        };
      case 'glass':
        return {
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.72)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
        };
      case 'elevated':
      default:
        return {
          backgroundColor: colors.surface,
          ...SHADOWS.lg,
        };
    }
  };

  const baseStyle = [{ borderRadius, overflow: 'hidden', ...getVariantStyles(), margin }, style];
  const innerContent = React.createElement(View, { style: { padding } }, children);

  if (!onPress) {
    return React.createElement(View, { style: baseStyle }, innerContent);
  }

  return React.createElement(
    Animated.View,
    { style: [{ transform: [{ scale: scaleValue }] }, style] },
    React.createElement(
      TouchableOpacity,
      {
        onPress,
        activeOpacity: 0.95,
        onPressIn,
        onPressOut,
        ...props,
      },
      React.createElement(View, { style: [{ borderRadius, overflow: 'hidden', ...getVariantStyles(), margin }] }, innerContent)
    )
  );
};

export default ModernCard;
