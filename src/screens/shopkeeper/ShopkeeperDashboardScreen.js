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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../../redux/slices/authSlice';
import { fetchShopkeeperOrders } from '../../redux/slices/orderSlice';
import socketService from '../../services/socket';
import api from '../../services/api';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS, SHADOWS, ORDER_STATUS } from '../../constants';
import ModernCard from '../../components/common/ModernCard';
import ModernButton from '../../components/common/ModernButton';
import Badge from '../../components/common/Badge';
import { transformDashboardStats } from '../../utils/dataTransformers';

const { width } = Dimensions.get('window');
const cardWidth = (width - 56) / 2;

const ShopkeeperDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { user } = useSelector(state => state.auth);
  const { orders } = useSelector(state => state.orders);
  const ordersList = orders || [];

  const [refreshing, setRefreshing] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    categories: 0, totalProducts: 0, totalOrders: 0, completedOrders: 0,
  });

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
      socketService.joinShopkeeperRoom(user.id);
    }
    const handleNewOrder = (orderData) => {
      if (orderData?.shopkeeperId === user?.id) {
        loadDashboardData();
        Alert.alert('New Order!', 'A new order has been placed for your shop.');
      }
    };
    const handleStatusUpdate = () => loadDashboardData();
    socketService.onNewOrder(handleNewOrder);
    socketService.onOrderStatusUpdate(handleStatusUpdate);
    return () => {
      socketService.offNewOrder(handleNewOrder);
      socketService.offOrderStatusUpdate(handleStatusUpdate);
    };
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      if (!user?.id) return;
      setLoadingStats(true);
      await dispatch(fetchShopkeeperOrders());
      await fetchDashboardStats();
    } catch (error) { console.error('Failed to load dashboard:', error); }
    finally { setLoadingStats(false); }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const response = await api.get('/Dashboard/stats');
      setDashboardStats(transformDashboardStats(response));
    } catch (error) {
      const totalOrders = ordersList.length;
      const completedOrders = ordersList.filter(o => o.status === ORDER_STATUS.COMPLETED).length;
      setDashboardStats(prev => ({ ...prev, totalOrders, completedOrders, categories: 5, totalProducts: 25 }));
    } finally { setLoadingStats(false); }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [user]);

  const handleCardPress = (type) => {
    if (type === 'products') navigation.navigate('Products');
    else if (type === 'orders') navigation.navigate('Orders');
    else if (type === 'categories') Alert.alert('Categories', 'Coming soon');
    else if (type === 'completed') navigation.navigate('Orders');
  };

  const handleLogout = () => dispatch(logout());

  const stats = [
    { key: 'categories', title: 'Categories', icon: 'grid-outline', color: colors.info, value: dashboardStats.categories },
    { key: 'products', title: 'Products', icon: 'cube-outline', color: colors.accent, value: dashboardStats.totalProducts },
    { key: 'orders', title: 'Orders', icon: 'receipt-outline', color: colors.warning, value: dashboardStats.totalOrders },
    { key: 'completed', title: 'Completed', icon: 'checkmark-circle-outline', color: colors.success, value: dashboardStats.completedOrders },
  ];

  return React.createElement(View, { style: [styles.container, { backgroundColor: colors.background }] },
    React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
      React.createElement(View, { style: styles.headerTop },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.headerTitle }, 'Dashboard'),
          React.createElement(Text, { style: styles.headerSubtitle }, 'Welcome back, ' + (user?.name || 'Shopkeeper'))
        ),
        React.createElement(TouchableOpacity, {
          style: [styles.iconBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }],
          onPress: handleLogout,
        }, React.createElement(Icon, { name: 'log-out-outline', size: 22, color: '#FFFFFF' }))
      )
    ),

    React.createElement(ScrollView, {
      showsVerticalScrollIndicator: false,
      refreshControl: React.createElement(RefreshControl, { refreshing: refreshing, onRefresh: onRefresh }),
      contentContainerStyle: { paddingBottom: 40 },
    },
      // Stats Grid
      React.createElement(View, { style: styles.statsGrid },
        stats.map(stat => React.createElement(ModernCard, {
          key: stat.key,
          onPress: () => handleCardPress(stat.key),
          variant: 'elevated',
          borderRadius: BORDER_RADIUS.xl,
          padding: 20,
          style: { width: cardWidth, alignItems: 'center' },
        },
          React.createElement(View, { style: [styles.statIcon, { backgroundColor: stat.color + '18' }] },
            React.createElement(Icon, { name: stat.icon, size: 24, color: stat.color })
          ),
          React.createElement(Text, { style: [styles.statValue, { color: colors.dark }] }, String(stat.value)),
          React.createElement(Text, { style: [styles.statTitle, { color: colors.gray }] }, stat.title)
        ))
      ),

      // Quick Actions
      React.createElement(ModernCard, {
        variant: 'elevated',
        borderRadius: BORDER_RADIUS['2xl'],
        padding: 8,
        style: { marginHorizontal: 16, marginBottom: 16 },
      },
        [
          { icon: 'add-circle-outline', title: 'Add Category', action: () => navigation.navigate('AddCategory') },
          { icon: 'add-outline', title: 'Add Product', action: () => navigation.navigate('AddProduct') },
          { icon: 'list-outline', title: 'View Orders', action: () => navigation.navigate('Orders') },
          { icon: 'bar-chart-outline', title: 'Sales Report', action: () => Alert.alert('Coming Soon', 'Sales reports feature coming soon!') },
        ].map((item, idx, arr) => React.createElement(TouchableOpacity, {
          key: idx,
          onPress: item.action,
          style: [styles.actionItem, idx < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.light }],
        },
          React.createElement(View, { style: [styles.actionIcon, { backgroundColor: colors.primaryMuted }] },
            React.createElement(Icon, { name: item.icon, size: 20, color: colors.primary })
          ),
          React.createElement(Text, { style: [styles.actionTitle, { color: colors.dark }] }, item.title),
          React.createElement(Icon, { name: 'chevron-forward', size: 18, color: colors.grayLight })
        ))
      ),

      // Recent Orders
      React.createElement(View, { style: { paddingHorizontal: 16 } },
        React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
          React.createElement(Text, { style: [styles.sectionTitle, { color: colors.dark }] }, 'Recent Orders'),
          React.createElement(TouchableOpacity, { onPress: () => navigation.navigate('Orders') },
            React.createElement(Text, { style: { color: colors.primary, fontWeight: '600' } }, 'View All')
          )
        ),
        ordersList.slice(0, 3).map(order => React.createElement(ModernCard, {
          key: order.id,
          variant: 'elevated',
          borderRadius: BORDER_RADIUS.xl,
          padding: 16,
          style: { marginBottom: 10 },
        },
          React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement(View, null,
              React.createElement(Text, { style: [styles.orderId, { color: colors.dark }] }, 'Order #' + String(order.id).slice(-6)),
              React.createElement(Badge, {
                text: order.status,
                variant: order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'info',
              })
            ),
            React.createElement(Text, { style: [styles.orderAmount, { color: colors.primary }] }, 'PKR ' + (order.totalAmount + order.deliveryCharge))
          )
        ))
      )
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: FONTS.h1.size, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: FONTS.bodySmall.size, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  iconBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: -20, marginBottom: 16 },
  statIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  statTitle: { fontSize: 12, fontWeight: '500' },
  actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12 },
  actionIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  actionTitle: { flex: 1, fontSize: 15, fontWeight: '600' },
  sectionTitle: { fontSize: FONTS.h3.size, fontWeight: '700' },
  orderId: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  orderAmount: { fontSize: 16, fontWeight: '700' },
});

export default ShopkeeperDashboardScreen;
