import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import OrderCard from '../../components/cards/OrderCard';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

const ShopkeeperOrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      await dispatch(fetchOrders({ 
        userId: user?.id, 
        userRole: user?.role 
      })).unwrap();
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ 
        orderId, 
        status: newStatus 
      })).unwrap();
      
      Alert.alert(
        'Success',
        `Order status updated to ${newStatus}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleOrderPress = (order) => {
    // Navigate to order details if needed
    console.log('Order pressed:', order);
  };

  const getFilteredOrders = () => {
    let filtered = orders.filter(order => order.shopkeeperId === user?.id);
    
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(order => order.status === selectedFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getStatusCount = (status) => {
    return orders.filter(order => 
      order.shopkeeperId === user?.id && order.status === status
    ).length;
  };

  const renderFilterTabs = () => {
    const filters = [
      { key: 'All', label: 'All', count: orders.filter(o => o.shopkeeperId === user?.id).length },
      { key: ORDER_STATUS.PENDING, label: 'Pending', count: getStatusCount(ORDER_STATUS.PENDING) },
      { key: ORDER_STATUS.PREPARING, label: 'Preparing', count: getStatusCount(ORDER_STATUS.PREPARING) },
      { key: ORDER_STATUS.READY, label: 'Ready', count: getStatusCount(ORDER_STATUS.READY) },
      { key: ORDER_STATUS.COMPLETED, label: 'Completed', count: getStatusCount(ORDER_STATUS.COMPLETED) },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterTabs}
        contentContainerStyle={styles.filterTabsContent}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === filter.key && styles.filterTabTextActive,
              ]}
            >
              {filter.label}
            </Text>
            <View style={[
              styles.filterBadge,
              selectedFilter === filter.key && styles.filterBadgeActive,
            ]}>
              <Text style={[
                styles.filterBadgeText,
                selectedFilter === filter.key && styles.filterBadgeTextActive,
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderOrders = () => {
    const filteredOrders = getFilteredOrders();
    
    if (filteredOrders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedFilter === 'All' 
              ? 'No orders yet' 
              : `No ${selectedFilter.toLowerCase()} orders`}
          </Text>
        </View>
      );
    }

    return filteredOrders.map(order => (
      <OrderCard
        key={order.id}
        order={order}
        onPress={handleOrderPress}
        showActions={true}
        onStatusChange={handleStatusChange}
        style={styles.orderCard}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>
          {orders.filter(o => o.shopkeeperId === user?.id).length} total orders
        </Text>
      </View>

      {renderFilterTabs()}

      <ScrollView
        style={styles.ordersContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.ordersContent}
      >
        {renderOrders()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  subtitle: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
    marginTop: SIZES.base / 2,
  },
  filterTabs: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  filterTabsContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.light,
    marginRight: SIZES.base,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
    fontWeight: '500',
    marginRight: SIZES.base / 2,
  },
  filterTabTextActive: {
    color: COLORS.white,
  },
  filterBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.base / 2,
    paddingVertical: 2,
    borderRadius: SIZES.radius / 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: SIZES.font - 3,
    color: COLORS.primary,
    fontWeight: '600',
  },
  filterBadgeTextActive: {
    color: COLORS.white,
  },
  ordersContainer: {
    flex: 1,
  },
  ordersContent: {
    padding: SIZES.base,
  },
  orderCard: {
    marginBottom: SIZES.base,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default ShopkeeperOrdersScreen;
