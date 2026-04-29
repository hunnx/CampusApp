import React from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const Toggle = ({ value, onValueChange, size = 'md', disabled = false }) => {
  const { colors } = useTheme();
  const [animValue] = React.useState(new Animated.Value(value ? 1 : 0));

  React.useEffect(() => {
    Animated.spring(animValue, {
      toValue: value ? 1 : 0,
      friction: 5,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const sizes = {
    sm: { width: 36, height: 20, thumb: 16, padding: 2 },
    md: { width: 48, height: 28, thumb: 24, padding: 2 },
    lg: { width: 60, height: 36, thumb: 32, padding: 2 },
  };

  const sz = sizes[size] || sizes.md;

  const thumbPosition = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [sz.padding, sz.width - sz.thumb - sz.padding],
  });

  return React.createElement(TouchableOpacity, {
    activeOpacity: 0.8,
    disabled,
    onPress: () => onValueChange && onValueChange(!value),
  },
    React.createElement(View, {
      style: [styles.track, {
        width: sz.width,
        height: sz.height,
        borderRadius: sz.height / 2,
        backgroundColor: value ? colors.primary : colors.lightSecondary,
        opacity: disabled ? 0.5 : 1,
      }]
    },
      React.createElement(Animated.View, {
        style: [styles.thumb, {
          width: sz.thumb,
          height: sz.thumb,
          borderRadius: sz.thumb / 2,
          backgroundColor: '#FFFFFF',
          transform: [{ translateX: thumbPosition }],
          ...({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 }),
        }]
      })
    )
  );
};

const styles = StyleSheet.create({
  track: { justifyContent: 'center' },
  thumb: {},
});

export default Toggle;
