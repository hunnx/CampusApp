import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS } from '../../constants';
import ModernInput from '../../components/common/ModernInput';
import ModernButton from '../../components/common/ModernButton';
import ModernCard from '../../components/common/ModernCard';
import { register } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    roleName: 'Student',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    const { firstName, lastName, emailAddress, password, confirmPassword, roleName } = formData;
    const trimmed = {
      firstName: firstName.trim(), lastName: lastName.trim(),
      emailAddress: emailAddress.trim(), password: password.trim(),
      confirmPassword: confirmPassword.trim(), roleName,
    };

    if (!trimmed.firstName || !trimmed.lastName) { Alert.alert('Error', 'Please enter both first and last name'); return; }
    if (!trimmed.emailAddress || !validateEmail(trimmed.emailAddress)) { Alert.alert('Error', 'Please enter a valid email'); return; }
    if (!trimmed.password || trimmed.password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
    if (trimmed.password !== trimmed.confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }

    setIsLoading(true);
    try {
      await register({
        firstName: trimmed.firstName, lastName: trimmed.lastName,
        emailAddress: trimmed.emailAddress, password: trimmed.password,
        roleName: trimmed.roleName, phoneNumber: trimmed.phoneNumber,
        profilePictureUrl: '', isActive: true,
      });
      Alert.alert('Success', 'User registered successfully! Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration.');
    } finally { setIsLoading(false); }
  };

  const roles = [
    { key: 'Student', label: 'Student', icon: 'school-outline' },
    { key: 'Shopkeeper', label: 'Shopkeeper', icon: 'storefront-outline' },
    { key: 'Deliverer', label: 'Deliverer', icon: 'bicycle-outline' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
        >
          <Icon name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Join our campus community</Text>
      </View>

      <ModernCard
        variant="elevated"
        borderRadius={BORDER_RADIUS['3xl']}
        padding={24}
        style={{ marginHorizontal: 20, marginBottom: 24, flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionLabel, { color: colors.dark }]}>I am a</Text>
          <View style={styles.roleContainer}>
            {roles.map(role => (
              <TouchableOpacity
                key={role.key}
                onPress={() => updateFormData('roleName', role.key)}
                style={[
                  styles.roleOption,
                  {
                    backgroundColor: formData.roleName === role.key ? colors.primaryMuted : colors.light,
                    borderColor: formData.roleName === role.key ? colors.primary : colors.border,
                    borderWidth: 1.5,
                  },
                ]}
              >
                <Icon
                  name={role.icon}
                  size={22}
                  color={formData.roleName === role.key ? colors.primary : colors.gray}
                />
                <Text
                  style={[
                    styles.roleLabel,
                    {
                      color: formData.roleName === role.key ? colors.primary : colors.gray,
                    },
                  ]}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 12 }} />

          <ModernInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(v) => updateFormData('firstName', v)}
            placeholder="John"
            autoCapitalize="words"
            leftIcon="person-outline"
          />
          <ModernInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(v) => updateFormData('lastName', v)}
            placeholder="Doe"
            autoCapitalize="words"
            leftIcon="person-outline"
          />
          <ModernInput
            label="Email"
            value={formData.emailAddress}
            onChangeText={(v) => updateFormData('emailAddress', v)}
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />
          <ModernInput
            label="Phone (Optional)"
            value={formData.phoneNumber}
            onChangeText={(v) => updateFormData('phoneNumber', v)}
            placeholder="+1234567890"
            keyboardType="phone-pad"
            leftIcon="call-outline"
          />
          <ModernInput
            label="Password"
            value={formData.password}
            onChangeText={(v) => updateFormData('password', v)}
            placeholder="Min 6 characters"
            secureTextEntry
            leftIcon="lock-closed-outline"
          />
          <ModernInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(v) => updateFormData('confirmPassword', v)}
            placeholder="Confirm password"
            secureTextEntry
            leftIcon="shield-checkmark-outline"
          />

          <ModernButton
            title={isLoading ? 'Creating Account...' : 'Create Account'}
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            size="lg"
            style={{ marginTop: 8, marginBottom: 12 }}
          />

          <View style={styles.footer}>
            <Text style={{ color: colors.gray, fontSize: 14 }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ModernCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: FONTS.h1.size, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  headerSubtitle: { fontSize: FONTS.body.size, color: 'rgba(255,255,255,0.8)' },
  sectionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  roleContainer: { flexDirection: 'row', gap: 8 },
  roleOption: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  roleLabel: { fontSize: 12, fontWeight: '500', marginTop: 6 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
});

export default RegisterScreen;
