import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDelivererAssignedOrders } from '../../redux/slices/orderSlice';
import Header from '../../components/common/Header';
import OrderCard from '../../components/cards/OrderCard';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

const DeliveryHistoryScreen = ({ navigation }) => {
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
      await dispatch(fetchDelivererAssignedOrders()).unwrap();
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
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const getCompletedOrders = () => {
    if (!Array.isArray(orders)) {
      return [];
    }
    return orders.filter(order => 
      order.delivererId === user?.id && 
      order.status === ORDER_STATUS.COMPLETED
    ).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  };

  const getStatusCount = (status) => {
    if (!Array.isArray(orders)) {
      return 0;
    }
    return orders.filter(order => 
      order.delivererId === user?.id && order.status === status
    ).length;
  };

  const renderStatsBar = () => {
    const completedOrders = getCompletedOrders();
    const totalEarnings = completedOrders.length * 100; // 100 PKR per delivery
    const todayEarnings = completedOrders
      .filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      })
      .length * 100;
    
    return (
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedOrders.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>PKR {totalEarnings}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>PKR {todayEarnings}</Text>
          <Text style={styles.statLabel}>Today's Earnings</Text>
        </View>
      </View>
    );
  };

  const renderFilterTabs = () => {
    const completedOrders = getCompletedOrders();
    const filters = [
      { key: 'All', label: 'All', count: completedOrders.length },
      { key: 'today', label: 'Today', count: completedOrders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      }).length },
      { key: 'week', label: 'This Week', count: completedOrders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
      }).length },
      { key: 'month', label: 'This Month', count: completedOrders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return orderDate >= monthAgo;
      }).length },
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

  const getFilteredOrders = () => {
    let filtered = getCompletedOrders();
    
    if (selectedFilter === 'today') {
      const today = new Date();
      filtered = filtered.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === today.toDateString();
      });
    } else if (selectedFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekAgo;
      });
    } else if (selectedFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthAgo;
      });
    }
    
    return filtered;
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
            showActions={false}
            style={styles.orderCard}
          />
        )}
        contentContainerStyle={[
          styles.ordersContent,
          // Center empty state when no orders
          filteredOrders.length === 0 && { flex: 1 },
        ]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View>
            {renderStatsBar()}
            {renderFilterTabs()}
          </View>
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>No Delivery History</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'All' 
                ? 'You haven\'t completed any deliveries yet' 
                : `No deliveries found for ${selectedFilter}`}
            </Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Delivery History" onBackPress={() => navigation.goBack()} rightComponent={<Text style={styles.subtitle}>{getCompletedOrders().length} completed</Text>} />

      {renderOrders()}
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
  statsBar: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  statLabel: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
  },
  filterTabs: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
    maxHeight: 70,
    height: 70,
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
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.padding,
  },
  emptyText: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  emptySubtext: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default DeliveryHistoryScreen;
