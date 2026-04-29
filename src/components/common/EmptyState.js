import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { FONTS, BORDER_RADIUS } from '../../constants';
import ModernButton from './ModernButton';

const EmptyState = ({
  icon = 'cube-outline',
  iconSize = 80,
  title = 'Nothing here yet',
  subtitle = 'Check back later for updates',
  actionTitle,
  onAction,
  style,
}) => {
  const { colors } = useTheme();
  return React.createElement(View, { style: [styles.container, style] },
    React.createElement(View, { style: [styles.iconContainer, { backgroundColor: colors.primaryMuted, borderRadius: BORDER_RADIUS['3xl'] }] },
      React.createElement(Icon, { name: icon, size: iconSize * 0.5, color: colors.primary })
    ),
    React.createElement(Text, { style: [styles.title, { color: colors.dark }] }, title),
    React.createElement(Text, { style: [styles.subtitle, { color: colors.gray }] }, subtitle),
    actionTitle && onAction && React.createElement(ModernButton, {
      title: actionTitle, onPress: onAction, variant: 'outline', style: { marginTop: 24 }
    })
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 48 },
  iconContainer: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: FONTS.h3.size, fontWeight: FONTS.h3.weight, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: FONTS.bodySmall.size, textAlign: 'center', lineHeight: FONTS.bodySmall.lineHeight },
});

export default EmptyState;
