import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import Header from '../../components/common/Header';
import OrderCard from '../../components/cards/OrderCard';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

const ActiveDeliveryScreen = ({ navigation }) => {
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ 
        orderId, 
        status: newStatus 
      })).unwrap();
      
      Alert.alert(
        'Status Updated',
        `Order status updated to ${newStatus}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleOrderPress = (order) => {
    navigation.navigate('DeliveryMap', { orderId: order.id });
  };

  const getActiveOrders = () => {
    return orders.filter(order => 
      String(order.delivererId) === String(user?.id) && 
      (order.status === ORDER_STATUS.PICKED || order.status === ORDER_STATUS.DELIVERED)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const renderStatsBar = () => {
    const activeOrders = getActiveOrders();
    const currentEarnings = activeOrders.reduce((sum, order) => sum + 100, 0); // 100 PKR per delivery
    
    return (
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{activeOrders.length}</Text>
          <Text style={styles.statLabel}>Active Deliveries</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>PKR {currentEarnings}</Text>
          <Text style={styles.statLabel}>Current Earnings</Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🚚</Text>
        <Text style={styles.emptyText}>No Active Deliveries</Text>
        <Text style={styles.emptySubtext}>
          Accept orders from Available Orders to start delivering
        </Text>
        <Button
          title="View Available Orders"
          onPress={() => navigation.navigate('Available')}
          style={styles.availableButton}
        />
      </View>
    );
  };

  const renderOrderActions = (order) => {
    const actions = [];

    if (order.status === ORDER_STATUS.PICKED) {
      actions.push(
        <Button
          key="delivered"
          title="Mark as Delivered"
          onPress={() => handleStatusUpdate(order.id, ORDER_STATUS.DELIVERED)}
          type="success"
          style={styles.actionButton}
        />
      );
    }

    if (order.status === ORDER_STATUS.DELIVERED) {
      actions.push(
        <Button
          key="completed"
          title="Complete Order"
          onPress={() => handleStatusUpdate(order.id, ORDER_STATUS.COMPLETED)}
          style={styles.actionButton}
        />
      );
    }

    return actions.length > 0 ? (
      <View style={styles.orderActions}>{actions}</View>
    ) : null;
  };

  const renderOrders = () => {
    const activeOrders = getActiveOrders();

    if (activeOrders.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={activeOrders}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.orderContainer}>
            <OrderCard
              order={item}
              onPress={handleOrderPress}
              showActions={false}
              style={styles.orderCard}
            />
            {renderOrderActions(item)}
          </View>
        )}
        contentContainerStyle={styles.ordersContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmptyState}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Active Delivery" rightComponent={<Text style={styles.subtitle}>{getActiveOrders().length} in progress</Text>} />

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
    paddingBottom: SIZES.padding * 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  orderContainer: {
    flex: 1,
    marginHorizontal: SIZES.base / 2,
    marginBottom: SIZES.base,
    minWidth: 0,
  },
  orderCard: {
    marginBottom: SIZES.base,
  },
  orderActions: {
    paddingHorizontal: SIZES.padding,
  },
  actionButton: {
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
  availableButton: {
    paddingHorizontal: SIZES.padding * 2,
  },
});

export default ActiveDeliveryScreen;
