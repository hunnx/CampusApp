import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES, ORDER_STATUS } from '../../constants';

// Mock MapView component - in real app, would use react-native-maps
const MapView = ({ children }) => (
  <View style={styles.mapContainer}>
    <View style={styles.mockMap}>
      <Text style={styles.mapText}>🗺️ Map View</Text>
      <Text style={styles.mapSubtext}>Delivery route would be displayed here</Text>
      {children}
    </View>
  </View>
);

const DeliveryMapScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    loadOrderDetails();
    getCurrentLocation();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      await dispatch(fetchOrders({ 
        userId: user?.id, 
        userRole: user?.role 
      })).unwrap();
      
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder);
    } catch (error) {
      console.error('Failed to load order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    // Mock location - in real app, would use geolocation service
    setCurrentLocation({
      latitude: 24.8607,
      longitude: 67.0011,
    });
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

  const handleCallCustomer = () => {
    if (order?.contactNumber) {
      Alert.alert(
        'Call Customer',
        `Call ${order.contactNumber}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Call',
            onPress: () => {
              // In real app, would use Linking to make phone call
              console.log('Calling:', order.contactNumber);
            },
          },
        ]
      );
    }
  };

  const renderMapInfo = () => {
    if (!order) return null;

    return (
      <View style={styles.mapInfo}>
        <View style={styles.locationMarker}>
          <Text style={styles.markerIcon}>📍</Text>
          <View style={styles.markerInfo}>
            <Text style={styles.markerTitle}>Pickup Location</Text>
            <Text style={styles.markerAddress}>{order.pickupLocation}</Text>
          </View>
        </View>
        
        <View style={styles.routeLine} />
        
        <View style={styles.locationMarker}>
          <Text style={styles.markerIcon}>🏠</Text>
          <View style={styles.markerInfo}>
            <Text style={styles.markerTitle}>Drop Location</Text>
            <Text style={styles.markerAddress}>{order.dropLocation}</Text>
          </View>
        </View>
        
        {currentLocation && (
          <View style={styles.currentLocation}>
            <Text style={styles.currentIcon}>🚚</Text>
            <Text style={styles.currentText}>Your Current Location</Text>
          </View>
        )}
      </View>
    );
  };

  const renderOrderSummary = () => {
    if (!order) return null;

    return (
      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Order ID:</Text>
          <Text style={styles.summaryValue}>#{order.id.slice(-6)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Customer:</Text>
          <Text style={styles.summaryValue}>{order.studentName}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items:</Text>
          <Text style={styles.summaryValue}>{order.items.length} items</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total:</Text>
          <Text style={styles.summaryValue}>PKR {order.totalAmount}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee:</Text>
          <Text style={styles.summaryValue}>PKR {order.deliveryCharge}</Text>
        </View>
      </View>
    );
  };

  const renderActions = () => {
    if (!order) return null;

    const actions = [];

    // Call customer action
    actions.push(
      <Button
        key="call"
        title={`Call Customer: ${order.contactNumber}`}
        onPress={handleCallCustomer}
        type="outline"
        style={styles.actionButton}
      />
    );

    if (order.status === ORDER_STATUS.READY) {
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
          style={styles.actionButton}
        />
      );
    }

    return <View style={styles.actions}>{actions}</View>;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView>
        {renderMapInfo()}
      </MapView>
      
      <ScrollView style={styles.detailsContainer}>
        {renderOrderSummary()}
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
  mapContainer: {
    flex: 1,
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapText: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  mapSubtext: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  mapInfo: {
    position: 'absolute',
    top: SIZES.padding,
    left: SIZES.padding,
    right: SIZES.padding,
  },
  locationMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
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
  markerIcon: {
    fontSize: SIZES.font + 4,
    marginRight: SIZES.base,
  },
  markerInfo: {
    flex: 1,
  },
  markerTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base / 2,
  },
  markerAddress: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
  },
  routeLine: {
    height: 2,
    backgroundColor: COLORS.primary,
    marginVertical: SIZES.base / 2,
    marginLeft: SIZES.base + 10,
  },
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentIcon: {
    fontSize: SIZES.font + 4,
    marginRight: SIZES.base,
  },
  currentText: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.primary,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    maxHeight: '40%',
  },
  orderSummary: {
    marginBottom: SIZES.padding,
  },
  summaryTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  summaryLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.dark,
  },
  actions: {
    marginTop: SIZES.padding,
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
    marginTop: SIZES.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: SIZES.font,
    color: COLORS.danger,
  },
});

export default DeliveryMapScreen;
