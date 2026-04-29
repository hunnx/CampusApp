import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS } from '../../constants';

const Badge = ({
  count,
  variant = 'primary',
  size = 'md',
  dot = false,
  style,
}) => {
  const { colors } = useTheme();

  const variantColors = {
    primary: { bg: colors.primary, text: '#FFFFFF' },
    success: { bg: colors.success, text: '#FFFFFF' },
    warning: { bg: colors.warning, text: '#FFFFFF' },
    danger: { bg: colors.danger, text: '#FFFFFF' },
    neutral: { bg: colors.lightSecondary, text: colors.gray },
  };

  const sizeStyles = {
    sm: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10, minWidth: 16, height: 16 },
    md: { paddingHorizontal: 8, paddingVertical: 3, fontSize: 11, minWidth: 20, height: 20 },
  };

  const colors_ = variantColors[variant] || variantColors.primary;
  const sz = sizeStyles[size] || sizeStyles.md;

  if (dot) {
    return React.createElement(View, {
      style: [styles.dot, {
        width: sz.height * 0.6,
        height: sz.height * 0.6,
        borderRadius: sz.height * 0.3,
        backgroundColor: colors_.bg,
      }, style]
    });
  }

  return React.createElement(View, {
    style: [styles.badge, {
      backgroundColor: colors_.bg,
      borderRadius: BORDER_RADIUS.full,
      minWidth: sz.minWidth,
      height: sz.height,
      paddingHorizontal: sz.paddingHorizontal,
      paddingVertical: sz.paddingVertical,
    }, style]
  }, React.createElement(Text, {
    style: { color: colors_.text, fontSize: sz.fontSize, fontWeight: '600' }
  }, count > 99 ? '99+' : count));
};

const styles = StyleSheet.create({
  badge: { justifyContent: 'center', alignItems: 'center' },
  dot: {},
});

export default Badge;
