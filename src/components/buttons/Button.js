import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { COLORS, SIZES } from '../../constants';

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  type = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: SIZES.radius,
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = SIZES.padding;
        baseStyle.paddingVertical = SIZES.base;
        break;
      case 'large':
        baseStyle.paddingHorizontal = SIZES.padding * 2;
        baseStyle.paddingVertical = SIZES.padding * 1.5;
        break;
      default:
        baseStyle.paddingHorizontal = SIZES.padding * 1.5;
        baseStyle.paddingVertical = SIZES.padding;
    }

    // Type styles
    switch (type) {
      case 'secondary':
        baseStyle.backgroundColor = COLORS.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = COLORS.primary;
        break;
      default:
        baseStyle.backgroundColor = COLORS.primary;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontWeight: '600',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = SIZES.font - 2;
        break;
      case 'large':
        baseStyle.fontSize = SIZES.font + 2;
        break;
      default:
        baseStyle.fontSize = SIZES.font;
    }

    // Type styles
    switch (type) {
      case 'outline':
        baseStyle.color = COLORS.primary;
        break;
      default:
        baseStyle.color = COLORS.white;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'outline' ? COLORS.primary : COLORS.white} 
          size="small" 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
