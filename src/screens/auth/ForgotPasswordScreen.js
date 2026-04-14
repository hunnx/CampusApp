import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/buttons/Button';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      // API call would go here
      // await api.post('/auth/forgot-password', { email });
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Reset Link Sent',
        'A password reset link has been sent to your email address.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email Address"
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
        />

        <Button
          title="Send Reset Link"
          onPress={handleResetPassword}
          loading={isLoading}
          style={styles.resetButton}
        />

        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backToLoginText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  resetButton: {
    marginTop: 20,
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: 30,
  },
  backToLoginText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
