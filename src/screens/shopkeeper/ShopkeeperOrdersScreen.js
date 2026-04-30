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
import { fetchShopkeeperOrders, updateOrderStatus, addNewOrder } from '../../redux/slices/orderSlice';
import socketService from '../../services/socket';
import Header from '../../components/common/Header';
import OrderCard from '../../components/cards/OrderCard';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

const ShopkeeperOrdersScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector(state => state.orders);
  const ordersList = orders || [];
  const { user, token } = useSelector(state => state.auth);
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(route?.params?.filter || 'All');

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
    
    // Listen for new orders (socket is already connected in login)
    const handleNewOrder = (orderData) => {
      if (orderData?.shopkeeperId === user?.id) {
        dispatch(addNewOrder(orderData));
        Alert.alert('New Order!', 'A new order has been placed for your shop.');
      }
    };
    
    socketService.onNewOrder(handleNewOrder);
    
    // Listen for order status updates
    const handleStatusUpdate = (updateData) => {
      console.log('Order status updated:', updateData);
    };
    
    socketService.onOrderStatusUpdate(handleStatusUpdate);
    
    return () => {
      // Cleanup socket listeners
      socketService.offNewOrder(handleNewOrder);
      socketService.offOrderStatusUpdate(handleStatusUpdate);
    };
  }, [user?.id]);

  const loadOrders = async () => {
    try {
      await dispatch(fetchShopkeeperOrders());
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
      }));
      
      // Auto-switch to the new status tab
      setSelectedFilter(newStatus);
      
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
    if (!Array.isArray(ordersList)) {
      return [];
    }

    let filtered = ordersList;
    
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(order => order.status === selectedFilter);
    }
    
    return filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  };

  const getStatusCount = (status) => {
    if (!Array.isArray(ordersList)) {
      return 0;
    }
    return ordersList.filter(order => order.status === status).length;
  };

  const renderFilterTabs = () => {
    if (!Array.isArray(ordersList)) {
      return null;
    }

    const filters = [
      { key: 'All', label: 'All', count: ordersList.length },
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
            showActions={true}
            onStatusChange={handleStatusChange}
            style={styles.orderCard}
          />
        )}
        contentContainerStyle={[
          styles.ordersContent,
          // Center empty state when no orders
          filteredOrders.length === 0 && { flex: 1 },
        ]}
        initialNumToRender={8}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={renderFilterTabs}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedFilter === 'All' ? 'No orders yet' : `No ${selectedFilter.toLowerCase()} orders`}
            </Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Shop Orders" rightComponent={<Text style={styles.subtitle}>{ordersList.length} orders</Text>} />

      {isLoading && ordersList.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : (
        renderOrders()
      )}
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
    width: '48%',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
});

export default ShopkeeperOrdersScreen;
