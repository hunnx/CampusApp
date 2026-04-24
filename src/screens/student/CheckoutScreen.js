import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../redux/slices/orderSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES, DELIVERY_CHARGE } from '../../constants';

const CheckoutScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  const { items } = route.params || { items: [] };

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState(user?.phoneNumber || user?.phone || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [errors, setErrors] = useState({});

  const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  const deliveryCharge = items.length > 0 ? DELIVERY_CHARGE : 0;
  const finalTotal = subtotal + deliveryCharge;

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryAddress) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10,15}$/.test(contactNumber.replace(/\s/g, ''))) {
      newErrors.contactNumber = 'Contact number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (!user || !user.id) {
      Alert.alert('Error', 'You must be logged in to place an order.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }

    try {
      const orderData = {
        studentId: user.id,
        studentName: user.name,
        pickupPoint: 'Shop', // Default pickup point for delivery orders
        paymentMethod: 'Cash', // Default payment method
        orderPickupType: 'Delivery', // Default order pickup type
        items: items.map(item => ({
          productCategoryItemId: item.productCategoryItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          shopkeeperId: item.shopkeeperId,
        })),
        totalAmount: subtotal,
        deliveryCharge,
        destination: deliveryAddress,
        contactNumber,
        orderNotes,
      };

      console.log('CheckoutScreen - Creating order with data:', JSON.stringify(orderData, null, 2));
      console.log('CheckoutScreen - Items with shopkeeperId:', items.map(i => ({ id: i.productCategoryItemId, shopkeeperId: i.shopkeeperId })));

      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());

      Alert.alert(
        'Order Placed Successfully!',
        'Your order has been placed and will be prepared soon.',
        [
          {
            text: 'View Orders',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Orders' }],
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Order creation failed:', error);
      Alert.alert('Error', error || 'Failed to place order. Please try again.');
    }
  };

  const renderOrderItems = () => (
    items.map(item => (
      <View key={item.productCategoryItemId} style={styles.orderItem}>
        {(item.imageUrl || item.image) ? (
          <Image
            source={{ uri: item.imageUrl || item.image }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.itemImagePlaceholder} />
        )}

        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            {item.quantity}x PKR {item.price} = PKR {(item.totalPrice || (item.price * item.quantity))}
          </Text>
        </View>
      </View>
    ))
  );

  const renderPaymentMethod = () => (
    <View style={styles.paymentMethod}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentOption}>
        <View style={[styles.paymentRadio, styles.paymentRadioSelected]} />
        <Text style={styles.paymentText}>Cash on Delivery</Text>
      </View>
      <Text style={styles.paymentNote}>
        Pay PKR {finalTotal} when your order is delivered
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Checkout" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {renderOrderItems()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>

          <Input
            label="Delivery Address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            placeholder="Enter your delivery address"
            multiline
            numberOfLines={3}
            error={errors.deliveryAddress}
          />

          <Input
            label="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="Enter your contact number"
            keyboardType="phone-pad"
            error={errors.contactNumber}
          />

          <Input
            label="Order Notes (Optional)"
            value={orderNotes}
            onChangeText={setOrderNotes}
            placeholder="Any special instructions for your order?"
            multiline
            numberOfLines={3}
          />
        </View>

        {renderPaymentMethod()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>PKR {subtotal}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>PKR {deliveryCharge}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>PKR {finalTotal}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title={`Place Order (PKR ${finalTotal})`}
            onPress={handlePlaceOrder}
            loading={isLoading}
            style={styles.placeOrderButton}
          />

          <Button
            title="Back to Cart"
            onPress={() => navigation.goBack()}
            type="outline"
            style={styles.backButton}
          />
        </View>
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
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base,
  },
  itemImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base,
    backgroundColor: COLORS.light,
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
  paymentMethod: {
    marginBottom: SIZES.base,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.light,
    marginRight: SIZES.base,
  },
  paymentRadioSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  paymentText: {
    fontSize: SIZES.font,
    color: COLORS.dark,
    fontWeight: '500',
  },
  paymentNote: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    paddingTop: SIZES.base,
    marginTop: SIZES.base / 2,
  },
  summaryLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
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
    marginTop: SIZES.padding,
  },
  placeOrderButton: {
    marginBottom: SIZES.base,
  },
  backButton: {
    marginTop: SIZES.base,
  },
});

export default CheckoutScreen;
