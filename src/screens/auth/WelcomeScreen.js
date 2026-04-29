import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS, SHADOWS } from '../../constants';
import ModernButton from '../../components/common/ModernButton';

const WelcomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return React.createElement(SafeAreaView, { style: [styles.container, { backgroundColor: colors.primary }] },
    React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: colors.primary }),
    
    React.createElement(View, { style: styles.content },
      // Logo Section
      React.createElement(View, { style: styles.headerSection },
        React.createElement(View, { style: [styles.logoCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }] },
          React.createElement(Icon, { name: 'school-outline', size: 56, color: '#FFFFFF' })
        ),
        React.createElement(Text, { style: styles.title }, 'CampusConnect'),
        React.createElement(Text, { style: styles.subtitle }, 'Your Campus Network Companion'),
        React.createElement(Text, { style: styles.description }, 'Connect, Order, Deliver - All in One Place')
      ),

      // Features
      React.createElement(View, { style: styles.featuresSection },
        React.createElement(View, { style: [styles.featureItem, { backgroundColor: 'rgba(255,255,255,0.1)' }] },
          React.createElement(Icon, { name: 'fast-food-outline', size: 28, color: '#FFFFFF' }),
          React.createElement(Text, { style: styles.featureText }, 'Order Food')
        ),
        React.createElement(View, { style: [styles.featureItem, { backgroundColor: 'rgba(255,255,255,0.1)' }] },
          React.createElement(Icon, { name: 'bicycle-outline', size: 28, color: '#FFFFFF' }),
          React.createElement(Text, { style: styles.featureText }, 'Quick Delivery')
        ),
        React.createElement(View, { style: [styles.featureItem, { backgroundColor: 'rgba(255,255,255,0.1)' }] },
          React.createElement(Icon, { name: 'people-outline', size: 28, color: '#FFFFFF' }),
          React.createElement(Text, { style: styles.featureText }, 'Connect Campus')
        )
      ),

      // Buttons
      React.createElement(View, { style: styles.buttonsSection },
        React.createElement(ModernButton, {
          title: 'Sign In',
          onPress: () => navigation.navigate('Login'),
          variant: 'primary',
          size: 'lg',
          fullWidth: true,
          style: { backgroundColor: '#FFFFFF' },
          textStyle: { color: colors.primary },
          rightIcon: 'arrow-forward',
        }),
        React.createElement(View, { style: { height: 12 } }),
        React.createElement(ModernButton, {
          title: 'Create Account',
          onPress: () => navigation.navigate('Register'),
          variant: 'outline',
          size: 'lg',
          fullWidth: true,
          style: { borderColor: '#FFFFFF', borderWidth: 2 },
          textStyle: { color: '#FFFFFF' },
        })
      )
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between', paddingVertical: 48 },
  headerSection: { alignItems: 'center', marginTop: 40 },
  logoCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: FONTS.h1.size, fontWeight: '800', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: FONTS.body.size, color: 'rgba(255,255,255,0.85)', marginBottom: 8, textAlign: 'center' },
  description: { fontSize: FONTS.bodySmall.size, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  featuresSection: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  featureItem: { alignItems: 'center', padding: 16, borderRadius: 16, width: 100 },
  featureText: { fontSize: 12, color: '#FFFFFF', textAlign: 'center', marginTop: 8 },
  buttonsSection: { gap: 12 },
});

export default WelcomeScreen;
