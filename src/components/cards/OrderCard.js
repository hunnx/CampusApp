import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

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

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderOrderItems = () => {
    return order.items.map((item, index) => (
      <View key={index} style={styles.itemRow}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemDetails}>
          {item.quantity}x PKR {item.price}
        </Text>
      </View>
    ));
  };

  const renderActions = () => {
    if (!showActions) return null;

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

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress && onPress(order)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
          <Text style={styles.orderTime}>
            {new Date(order.createdAt).toLocaleTimeString()}
          </Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {renderOrderItems()}
        
        <View style={styles.divider} />
        
        <View style={styles.footer}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationText} numberOfLines={1}>
              📍 {order.pickupLocation} → {order.dropLocation}
            </Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.totalAmount}>PKR {order.totalAmount}</Text>
            <Text style={styles.deliveryCharge}>+ PKR {order.deliveryCharge} delivery</Text>
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
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  orderTime: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    marginTop: 2,
  },
  statusContainer: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.font - 2,
    fontWeight: '600',
  },
  content: {
    marginBottom: SIZES.base,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  itemName: {
    fontSize: SIZES.font,
    color: COLORS.dark,
    flex: 1,
  },
  itemDetails: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light,
    marginVertical: SIZES.base,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  locationInfo: {
    flex: 1,
    marginRight: SIZES.base,
  },
  locationText: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  deliveryCharge: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
  },
  actionsContainer: {
    marginTop: SIZES.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: SIZES.base / 2,
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
    fontSize: SIZES.font - 1,
  },
});

export default OrderCard;
