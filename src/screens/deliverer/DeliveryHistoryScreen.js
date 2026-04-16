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
import { fetchOrders } from '../../redux/slices/orderSlice';
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

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const getCompletedOrders = () => {
    return orders.filter(order => 
      order.delivererId === user?.id && 
      order.status === ORDER_STATUS.COMPLETED
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getStatusCount = (status) => {
    return orders.filter(order => 
      order.delivererId === user?.id && order.status === status
    ).length;
  };

  const renderStatsBar = () => {
    const completedOrders = getCompletedOrders();
    const totalEarnings = completedOrders.length * 100; // 100 PKR per delivery
    const todayEarnings = completedOrders
      .filter(order => {
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
    const filters = [
      { key: 'All', label: 'All', count: getCompletedOrders().length },
      { key: 'today', label: 'Today', count: getCompletedOrders().filter(order => {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      }).length },
      { key: 'week', label: 'This Week', count: getCompletedOrders().filter(order => {
        const orderDate = new Date(order.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
      }).length },
      { key: 'month', label: 'This Month', count: getCompletedOrders().filter(order => {
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
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === today.toDateString();
      });
    } else if (selectedFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekAgo;
      });
    } else if (selectedFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthAgo;
      });
    }
    
    return filtered;
  };

  const renderOrders = () => {
    const filteredOrders = getFilteredOrders();
    
    if (filteredOrders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No Delivery History</Text>
          <Text style={styles.emptySubtext}>
            {selectedFilter === 'All' 
              ? 'You haven\'t completed any deliveries yet' 
              : `No deliveries found for ${selectedFilter}`}
          </Text>
        </View>
      );
    }

    return filteredOrders.map(order => (
      <OrderCard
        key={order.id}
        order={order}
        onPress={handleOrderPress}
        showActions={false}
        style={styles.orderCard}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Header title="Delivery History" rightComponent={<Text style={styles.subtitle}>{getCompletedOrders().length} completed</Text>} />

      {renderStatsBar()}
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
