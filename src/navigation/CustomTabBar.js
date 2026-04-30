import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';
import { BORDER_RADIUS, SHADOWS } from '../constants';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();

  const getIconName = (routeName, focused) => {
    const icons = {
      Home: focused ? 'home' : 'home-outline',
      Cart: focused ? 'cart' : 'cart-outline',
      Orders: focused ? 'receipt' : 'receipt-outline',
      Profile: focused ? 'person' : 'person-outline',
      Dashboard: focused ? 'grid' : 'grid-outline',
      Products: focused ? 'cube' : 'cube-outline',
      Delivery: focused ? 'bicycle' : 'bicycle-outline',
      History: focused ? 'time' : 'time-outline',
    };
    return icons[routeName] || (focused ? 'ellipse' : 'ellipse-outline');
  };

  return React.createElement(View, { style: [styles.container, { backgroundColor: colors.surface, ...SHADOWS.lg }] },
    state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const label = options.tabBarLabel || options.title || route.name;
      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      };

      const iconName = getIconName(route.name, isFocused);

      return React.createElement(TouchableOpacity, {
        key: route.key,
        accessibilityRole: 'button',
        accessibilityState: isFocused ? { selected: true } : {},
        accessibilityLabel: options.tabBarAccessibilityLabel,
        testID: options.tabBarTestID,
        onPress,
        activeOpacity: 0.7,
        style: styles.tab,
      },
        React.createElement(View, { style: [styles.tabInner, isFocused && { backgroundColor: colors.primaryMuted }] },
          React.createElement(Icon, {
            name: iconName,
            size: 24,
            color: isFocused ? colors.primary : colors.grayLight,
          }),
          isFocused && React.createElement(Text, {
            style: [styles.label, { color: colors.primary }],
            numberOfLines: 1,
            ellipsizeMode: 'tail',
          }, label)
        )
      );
    })
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 20,
    height: 72,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tab: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    maxWidth: 80,
    overflow: 'hidden',
    flexShrink: 1,
  },
});

export default CustomTabBar;
