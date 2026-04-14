import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/slices/orderSlice';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

const OrderTrackingScreen = ({ route, navigation }) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return COLORS.warning;
      case ORDER_STATUS.PREPARING:
        return COLORS.primary;
      case ORDER_STATUS.READY:
        return COLORS.success;
      case ORDER_STATUS.PICKED:
        return COLORS.secondary;
      case ORDER_STATUS.DELIVERED:
        return COLORS.success;
      case ORDER_STATUS.COMPLETED:
        return COLORS.success;
      default:
        return COLORS.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return '⏳';
      case ORDER_STATUS.PREPARING:
        return '👨‍🍳';
      case ORDER_STATUS.READY:
        return '✅';
      case ORDER_STATUS.PICKED:
        return '🚚';
      case ORDER_STATUS.DELIVERED:
        return '📍';
      case ORDER_STATUS.COMPLETED:
        return '🎉';
      default:
        return '📦';
    }
  };

  const renderTimeline = () => {
    const timelineSteps = [
      { key: ORDER_STATUS.PENDING, label: 'Order Placed', description: 'Your order has been received' },
      { key: ORDER_STATUS.PREPARING, label: 'Preparing', description: 'Shopkeeper is preparing your order' },
      { key: ORDER_STATUS.READY, label: 'Ready for Pickup', description: 'Order is ready and waiting for delivery' },
      { key: ORDER_STATUS.PICKED, label: 'Out for Delivery', description: 'Delivery person has picked up your order' },
      { key: ORDER_STATUS.DELIVERED, label: 'Delivered', description: 'Order has been delivered' },
      { key: ORDER_STATUS.COMPLETED, label: 'Completed', description: 'Order completed successfully' },
    ];

    const currentStepIndex = timelineSteps.findIndex(step => step.key === order?.status);

    return (
      <View style={styles.timeline}>
        <Text style={styles.timelineTitle}>Order Status</Text>
        {timelineSteps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <View key={step.key} style={styles.timelineStep}>
              <View style={styles.timelineMarker}>
                <View style={[
                  styles.timelineDot,
                  isActive && styles.timelineDotActive,
                  isCurrent && styles.timelineDotCurrent,
                ]}>
                  <Text style={[
                    styles.timelineDotText,
                    isActive && styles.timelineDotTextActive,
                  ]}>
                    {getStatusIcon(step.key)}
                  </Text>
                </View>
                {index < timelineSteps.length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    isActive && styles.timelineLineActive,
                  ]} />
                )}
              </View>
              
              <View style={styles.timelineContent}>
                <Text style={[
                  styles.timelineStepTitle,
                  isActive && styles.timelineStepTitleActive,
                ]}>
                  {step.label}
                </Text>
                <Text style={[
                  styles.timelineStepDescription,
                  isActive && styles.timelineStepDescriptionActive,
                ]}>
                  {step.description}
                </Text>
                {isCurrent && (
                  <Text style={styles.currentStatus}>
                    Current Status
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderOrderInfo = () => {
    if (!order) return null;

    return (
      <View style={styles.orderInfo}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order ID:</Text>
          <Text style={styles.infoValue}>#{order.id.slice(-6)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shop:</Text>
          <Text style={styles.infoValue}>{order.shopkeeperName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pickup Location:</Text>
          <Text style={styles.infoValue}>{order.pickupLocation}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delivery Location:</Text>
          <Text style={styles.infoValue}>{order.dropLocation}</Text>
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
      </View>
    );
  };

  const renderActions = () => {
    if (!order) return null;

    const actions = [];

    if (order.status === ORDER_STATUS.DELIVERED) {
      actions.push(
        <Button
          key="confirm"
          title="Confirm Receipt"
          onPress={() => {
            Alert.alert(
              'Order Received',
              'Thank you for your order!',
              [{ text: 'OK' }]
            );
          }}
          style={styles.actionButton}
        />
      );
    }

    if (order.status === ORDER_STATUS.COMPLETED) {
      actions.push(
        <Button
          key="reorder"
          title="Order Again"
          onPress={() => navigation.navigate('StudentHome')}
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Tracking</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>
      </View>

      {renderTimeline()}
      {renderOrderInfo()}
      {renderOrderItems()}
      {renderActions()}
    </ScrollView>
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
  header: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
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
  timeline: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  timelineTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: SIZES.padding * 1.5,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    backgroundColor: COLORS.primary,
  },
  timelineDotCurrent: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  timelineDotText: {
    fontSize: SIZES.font,
  },
  timelineDotTextActive: {
    color: COLORS.white,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.light,
    marginTop: SIZES.base,
  },
  timelineLineActive: {
    backgroundColor: COLORS.primary,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStepTitle: {
    fontSize: SIZES.font + 1,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  timelineStepTitleActive: {
    color: COLORS.dark,
  },
  timelineStepDescription: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  timelineStepDescriptionActive: {
    color: COLORS.dark,
  },
  currentStatus: {
    fontSize: SIZES.font - 2,
    color: COLORS.primary,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  orderInfo: {
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

export default OrderTrackingScreen;
