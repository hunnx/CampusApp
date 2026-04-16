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
import { fetchOrders, acceptOrder } from '../../redux/slices/orderSlice';
import Header from '../../components/common/Header';
import OrderCard from '../../components/cards/OrderCard';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

const AvailableOrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  
  const [refreshing, setRefreshing] = useState(false);

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

  const handleAcceptOrder = async (orderId) => {
    try {
      await dispatch(acceptOrder({ 
        orderId, 
        delivererId: user?.id 
      })).unwrap();
      
      Alert.alert(
        'Order Accepted!',
        'You have accepted this order. Please proceed to pickup.',
        [
          {
            text: 'View Details',
            onPress: () => navigation.navigate('OrderDetail', { orderId }),
          },
          {
            text: 'Go to Active',
            onPress: () => navigation.navigate('Active'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to accept order. Please try again.');
    }
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const getAvailableOrders = () => {
    return orders.filter(order => 
      order.status === ORDER_STATUS.READY && 
      !order.delivererId
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const renderStatsBar = () => {
    const availableOrders = getAvailableOrders();
    const totalEarnings = availableOrders.length * 100; // Assuming 100 PKR per delivery
    
    return (
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{availableOrders.length}</Text>
          <Text style={styles.statLabel}>Available Orders</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>PKR {totalEarnings}</Text>
          <Text style={styles.statLabel}>Potential Earnings</Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>No Available Orders</Text>
        <Text style={styles.emptySubtext}>
          Check back later for new delivery opportunities
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderOrders = () => {
    const availableOrders = getAvailableOrders();
    
    if (availableOrders.length === 0) {
      return renderEmptyState();
    }

    return availableOrders.map(order => (
      <OrderCard
        key={order.id}
        order={order}
        onPress={handleOrderPress}
        onAccept={handleAcceptOrder}
        showActions={true}
        style={styles.orderCard}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Header title="Available Orders" rightComponent={<Text style={styles.subtitle}>{getAvailableOrders().length} orders</Text>} />

      {renderStatsBar()}

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
    marginBottom: SIZES.padding * 2,
  },
  refreshButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  refreshButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});

export default AvailableOrdersScreen;
