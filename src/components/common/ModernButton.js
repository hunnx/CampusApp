import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS } from '../../constants';
import { usePressAnimation } from '../../utils/animationUtils';

const ModernButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // sm, md, lg
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  borderRadius = BORDER_RADIUS.xl,
  ...props
}) => {
  const { colors } = useTheme();
  const { scaleValue, onPressIn, onPressOut } = usePressAnimation();

  const getVariantStyles = useCallback(() => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: colors.white,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: colors.danger,
          color: colors.white,
        };
      case 'success':
        return {
          backgroundColor: colors.success,
          color: colors.white,
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          color: colors.white,
        };
    }
  }, [variant, colors]);

  const getSizeStyles = useCallback(() => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  }, [size]);

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
          opacity: disabled ? 0.5 : 1,
        },
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius,
            ...variantStyles,
            ...sizeStyles,
          },
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyles.color}
            style={{ marginRight: title ? 8 : 0 }}
          />
        ) : leftIcon ? (
          <Icon
            name={leftIcon}
            size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
            color={variantStyles.color}
            style={{ marginRight: title ? 8 : 0 }}
          />
        ) : null}

        {title && (
          <Text
            style={[
              {
                fontSize: size === 'sm' ? FONTS.bodySmall.size : FONTS.button.size,
                fontWeight: FONTS.button.weight,
                color: variantStyles.color,
                letterSpacing: 0.3,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}

        {rightIcon && !loading && (
          <Icon
            name={rightIcon}
            size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
            color={variantStyles.color}
            style={{ marginLeft: title ? 8 : 0 }}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ModernButton;
