import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { fetchShopkeeperOrders } from '../../redux/slices/orderSlice';
import socketService from '../../services/socket';
import api from '../../services/api';
import Header from '../../components/common/Header';
import DashboardCard from '../../components/cards/DashboardCard';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';
import { transformDashboardStats } from '../../utils/dataTransformers';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 cards per row with padding

const ShopkeeperDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { orders } = useSelector(state => state.orders);
  const ordersList = orders || [];
  
  const [refreshing, setRefreshing] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    categories: 0,
    totalProducts: 0,
    totalOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    // Load initial data
    if (user?.id) {
      loadDashboardData();
      
      // Join shopkeeper room for real-time updates
      console.log('Dashboard joining shopkeeper room:', user.id);
      socketService.joinShopkeeperRoom(user.id);
    }
    
    // Listen for new orders
    const handleNewOrder = (orderData) => {
      console.log('Dashboard received new order:', orderData);
      if (orderData?.shopkeeperId === user?.id) {
        console.log('Order is for this shopkeeper, refreshing data');
        // Refresh dashboard data when new order arrives
        loadDashboardData();
        Alert.alert('New Order!', 'A new order has been placed for your shop.');
      } else {
        console.log('Order is for different shopkeeper:', orderData?.shopkeeperId, 'vs', user?.id);
      }
    };
    
    socketService.onNewOrder(handleNewOrder);
    
    // Listen for order status updates
    const handleStatusUpdate = (updateData) => {
      console.log('Dashboard received order status update:', updateData);
      // Refresh dashboard data when order status changes
      loadDashboardData();
    };
    
    socketService.onOrderStatusUpdate(handleStatusUpdate);
    
    return () => {
      socketService.offNewOrder(handleNewOrder);
      socketService.offOrderStatusUpdate(handleStatusUpdate);
    };
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      if (user?.id) {
        console.log('Loading dashboard data for shopkeeper:', user.id);
        setLoadingStats(true);

        // Fetch orders
        const ordersResult = await dispatch(fetchShopkeeperOrders());
        console.log('Dashboard - Orders fetched:', ordersResult);

        // Fetch dashboard stats from backend
        await fetchDashboardStats();
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const response = await api.get('/Dashboard/stats');
      const transformedStats = transformDashboardStats(response);
      setDashboardStats(transformedStats);
    } catch (error) {
      console.log('Failed to fetch dashboard stats from backend, using order counts:', error.message);
      // Fallback to calculating from orders
      updateDashboardStats();
    } finally {
      setLoadingStats(false);
    }
  };

  const updateDashboardStats = () => {
    const totalOrders = ordersList.length;
    const completedOrders = ordersList.filter(order => order.status === ORDER_STATUS.COMPLETED).length;
    
    setDashboardStats(prev => ({
      ...prev,
      totalOrders,
      completedOrders,
      // For demo purposes, set some reasonable defaults for categories and products
      // In a real app, these would come from separate API calls
      categories: 5,
      totalProducts: 25,
    }));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [user]);

  useEffect(() => {
    if (Array.isArray(ordersList)) {
      console.log('Shopkeeper dashboard orders updated:', ordersList);
      updateDashboardStats();
    }
  }, [ordersList]);

  const handleCardPress = (cardType) => {
    switch (cardType) {
      case 'products':
        // Navigate to Products Screen
        navigation.navigate('Products');
        break;
      case 'orders':
        // Navigate to Orders Screen
        navigation.navigate('Orders');
        break;
      case 'categories':
        // Navigate to Categories Screen (if exists)
        Alert.alert('Categories', 'Navigate to Categories Screen');
        break;
      case 'completed':
        // Navigate to Orders Screen with completed filter
        navigation.navigate('Orders');
        break;
      default:
        Alert.alert('Card Pressed', `You pressed ${cardType}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Header title="🏪 Shopkeeper Dashboard" />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Stats Grid */}
        {loadingStats ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading dashboard stats...</Text>
          </View>
        ) : (
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
        )}

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
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Orders')}>
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
          <View style={styles.recentOrdersHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {ordersList.slice(0, 3).map((order) => (
            <TouchableOpacity 
              key={order.id} 
              style={styles.orderItem}
              onPress={() => navigation.navigate('Orders')}
            >
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #{String(order.id).slice(-6)}</Text>
                <Text style={styles.orderStatus}>{order.status}</Text>
              </View>
              <Text style={styles.orderAmount}>PKR {order.totalAmount + order.deliveryCharge}</Text>
            </TouchableOpacity>
          ))}
          
          {ordersList.length === 0 && (
            <View style={styles.noOrdersContainer}>
              <Text style={styles.noOrdersText}>No orders yet</Text>
              <Text style={styles.noOrdersSubtext}>Orders will appear here when placed</Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    backgroundColor: COLORS.primary,
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
    marginTop: 16,
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
  recentOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  viewAllText: {
    fontSize: SIZES.font - 1,
    color: COLORS.primary,
    fontWeight: '600',
  },
  noOrdersContainer: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  noOrdersText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    fontWeight: '500',
  },
  noOrdersSubtext: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    marginTop: 4,
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
    color: COLORS.primary,
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
  },
});

export default ShopkeeperDashboardScreen;
