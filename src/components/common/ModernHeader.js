import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { FONTS } from '../../constants';
import { usePressAnimation } from '../../utils/animationUtils';

const ModernHeader = ({
  title,
  subtitle,
  onBackPress,
  rightComponent,
  transparent = false,
  large = false,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const { scaleValue, onPressIn, onPressOut } = usePressAnimation();

  return React.createElement(View, {
    style: [styles.container, {
      backgroundColor: transparent ? 'transparent' : colors.primary,
      paddingTop: large ? 24 : 16,
      paddingBottom: large ? 24 : 16,
    }, style]
  },
    React.createElement(StatusBar, {
      barStyle: transparent ? (isDark ? 'light-content' : 'dark-content') : 'light-content',
      backgroundColor: transparent ? 'transparent' : colors.primary,
      translucent: transparent
    }),
    React.createElement(View, { style: styles.row },
      onBackPress ? React.createElement(Animated.View, { style: { transform: [{ scale: scaleValue }] } },
        React.createElement(TouchableOpacity, {
          onPress: onBackPress,
          onPressIn: onPressIn,
          onPressOut: onPressOut,
          style: [styles.backButton, { backgroundColor: 'rgba(255,255,255,0.15)' }]
        }, React.createElement(Icon, { name: 'arrow-back', size: 22, color: '#FFFFFF' }))
      ) : React.createElement(View, { style: styles.backPlaceholder }),
      React.createElement(View, { style: styles.titleContainer },
        React.createElement(Text, {
          style: [styles.title, {
            color: transparent ? colors.dark : '#FFFFFF',
            fontSize: large ? FONTS.h1.size : FONTS.h3.size,
          }],
          numberOfLines: 1
        }, title),
        subtitle && React.createElement(Text, {
          style: [styles.subtitle, { color: transparent ? colors.gray : 'rgba(255,255,255,0.8)' }]
        }, subtitle)
      ),
      React.createElement(View, { style: styles.rightContainer },
        rightComponent || React.createElement(View, { style: styles.backPlaceholder })
      )
    )
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  backPlaceholder: { width: 40 },
  titleContainer: { flex: 1, alignItems: 'center', marginHorizontal: 12 },
  title: { fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 13, marginTop: 2, textAlign: 'center' },
  rightContainer: { alignItems: 'flex-end' },
});

export default ModernHeader;
