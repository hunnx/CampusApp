import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import Header from '../../components/common/Header';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

const OrderDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      await dispatch(fetchOrders({ 
        userId: user?.id, 
        userRole: user?.role 
      })).unwrap();
      
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder);
    } catch (error) {
      console.error('Failed to load order details:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrderDetails();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await dispatch(updateOrderStatus({ 
        orderId, 
        status: newStatus 
      })).unwrap();
      
      Alert.alert(
        'Status Updated',
        `Order status updated to ${newStatus}`
      );
      
      // Reload order details
      await loadOrderDetails();
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleNavigateToMap = () => {
    navigation.navigate('DeliveryMap', { orderId });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.READY:
        return COLORS.success;
      case ORDER_STATUS.PICKED:
        return COLORS.primary;
      case ORDER_STATUS.DELIVERED:
        return COLORS.warning;
      case ORDER_STATUS.COMPLETED:
        return COLORS.success;
      default:
        return COLORS.gray;
    }
  };

  const renderOrderInfo = () => {
    if (!order) return null;

    return (
      <View style={styles.orderInfo}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order ID:</Text>
          <Text style={styles.infoValue}>#{String(order.id).slice(-6)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Customer:</Text>
          <Text style={styles.infoValue}>{order.studentName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shop:</Text>
          <Text style={styles.infoValue}>{order.shopkeeperName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contact:</Text>
          <Text style={styles.infoValue}>{order.contactNumber}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order Time:</Text>
          <Text style={styles.infoValue}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderLocationInfo = () => {
    if (!order) return null;

    return (
      <View style={styles.locationInfo}>
        <Text style={styles.sectionTitle}>Delivery Route</Text>
        
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationTitle}>Pickup Location</Text>
          </View>
          <Text style={styles.locationAddress}>{order.pickupLocation}</Text>
        </View>
        
        <View style={styles.routeArrow}>
          <Text style={styles.arrowText}>↓</Text>
        </View>
        
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationIcon}>🏠</Text>
            <Text style={styles.locationTitle}>Drop Location</Text>
          </View>
          <Text style={styles.locationAddress}>{order.dropLocation}</Text>
        </View>
        
        <Button
          title="View on Map"
          onPress={handleNavigateToMap}
          style={styles.mapButton}
        />
      </View>
    );
  };

  const renderOrderItems = () => {
    if (!order) return null;

    return (
      <View style={styles.orderItems}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                {item.quantity}x PKR {item.price}
              </Text>
            </View>
            <Text style={styles.itemTotal}>
              PKR {item.price * item.quantity}
            </Text>
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>PKR {order.totalAmount}</Text>
        </View>
        
        <View style={styles.deliveryRow}>
          <Text style={styles.deliveryLabel}>Delivery Fee:</Text>
          <Text style={styles.deliveryValue}>PKR {order.deliveryCharge}</Text>
        </View>
      </View>
    );
  };

  const renderActions = () => {
    if (!order) return null;

    const actions = [];

    if (order.status === ORDER_STATUS.READY && order.delivererId === user?.id) {
      actions.push(
        <Button
          key="picked"
          title="Mark as Picked Up"
          onPress={() => handleStatusUpdate(ORDER_STATUS.PICKED)}
          style={styles.actionButton}
        />
      );
    }

    if (order.status === ORDER_STATUS.PICKED) {
      actions.push(
        <Button
          key="delivered"
          title="Mark as Delivered"
          onPress={() => handleStatusUpdate(ORDER_STATUS.DELIVERED)}
          type="warning"
          style={styles.actionButton}
        />
      );
    }

    if (order.status === ORDER_STATUS.DELIVERED) {
      actions.push(
        <Button
          key="completed"
          title="Complete Order"
          onPress={() => handleStatusUpdate(ORDER_STATUS.COMPLETED)}
          type="success"
          style={styles.actionButton}
        />
      );
    }

    return actions.length > 0 ? (
      <View style={styles.actions}>{actions}</View>
    ) : null;
  };

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Order Details" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      {renderOrderInfo()}
      {renderLocationInfo()}
      {renderOrderItems()}
      {renderActions()}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  contentContainer: {
    paddingBottom: SIZES.padding * 2,
  },
  orderInfo: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  locationInfo: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  orderItems: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  infoLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.dark,
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.font - 1,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: COLORS.light,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  locationIcon: {
    fontSize: SIZES.font + 4,
    marginRight: SIZES.base / 2,
  },
  locationTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
  },
  locationAddress: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  routeArrow: {
    alignItems: 'center',
    marginVertical: SIZES.base,
  },
  arrowText: {
    fontSize: SIZES.h2,
    color: COLORS.primary,
  },
  mapButton: {
    marginTop: SIZES.base,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base / 2,
  },
  itemDetails: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
  },
  itemTotal: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SIZES.base,
    marginTop: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  totalLabel: {
    fontSize: SIZES.font + 1,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: SIZES.font + 1,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  deliveryLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  deliveryValue: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.success,
  },
  actions: {
    padding: SIZES.padding,
  },
  actionButton: {
    marginBottom: SIZES.base,
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

export default OrderDetailScreen;
