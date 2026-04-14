import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import DashboardCard from '../../components/cards/DashboardCard';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 cards per row with padding

const ShopkeeperDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  // Mock data for dashboard
  const dashboardStats = {
    categories: 8,
    totalProducts: 45,
    totalOrders: 128,
    completedOrders: 115,
  };

  const handleCardPress = (cardType) => {
    switch (cardType) {
      case 'products':
        // Navigate to Products Screen
        navigation.navigate('Products');
        break;
      case 'orders':
        // Navigate to Orders Screen
        Alert.alert('Orders', 'Navigate to Orders Screen');
        break;
      default:
        Alert.alert('Card Pressed', `You pressed ${cardType}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigate('Welcome')}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏪 Shopkeeper Dashboard</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <DashboardCard
            title="Categories"
            value={dashboardStats.categories}
            icon="📂"
            color="#FF6B6B"
            onPress={() => handleCardPress('categories')}
            style={{ width: cardWidth }}
          />
          <DashboardCard
            title="Total Products"
            value={dashboardStats.totalProducts}
            icon="🛍️"
            color="#4ECDC4"
            onPress={() => handleCardPress('products')}
            style={{ width: cardWidth }}
          />
          <DashboardCard
            title="Total Orders"
            value={dashboardStats.totalOrders}
            icon="📦"
            color="#45B7D1"
            onPress={() => handleCardPress('orders')}
            style={{ width: cardWidth }}
          />
          <DashboardCard
            title="Completed"
            value={dashboardStats.completedOrders}
            icon="✅"
            color="#96CEB4"
            onPress={() => handleCardPress('completed')}
            style={{ width: cardWidth }}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddCategory')}>
            <Text style={styles.actionIcon}>📂</Text>
            <Text style={styles.actionText}>Add Category</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddProduct')}>
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add New Product</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Sales Report</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders Preview */}
        <View style={styles.recentOrders}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.orderItem}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #{1000 + item}</Text>
                <Text style={styles.orderStatus}>Preparing</Text>
              </View>
              <Text style={styles.orderAmount}>PKR {(item * 250 + 150)}</Text>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  placeholder: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 24,
  },
  dashboardCard: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  recentOrders: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  orderItem: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
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

export default ShopkeeperDashboardScreen;
