import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { FONTS, BORDER_RADIUS } from '../../constants';
import ModernInput from '../../components/common/ModernInput';
import ModernButton from '../../components/common/ModernButton';
import ModernCard from '../../components/common/ModernCard';

const ForgotPasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email) { Alert.alert('Error', 'Please enter your email'); return; }
    setSent(true);
  };

  return React.createElement(SafeAreaView, { style: [styles.container, { backgroundColor: colors.primary }] },
    React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: colors.primary }),

    React.createElement(View, { style: styles.header },
      React.createElement(TouchableOpacity, {
        onPress: () => navigation.goBack(),
        style: [styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }]
      }, React.createElement(Icon, { name: 'arrow-back', size: 22, color: '#FFFFFF' })),
      React.createElement(Text, { style: styles.headerTitle }, 'Reset Password')
    ),

    React.createElement(View, { style: styles.content },
      !sent ? React.createElement(ModernCard, {
        variant: 'elevated',
        borderRadius: BORDER_RADIUS['3xl'],
        padding: 28,
        style: { width: '100%' },
      },
        React.createElement(View, { style: [styles.iconBox, { backgroundColor: colors.primaryMuted }] },
          React.createElement(Icon, { name: 'lock-open-outline', size: 32, color: colors.primary })
        ),
        React.createElement(Text, { style: [styles.title, { color: colors.dark }] }, 'Forgot Password?'),
        React.createElement(Text, { style: [styles.subtitle, { color: colors.gray }] }, 'Enter your email to receive reset instructions'),
        React.createElement(View, { style: { height: 8 } }),
        React.createElement(ModernInput, {
          label: 'Email Address',
          value: email,
          onChangeText: setEmail,
          placeholder: 'your@email.com',
          keyboardType: 'email-address',
          leftIcon: 'mail-outline',
        }),
        React.createElement(ModernButton, {
          title: 'Send Reset Link',
          onPress: handleSend,
          fullWidth: true,
          size: 'lg',
          style: { marginTop: 8 },
        })
      ) : React.createElement(ModernCard, {
        variant: 'elevated',
        borderRadius: BORDER_RADIUS['3xl'],
        padding: 28,
        style: { width: '100%', alignItems: 'center' },
      },
        React.createElement(View, { style: [styles.iconBox, { backgroundColor: colors.successLight }] },
          React.createElement(Icon, { name: 'checkmark-circle-outline', size: 32, color: colors.success })
        ),
        React.createElement(Text, { style: [styles.title, { color: colors.dark }] }, 'Check Your Email'),
        React.createElement(Text, { style: [styles.subtitle, { color: colors.gray, textAlign: 'center' }] }, 'We have sent password reset instructions to your email'),
        React.createElement(ModernButton, {
          title: 'Back to Login',
          onPress: () => navigation.navigate('Login'),
          variant: 'outline',
          fullWidth: true,
          style: { marginTop: 16 },
        })
      )
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: FONTS.h1.size, fontWeight: '800', color: '#FFFFFF' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 40 },
  iconBox: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: FONTS.h2.size, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: FONTS.bodySmall.size, textAlign: 'center', marginBottom: 16 },
});

export default ForgotPasswordScreen;
