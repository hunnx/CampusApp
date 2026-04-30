import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES, ORDER_STATUS, CONTENT_BOTTOM_PADDING } from '../../constants';

// Safe parsing utility functions for OrderTrackingScreen
const safeParseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const safeParseString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const safeParseDate = (value, fallback = null) => {
  if (!value) return fallback;
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? fallback : date;
  } catch {
    return fallback;
  }
};

const safeGetOrderId = (order) => {
  const id = safeParseString(order?.id, '');
  return id ? '#' + id.slice(-6) : '#N/A';
};

const safeGetItems = (items) => {
  return Array.isArray(items) ? items : [];
};

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orders } = useSelector(state => state.orders);
  const insets = useSafeAreaInsets();
  
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  
  // Calculate bottom padding to ensure content doesn't hide behind tab bar
  const bottomPadding = CONTENT_BOTTOM_PADDING + insets.bottom + 20;

  const loadOrderDetails = useCallback(() => {
    console.log('[OrderTrackingScreen] Loading order details for orderId:', orderId);
    console.log('[OrderTrackingScreen] Available orders:', orders?.length);
    
    try {
      const foundOrder = orders.find(o => String(o.id) === String(orderId));
      
      if (!foundOrder) {
        console.log('[OrderTrackingScreen] Order not found');
        setError('Order not found');
        setOrder(null);
        return;
      }
      
      console.log('[OrderTrackingScreen] Found order:', JSON.stringify(foundOrder, null, 2));
      setOrder(foundOrder);
      setError(null);
    } catch (err) {
      console.error('[OrderTrackingScreen] Error loading order:', err);
      setError(err?.message || 'Failed to load order');
      setOrder(null);
    }
  }, [orderId, orders]);

  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

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

    // Use safe parsing to prevent type casting errors
    const orderIdDisplay = safeGetOrderId(order);
    const shopkeeperName = safeParseString(order.shopkeeperName, 'N/A');
    const pickupLocation = safeParseString(order.pickupLocation, 'N/A');
    const dropLocation = safeParseString(order.dropLocation, 'N/A');
    const contactNumber = safeParseString(order.contactNumber, 'N/A');
    const createdAt = safeParseDate(order.createdAt);
    const createdAtString = createdAt ? createdAt.toLocaleString() : 'N/A';
    
    console.log('[OrderTrackingScreen] Rendering order info:', {
      orderIdDisplay,
      shopkeeperName,
      createdAtString,
    });

    return (
      <View style={styles.orderInfo}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order ID:</Text>
          <Text style={styles.infoValue}>{orderIdDisplay}</Text>
        </View>
        
        {shopkeeperName ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shop:</Text>
            <Text style={styles.infoValue}>{shopkeeperName}</Text>
          </View>
        ) : null}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pickup Location:</Text>
          <Text style={styles.infoValue}>{pickupLocation}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delivery Location:</Text>
          <Text style={styles.infoValue}>{dropLocation}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contact:</Text>
          <Text style={styles.infoValue}>{contactNumber}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order Time:</Text>
          <Text style={styles.infoValue}>
            {createdAtString}
          </Text>
        </View>
      </View>
    );
  };

const renderOrderItems = () => {
    if (!order || !order.items) return null;

    // Use safe parsing to prevent type casting errors
    const items = safeGetItems(order.items);
    const totalAmount = safeParseNumber(order.totalAmount, 0);
    
    console.log('[OrderTrackingScreen] Rendering items:', {
      itemsCount: items.length,
      totalAmount,
    });

    return (
      <View style={styles.orderItems}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {items.map((item, index) => {
          // Safe parsing for each item
          const itemName = safeParseString(item.name, 'Unknown Item');
          const itemPrice = safeParseNumber(item.price, 0);
          const itemQuantity = safeParseNumber(item.quantity, 0);
          const itemTotal = itemPrice * itemQuantity;
          
          console.log(`[OrderTrackingScreen] Item ${index}:`, {
            name: itemName,
            price: itemPrice,
            quantity: itemQuantity,
            total: itemTotal,
          });
          
          return (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{itemName}</Text>
                <Text style={styles.itemDetails}>
                  {itemQuantity}x PKR {itemPrice}
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                PKR {itemTotal}
              </Text>
            </View>
          );
        })}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>PKR {totalAmount}</Text>
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

if (!order || error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{error || 'Order not found'}</Text>
        <Text style={styles.errorText}>Order ID: {safeParseString(orderId, 'N/A')}</Text>
        <Text style={styles.errorText}>Available orders: {safeParseNumber(orders?.length, 0)}</Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.goBack()} 
          style={{ marginTop: SIZES.padding }}
        />
      </SafeAreaView>
    );
  }

return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Order Tracking" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomPadding }]}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order?.status) }]}>
          <Text style={styles.statusText}>{safeParseString(order?.status, 'unknown').toUpperCase()}</Text>
        </View>

        {renderTimeline()}
        {renderOrderInfo()}
        {renderOrderItems()}
{renderActions()}
      </ScrollView>
    </SafeAreaView>
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
  errorText: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    marginTop: SIZES.base,
  },
});

export default OrderTrackingScreen;
