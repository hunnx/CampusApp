import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';
import { BORDER_RADIUS, FONTS } from '../constants';
import ModernCard from '../components/common/ModernCard';
import ModernButton from '../components/common/ModernButton';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const roles = [
    { key: 'student', label: 'Student', icon: 'school-outline', color: colors.primary, desc: 'Order food & products' },
    { key: 'shopkeeper', label: 'Shopkeeper', icon: 'storefront-outline', color: colors.accent, desc: 'Manage your shop' },
    { key: 'deliverer', label: 'Deliverer', icon: 'bicycle-outline', color: colors.warning, desc: 'Deliver orders' },
  ];

  return React.createElement(SafeAreaView, { style: [styles.container, { backgroundColor: colors.background }] },
    React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
      React.createElement(Text, { style: styles.headerTitle }, 'CampusConnect'),
      React.createElement(Text, { style: styles.headerSubtitle }, 'Select your role to continue')
    ),

    React.createElement(View, { style: styles.content },
      roles.map(role => React.createElement(TouchableOpacity, {
        key: role.key,
        onPress: () => navigation.navigate(role.key === 'student' ? 'StudentHome' : role.key === 'shopkeeper' ? 'ShopkeeperDashboard' : 'DelivererHome'),
        activeOpacity: 0.8,
      },
        React.createElement(ModernCard, {
          variant: 'elevated',
          borderRadius: BORDER_RADIUS['2xl'],
          padding: 24,
          style: { marginBottom: 16, flexDirection: 'row', alignItems: 'center' },
        },
          React.createElement(View, { style: [styles.roleIcon, { backgroundColor: role.color + '20' }] },
            React.createElement(Icon, { name: role.icon, size: 32, color: role.color })
          ),
          React.createElement(View, { style: styles.roleInfo },
            React.createElement(Text, { style: [styles.roleTitle, { color: colors.dark }] }, role.label),
            React.createElement(Text, { style: [styles.roleDesc, { color: colors.gray }] }, role.desc)
          ),
          React.createElement(Icon, { name: 'chevron-forward', size: 22, color: colors.grayLight })
        )
      ))
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: FONTS.h1.size, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: FONTS.body.size, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  content: { padding: 20, paddingTop: 24 },
  roleIcon: { width: 60, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  roleInfo: { flex: 1, marginLeft: 16 },
  roleTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  roleDesc: { fontSize: 14 },
});

export default HomeScreen;
