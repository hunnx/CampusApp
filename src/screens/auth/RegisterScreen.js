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
  ScrollView,
} from 'react-native';
import Header from '../../components/common/Header';
import { COLORS, SIZES } from '../../constants';

const RegisterScreen = ({ navigation }) => {
  // Dummy credentials for testing
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'user@campusconnect.com',
    password: '123456',
    confirmPassword: '123456',
    role: 'student', // 'student', 'shopkeeper', 'deliverer'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    // Simulate registration API call
    setTimeout(() => {
      setIsLoading(false);
      
      Alert.alert('Success', 'Registration successful! Logging you in...', [
        {
          text: 'OK',
          onPress: () => {
            // Auto-login with selected role
            handleLogin(formData.role);
          },
        },
      ]);
    }, 1500);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Header title="Create Account" onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join CampusConnect today</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#999"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="user@campusconnect.com"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
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
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry
              />
            </View>

            {/* Role Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select Role</Text>
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
                      formData.role === role.key && styles.selectedRole,
                    ]}
                    onPress={() => updateFormData('role', role.key)}
                  >
                    <Text style={styles.roleEmoji}>{role.emoji}</Text>
                    <Text
                      style={[
                        styles.roleLabel,
                        formData.role === role.key && styles.selectedRoleLabel,
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingVertical: 40,
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
  registerButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
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

export default RegisterScreen;
