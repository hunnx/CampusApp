import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../constants';
import { loginUser } from '../../redux/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  // Dummy credentials for testing
  const [email, setEmail] = useState('test3@example.com');
  const [password, setPassword] = useState('Test123');
  const [selectedRole, setSelectedRole] = useState('student');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(loginUser({ email, password, role: selectedRole })).unwrap();
      // AppNavigator listens to auth state; it will switch to the proper stack
    } catch (err) {
      Alert.alert('Login failed', err || 'Unable to login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          <View style={styles.demoInfo}>
            <Text style={styles.demoInfoText}>🔓 Demo Credentials:</Text>
            <Text style={styles.demoCredentials}>Email: test3@example.com</Text>
            <Text style={styles.demoCredentials}>Password: Test123</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="user@campusconnect.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(value) => setEmail(value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              placeholderTextColor="#999"
              value={password}
              onChangeText={(value) => setPassword(value)}
              secureTextEntry
            />
          </View>

            {/* Role Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Login as Role</Text>
              <View style={styles.roleContainer}>
                {[
                  { key: 'student', label: '🎓 Student', emoji: '🎓' },
                  { key: 'shopkeeper', label: '🏪 Shopkeeper', emoji: '🏪' },
                  { key: 'deliverer', label: '🚴 Deliverer', emoji: '🚴' },
                ].map((role) => (
                  <TouchableOpacity
                    key={role.key}
                    style={[
                      styles.roleOption,
                      selectedRole === role.key && styles.selectedRole,
                    ]}
                    onPress={() => setSelectedRole(role.key)}
                  >
                    <Text style={styles.roleEmoji}>{role.emoji}</Text>
                    <Text
                      style={[
                        styles.roleLabel,
                        selectedRole === role.key && styles.selectedRoleLabel,
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Quick Demo Button */}
          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.demoButtonText}>
              🚀 Quick Demo Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e8f5e9',
  },
  demoInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  demoInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  demoCredentials: {
    fontSize: 11,
    color: '#e8f5e9',
    fontFamily: 'monospace',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  demoButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#e8f5e9',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRole: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#ffffff',
  },
  roleEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  roleLabel: {
    fontSize: 11,
    color: '#e8f5e9',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedRoleLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default LoginScreen;
