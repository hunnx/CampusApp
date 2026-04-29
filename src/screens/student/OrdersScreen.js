import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchOrders } from '../../redux/slices/orderSlice';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS, ORDER_STATUS } from '../../constants';
import ModernCard from '../../components/common/ModernCard';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { orders, isLoading } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useFocusEffect(
    useCallback(() => { loadOrders(); }, [user?.id])
  );

  const loadOrders = async () => {
    try { await dispatch(fetchOrders({ userId: user?.id, userRole: user?.role })); }
    catch (error) { console.error('Failed to load orders:', error); }
  };

  const onRefresh = async () => { setRefreshing(true); await loadOrders(); setRefreshing(false); };

  const handleOrderPress = (order) => navigation.navigate('OrderTracking', { orderId: order.id });

  const getFilteredOrders = () => {
    const list = Array.isArray(orders) ? orders : [];
    const filtered = selectedFilter === 'All' ? list : list.filter(o => String(o?.status || '').toLowerCase() === String(selectedFilter || '').toLowerCase());
    return filtered.slice().sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  };

  const getStatusCount = (status) => {
    const list = Array.isArray(orders) ? orders : [];
    return list.filter(o => String(o?.status || '').toLowerCase() === String(status || '').toLowerCase()).length;
  };

  const statusVariant = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'completed' || s === 'delivered') return 'success';
    if (s === 'pending') return 'warning';
    if (s === 'preparing' || s === 'ready') return 'info';
    return 'neutral';
  };

  const filters = [
    { key: 'All', label: 'All' },
    { key: ORDER_STATUS.PENDING, label: 'Pending' },
    { key: ORDER_STATUS.PREPARING, label: 'Preparing' },
    { key: ORDER_STATUS.READY, label: 'Ready' },
    { key: ORDER_STATUS.DELIVERED, label: 'Delivered' },
    { key: ORDER_STATUS.COMPLETED, label: 'Completed' },
  ];

  const filtered = getFilteredOrders();

  if (isLoading && !refreshing) {
    return React.createElement(View, { style: [styles.container, { backgroundColor: colors.background }] },
      React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
        React.createElement(Text, { style: styles.headerTitle }, 'My Orders'),
      ),
      React.createElement(View, { style: { padding: 20 } },
        React.createElement(SkeletonLoader, { variant: 'list', count: 3 })
      )
    );
  }

  return React.createElement(View, { style: [styles.container, { backgroundColor: colors.background }] },
    React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
      React.createElement(View, { style: styles.headerTop },
        React.createElement(Text, { style: styles.headerTitle }, 'My Orders'),
        React.createElement(View, { style: [styles.countBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }] },
          React.createElement(Text, { style: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 } }, String(Array.isArray(orders) ? orders.length : 0))
        )
      )
    ),

    React.createElement(ScrollView, {
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      contentContainerStyle: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
    },
      filters.map(f => {
        const isActive = selectedFilter === f.key;
        const count = f.key === 'All' ? (Array.isArray(orders) ? orders.length : 0) : getStatusCount(f.key);
        return React.createElement(TouchableOpacity, {
          key: f.key,
          onPress: () => setSelectedFilter(f.key),
          style: [styles.filterChip, {
            backgroundColor: isActive ? colors.primary : colors.light,
          }],
        },
          React.createElement(Text, { style: [styles.filterText, { color: isActive ? '#FFFFFF' : colors.gray }] }, f.label),
          React.createElement(View, { style: [styles.filterCount, { backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : colors.border }] },
            React.createElement(Text, { style: { fontSize: 11, fontWeight: '700', color: isActive ? '#FFFFFF' : colors.gray } }, String(count))
          )
        );
      })
    ),

    React.createElement(FlatList, {
      data: filtered,
      keyExtractor: (item, index) => String(item?.id || index),
      contentContainerStyle: { paddingHorizontal: 16, paddingBottom: 110 },
      showsVerticalScrollIndicator: false,
      refreshControl: React.createElement(RefreshControl, { refreshing, onRefresh, colors: [colors.primary] }),
      ListEmptyComponent: !isLoading ? React.createElement(EmptyState, {
        icon: 'receipt-outline',
        title: 'No Orders Yet',
        subtitle: 'You have not placed any orders yet. Start shopping!',
        actionTitle: 'Start Shopping',
        onAction: () => navigation.navigate('Home'),
      }) : null,
      renderItem: ({ item }) => {
        if (!item) return null;
        const total = (item.totalAmount || 0) + (item.deliveryCharge || 0);
        return React.createElement(ModernCard, {
          onPress: () => handleOrderPress(item),
          variant: 'elevated',
          borderRadius: BORDER_RADIUS['2xl'],
          padding: 20,
          style: { marginBottom: 14 },
        },
          React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
            React.createElement(View, null,
              React.createElement(Text, { style: [styles.orderId, { color: colors.dark }] }, 'Order #' + String(item.id).slice(-6)),
              React.createElement(Text, { style: [styles.orderDate, { color: colors.grayLight }] }, item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '')
            ),
            React.createElement(Badge, { text: item.status, variant: statusVariant(item.status) })
          ),
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 } },
            React.createElement(Icon, { name: 'cube-outline', size: 16, color: colors.gray }),
            React.createElement(Text, { style: [styles.orderMeta, { color: colors.grayLight }] }, (item.items?.length || 0) + ' items')
          ),
          React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.light, paddingTop: 12 } },
            React.createElement(Text, { style: [styles.orderLabel, { color: colors.gray }] }, 'Total'),
            React.createElement(Text, { style: [styles.orderTotal, { color: colors.primary }] }, 'PKR ' + total)
          )
        );
      },
    })
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: FONTS.h1.size, fontWeight: '800', color: '#FFFFFF' },
  countBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  filterText: { fontSize: 13, fontWeight: '600', marginRight: 6 },
  filterCount: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, minWidth: 20, alignItems: 'center' },
  orderId: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  orderDate: { fontSize: 12 },
  orderMeta: { fontSize: 13, marginLeft: 6 },
  orderLabel: { fontSize: 13, fontWeight: '500' },
  orderTotal: { fontSize: 16, fontWeight: '700' },
});

export default OrdersScreen;
