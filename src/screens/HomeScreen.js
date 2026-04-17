import React from 'react';
import { COLORS } from '../constants';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';

const HomeScreen = ({ handleLogout: onLogout }) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Call the parent handleLogout function
            onLogout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Home Screen</Text>
          <Text style={styles.subtitle}>CampusConnect Dashboard</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>🎉 Welcome!</Text>
            <Text style={styles.welcomeMessage}>
              You have successfully logged into CampusConnect
            </Text>
          </View>

          <View style={styles.featuresGrid}>
            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureEmoji}>🍔</Text>
              <Text style={styles.featureTitle}>Order Food</Text>
              <Text style={styles.featureDescription}>Browse campus food options</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureEmoji}>📦</Text>
              <Text style={styles.featureTitle}>My Orders</Text>
              <Text style={styles.featureDescription}>Track your deliveries</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureEmoji}>👤</Text>
              <Text style={styles.featureTitle}>Profile</Text>
              <Text style={styles.featureDescription}>Manage your account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e8f5e9',
  },
  mainContent: {
    flex: 1,
    padding: 24,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 24,
    backgroundColor: '#ffffff',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default HomeScreen;
