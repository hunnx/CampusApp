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
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS } from '../../constants';
import ModernInput from '../../components/common/ModernInput';
import ModernButton from '../../components/common/ModernButton';
import ModernCard from '../../components/common/ModernCard';
import { loginUser } from '../../redux/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { colors } = useTheme();

  // Auto-fill credentials based on user role for testing
  const getDefaultCredentials = (role) => {
    switch (role) {
      case 'student':
        return { email: 'test3@example.com', password: '123456' };
      case 'shopkeeper':
        return { email: 'shop@campusconnect.com', password: '123456' };
      case 'deliverer':
        return { email: 'deliverer@shop.com', password: '123456' };
      default:
        return { email: '', password: '' };
    }
  };

  const [selectedRole, setSelectedRole] = useState('student');
  const defaultCreds = getDefaultCredentials(selectedRole);
  const [email, setEmail] = useState(defaultCreds.email);
  const [password, setPassword] = useState(defaultCreds.password);

  // Update credentials when role changes
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const creds = getDefaultCredentials(role);
    setEmail(creds.email);
    setPassword(creds.password);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await dispatch(loginUser({ email, password, role: selectedRole })).unwrap();
    } catch (err) {
      Alert.alert('Login failed', err || 'Unable to login');
    }
  };

  const roles = [
    { key: 'student', label: 'Student', icon: 'school-outline' },
    { key: 'shopkeeper', label: 'Shopkeeper', icon: 'storefront-outline' },
    { key: 'deliverer', label: 'Deliverer', icon: 'bicycle-outline' },
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
        <Text style={styles.headerTitle}>Welcome Back</Text>
        <Text style={styles.headerSubtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.formContainer}>
        <ModernCard
          variant="elevated"
          borderRadius={BORDER_RADIUS['3xl']}
          padding={28}
          style={{ marginHorizontal: 20 }}
        >
          <Text style={[styles.sectionLabel, { color: colors.dark }]}>I am a</Text>
          <View style={styles.roleContainer}>
            {roles.map(role => (
              <TouchableOpacity
                key={role.key}
                onPress={() => handleRoleChange(role.key)}
                style={[
                  styles.roleOption,
                  {
                    backgroundColor: selectedRole === role.key ? colors.primaryMuted : colors.light,
                    borderColor: selectedRole === role.key ? colors.primary : colors.border,
                    borderWidth: 1.5,
                  },
                ]}
              >
                <Icon
                  name={role.icon}
                  size={22}
                  color={selectedRole === role.key ? colors.primary : colors.gray}
                />
                <Text
                  style={[
                    styles.roleLabel,
                    {
                      color: selectedRole === role.key ? colors.primary : colors.gray,
                    },
                  ]}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 16 }} />

          <ModernInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="user@campusconnect.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />
          <ModernInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginBottom: 20 }}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <ModernButton
            title={isLoading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            size="lg"
          />

          <TouchableOpacity onPress={handleLogin} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: colors.gray, fontSize: 14 }}>
              Demo: test3@example.com / Test123
            </Text>
          </TouchableOpacity>
        </ModernCard>
      </View>

      <View style={styles.footer}>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: FONTS.h1.size, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  headerSubtitle: { fontSize: FONTS.body.size, color: 'rgba(255,255,255,0.8)' },
  formContainer: { flex: 1, justifyContent: 'center' },
  sectionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  roleContainer: { flexDirection: 'row', gap: 8 },
  roleOption: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  roleLabel: { fontSize: 12, fontWeight: '500', marginTop: 6 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 24 },
});

export default LoginScreen;
