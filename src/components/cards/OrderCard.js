import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES, ORDER_STATUS, BORDER_RADIUS, SHADOWS } from '../../constants';

const OrderCard = ({
  order,
  onPress,
  showActions = false,
  onStatusChange,
  onAccept,
  style,
}) => {
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

  const getStatusBgColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return COLORS.warningLight;
      case ORDER_STATUS.PREPARING:
        return COLORS.primaryMuted;
      case ORDER_STATUS.READY:
        return COLORS.successLight;
      case ORDER_STATUS.PICKED:
        return COLORS.secondaryLight || 'rgba(147, 197, 253, 0.3)';
      case ORDER_STATUS.DELIVERED:
        return COLORS.successLight;
      case ORDER_STATUS.COMPLETED:
        return COLORS.successLight;
      default:
        return COLORS.light;
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderOrderItems = () => {
    if (!order || !order.items || !Array.isArray(order.items)) return null;
    
    return order.items.map((item, index) => (
      <View key={index} style={styles.itemRow}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name || 'Unknown item'}
        </Text>
        <Text style={styles.itemDetails}>
          {item.quantity || 0}x PKR {item.price || 0}
        </Text>
      </View>
    ));
  };

  const renderActions = () => {
    if (!showActions || !order || !order.status) return null;

    const actions = [];

    // Shopkeeper actions
    if (order.status === ORDER_STATUS.PENDING) {
      actions.push(
        <TouchableOpacity
          key="preparing"
          style={[styles.actionButton, styles.preparingButton]}
          onPress={() => onStatusChange && onStatusChange(order.id, ORDER_STATUS.PREPARING)}
        >
          <Text style={styles.actionButtonText}>Start Preparing</Text>
        </TouchableOpacity>
      );
    }

    if (order.status === ORDER_STATUS.PREPARING) {
      actions.push(
        <TouchableOpacity
          key="ready"
          style={[styles.actionButton, styles.readyButton]}
          onPress={() => onStatusChange && onStatusChange(order.id, ORDER_STATUS.READY)}
        >
          <Text style={styles.actionButtonText}>Mark Ready</Text>
        </TouchableOpacity>
      );
    }

    // Deliverer actions
    if (order.status === ORDER_STATUS.READY && onAccept) {
      actions.push(
        <TouchableOpacity
          key="accept"
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => onAccept(order.id)}
        >
          <Text style={styles.actionButtonText}>Accept Delivery</Text>
        </TouchableOpacity>
      );
    }

    return actions.length > 0 ? (
      <View style={styles.actionsContainer}>{actions}</View>
    ) : null;
  };

  if (!order) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress && onPress(order)}
      activeOpacity={0.85}
    >
      {/* Header: Order ID + Status */}
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id ? String(order.id).slice(-6) : 'N/A'}</Text>
          <Text style={styles.orderTime}>
            {formatDate(order.createdAt)}
          </Text>
        </View>
        <View style={[
          styles.statusContainer, 
          { backgroundColor: getStatusBgColor(order.status) }
        ]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      {/* Items List */}
      <View style={styles.content}>
        {renderOrderItems()}
        
        <View style={styles.divider} />
        
        {/* Footer: Location + Price */}
        <View style={styles.footer}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>📍 Delivery</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {order.dropLocation || 'Location not set'}
            </Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.totalAmountLabel}>Total</Text>
            <Text style={styles.totalAmount}>PKR {order.totalAmount || 0}</Text>
            {order.deliveryCharge > 0 && (
              <Text style={styles.deliveryCharge}>+ PKR {order.deliveryCharge} delivery</Text>
            )}
          </View>
        </View>
      </View>

      {renderActions()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: 20,
    ...SHADOWS.lg,
    shadowOpacity: 0.08,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: SIZES.font + 2,
    fontWeight: '700',
    color: COLORS.dark,
    letterSpacing: 0.3,
  },
  orderTime: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: SIZES.font - 2,
    fontWeight: '600',
  },

  // Content Styles
  content: {
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemName: {
    fontSize: SIZES.font,
    color: COLORS.darkSecondary,
    flex: 1,
    fontWeight: '500',
  },
  itemDetails: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light,
    marginVertical: 12,
  },

  // Footer Styles
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  locationInfo: {
    flex: 1,
    marginRight: 16,
  },
  locationLabel: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    marginBottom: 2,
  },
  locationText: {
    fontSize: SIZES.font,
    color: COLORS.darkSecondary,
    fontWeight: '500',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  totalAmountLabel: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.dark,
  },
  deliveryCharge: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    marginTop: 2,
  },

  // Actions
  actionsContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
  },
  preparingButton: {
    backgroundColor: COLORS.primary,
  },
  readyButton: {
    backgroundColor: COLORS.success,
  },
  acceptButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.font,
  },
});

export default OrderCard;
