import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchOrders, acceptOrder } from '../../redux/slices/orderSlice';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS, SHADOWS, ORDER_STATUS } from '../../constants';
import ModernCard from '../../components/common/ModernCard';
import ModernButton from '../../components/common/ModernButton';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

const AvailableOrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { orders, isLoading } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try { await dispatch(fetchOrders({ userId: user?.id, userRole: user?.role })).unwrap(); }
    catch (error) { console.error('Failed to load orders:', error); }
  };

  const onRefresh = async () => { setRefreshing(true); await loadOrders(); setRefreshing(false); };

  const handleAcceptOrder = async (orderId) => {
    try {
      await dispatch(acceptOrder({ orderId, delivererId: user?.id })).unwrap();
      Alert.alert('Order Accepted!', 'You have accepted this order.', [
        { text: 'View Details', onPress: () => navigation.navigate('OrderDetail', { orderId }) },
        { text: 'Go to Active', onPress: () => navigation.navigate('Active') },
      ]);
    } catch (error) { Alert.alert('Error', 'Failed to accept order.'); }
  };

  const handleOrderPress = (order) => navigation.navigate('OrderDetail', { orderId: order.id });

  const getAvailableOrders = () => {
    return orders.filter(o => o.status === ORDER_STATUS.READY && !o.delivererId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const available = getAvailableOrders();
  const totalEarnings = available.length * 100;

  const renderStatsBar = () => React.createElement(ModernCard, {
    variant: 'elevated',
    borderRadius: BORDER_RADIUS.xl,
    padding: 20,
    style: { marginHorizontal: 16, marginBottom: 16, flexDirection: 'row' },
  },
    React.createElement(View, { style: { flex: 1, alignItems: 'center' } },
      React.createElement(Text, { style: [styles.statValue, { color: colors.primary }] }, String(available.length)),
      React.createElement(Text, { style: [styles.statLabel, { color: colors.gray }] }, 'Available')
    ),
    React.createElement(View, { style: { width: 1, backgroundColor: colors.light } }),
    React.createElement(View, { style: { flex: 1, alignItems: 'center' } },
      React.createElement(Text, { style: [styles.statValue, { color: colors.accent }] }, 'PKR ' + totalEarnings),
      React.createElement(Text, { style: [styles.statLabel, { color: colors.gray }] }, 'Earnings')
    )
  );

  const renderOrder = ({ item }) => React.createElement(ModernCard, {
    variant: 'elevated',
    borderRadius: BORDER_RADIUS['2xl'],
    padding: 20,
    style: { marginHorizontal: 16, marginBottom: 14 },
  },
    React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
      React.createElement(Text, { style: [styles.orderId, { color: colors.dark }] }, 'Order #' + String(item.id).slice(-6)),
      React.createElement(Badge, { text: item.status, variant: 'info' })
    ),
    React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 } },
      React.createElement(Icon, { name: 'location-outline', size: 16, color: colors.primary }),
      React.createElement(Text, { style: [styles.orderText, { color: colors.grayLight }] }, 'Pickup: Campus Store')
    ),
    React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 } },
      React.createElement(Icon, { name: 'navigate-outline', size: 16, color: colors.accent }),
      React.createElement(Text, { style: [styles.orderText, { color: colors.grayLight }] }, 'Drop: Hostel Block A')
    ),
    React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
      React.createElement(View, null,
        React.createElement(Text, { style: [styles.earningLabel, { color: colors.gray }] }, 'You earn'),
        React.createElement(Text, { style: [styles.earningValue, { color: colors.accent }] }, 'PKR 100')
      ),
      React.createElement(ModernButton, {
        title: 'Accept',
        size: 'sm',
        onPress: () => handleAcceptOrder(item.id),
      })
    )
  );

  if (available.length === 0 && !isLoading) {
    return React.createElement(View, { style: [styles.container, { backgroundColor: colors.background }] },
      React.createElement(View, { style: [styles.header, { backgroundColor: colors.accent }] },
        React.createElement(Text, { style: styles.headerTitle }, 'Available Orders')
      ),
      React.createElement(EmptyState, {
        icon: 'bicycle-outline',
        title: 'No Available Orders',
        subtitle: 'Check back later for new delivery opportunities',
        actionTitle: 'Refresh',
        onAction: onRefresh,
      })
    );
  }

  return React.createElement(View, { style: [styles.container, { backgroundColor: colors.background }] },
    React.createElement(View, { style: [styles.header, { backgroundColor: colors.accent }] },
      React.createElement(View, { style: styles.headerTop },
        React.createElement(Text, { style: styles.headerTitle }, 'Available Orders'),
        React.createElement(TouchableOpacity, { onPress: onRefresh, style: [styles.refreshBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }] },
          React.createElement(Icon, { name: 'refresh', size: 20, color: '#FFFFFF' })
        )
      ),
      React.createElement(Text, { style: styles.headerSubtitle }, available.length + ' orders waiting for you')
    ),

    React.createElement(FlatList, {
      data: available,
      renderItem: renderOrder,
      keyExtractor: (item) => String(item.id),
      contentContainerStyle: { paddingTop: 16, paddingBottom: 40 },
      showsVerticalScrollIndicator: false,
      ListHeaderComponent: renderStatsBar,
    })
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerTitle: { fontSize: FONTS.h1.size, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: FONTS.bodySmall.size, color: 'rgba(255,255,255,0.85)' },
  refreshBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '500' },
  orderId: { fontSize: 16, fontWeight: '600' },
  orderText: { fontSize: 13, marginLeft: 8 },
  earningLabel: { fontSize: 12, marginBottom: 2 },
  earningValue: { fontSize: 18, fontWeight: '700' },
});

export default AvailableOrdersScreen;
