import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { FONTS, BORDER_RADIUS } from '../../constants';
import ModernButton from './ModernButton';

const ErrorState = ({
  icon = 'alert-circle-outline',
  title = 'Something went wrong',
  message = 'We couldn\'t load the data. Please try again.',
  onRetry,
  retryTitle = 'Try Again',
  style,
}) => {
  const { colors } = useTheme();
  return React.createElement(View, { style: [styles.container, style] },
    React.createElement(View, { style: [styles.iconContainer, { backgroundColor: colors.dangerLight, borderRadius: BORDER_RADIUS['3xl'] }] },
      React.createElement(Icon, { name: icon, size: 40, color: colors.danger })
    ),
    React.createElement(Text, { style: [styles.title, { color: colors.dark }] }, title),
    React.createElement(Text, { style: [styles.message, { color: colors.gray }] }, message),
    onRetry && React.createElement(ModernButton, {
      title: retryTitle, onPress: onRetry, variant: 'primary', leftIcon: 'refresh-outline', style: { marginTop: 24 }
    })
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 48 },
  iconContainer: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: FONTS.h3.size, fontWeight: FONTS.h3.weight, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: FONTS.bodySmall.size, textAlign: 'center', lineHeight: FONTS.bodySmall.lineHeight },
});

export default ErrorState;
