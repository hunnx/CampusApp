import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchOrders } from '../../redux/slices/orderSlice';
import Header from '../../components/common/Header';
import OrderCard from '../../components/cards/OrderCard';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Load orders when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [user?.id])
  );

  const loadOrders = async () => {
    try {
      await dispatch(fetchOrders({ 
        userId: user?.id, 
        userRole: user?.role 
      }));
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (order) => {
    console.log('OrdersScreen - Order pressed:', order.id, order);
    navigation.navigate('OrderTracking', { orderId: order.id });
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(order => order.status === selectedFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const renderFilterTabs = () => {
    const filters = [
      { key: 'All', label: 'All', count: orders.length },
      { key: ORDER_STATUS.PENDING, label: 'Pending', count: getStatusCount(ORDER_STATUS.PENDING) },
      { key: ORDER_STATUS.PREPARING, label: 'Preparing', count: getStatusCount(ORDER_STATUS.PREPARING) },
      { key: ORDER_STATUS.READY, label: 'Ready', count: getStatusCount(ORDER_STATUS.READY) },
      { key: ORDER_STATUS.DELIVERED, label: 'Delivered', count: getStatusCount(ORDER_STATUS.DELIVERED) },
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
              ? 'No orders yet. Start shopping!' 
              : `No ${selectedFilter.toLowerCase()} orders`}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={handleOrderPress}
            showActions={false}
            style={styles.orderCard}
          />
        )}
        contentContainerStyle={styles.ordersContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmptyState}
      />
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptySubtitle}>
          You haven't placed any orders yet. Start shopping to see your orders here!
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="My Orders" onBackPress={() => navigation.goBack()} rightComponent={<Text style={styles.subtitle}>{orders.length} total orders</Text>} />

      <FlatList
        data={getFilteredOrders()}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={handleOrderPress}
            showActions={false}
            style={styles.orderCard}
          />
        )}
        contentContainerStyle={[
          styles.ordersContent,
          // Center empty state when no orders
          orders.length === 0 && { flex: 1 },
        ]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={renderFilterTabs}
        ListEmptyComponent={renderEmptyState}
      />
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
    color: COLORS.white,
    marginTop: SIZES.base / 2,
  },
  filterTabs: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
    maxHeight: 150,
    height: 80,
    paddingVertical: SIZES.base / 2,
  },
  filterTabsContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 2,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 3,
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
    paddingBottom: SIZES.padding * 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  orderCard: {
    flex: 1,
    marginHorizontal: SIZES.base / 2,
    marginBottom: SIZES.base,
    minWidth: 0,
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.padding,
  },
  emptyTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  emptySubtitle: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding * 2,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});

export default OrdersScreen;
