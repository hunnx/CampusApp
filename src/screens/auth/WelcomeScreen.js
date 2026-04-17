import React from 'react';
import { COLORS } from '../../constants';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const WelcomeScreen = ({ navigate }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.content}>
        {/* Logo/Title Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>CampusConnect</Text>
          <Text style={styles.subtitle}>Your Campus Network Companion</Text>
          <Text style={styles.description}>
            Connect, Order, Deliver - All in One Place
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🍔</Text>
            <Text style={styles.featureText}>Order Food</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📦</Text>
            <Text style={styles.featureText}>Quick Delivery</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>👥</Text>
            <Text style={styles.featureText}>Connect Campus</Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
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
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#e8f5e9',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#c8e6c9',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonsSection: {
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default WelcomeScreen;
