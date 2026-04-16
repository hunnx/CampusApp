import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../redux/slices/orderSlice';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES, DELIVERY_CHARGE } from '../../constants';

const CheckoutScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  
  const { items, totalAmount } = route.params || { items: [], totalAmount: 0 };
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [errors, setErrors] = useState({});

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

    try {
      const orderData = {
        studentId: user.id,
        studentName: user.name,
        shopkeeperId: items[0]?.shopkeeperId || '1', // Use actual shopkeeperId from product, default to '1'
        shopkeeperName: items[0]?.shopkeeperName || 'Campus Shop',
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalAmount - DELIVERY_CHARGE, // Remove delivery charge from items total
        deliveryCharge: DELIVERY_CHARGE,
        pickupLocation: items[0]?.shopkeeperName || 'Campus Shop',
        dropLocation: deliveryAddress,
        contactNumber,
        orderNotes,
      };

      console.log('Creating order with shopkeeperId:', orderData.shopkeeperId, 'for user:', user.id);
      
      const newOrder = await dispatch(createOrder(orderData));
      
      console.log('Order created successfully:', newOrder);
      
      // Show success message
      Alert.alert(
        'Order Placed Successfully!',
        'Your order has been placed and will be prepared soon.',
        [
          {
            text: 'View Orders',
            onPress: () => navigation.navigate('Orders')
          }
        ]
      );
    } catch (error) {
      console.error('Order creation failed:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const renderOrderItems = () => {
    return items.map((item, index) => (
      <View key={item.id} style={styles.orderItem}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            {item.quantity}x PKR {item.price} = PKR {item.totalPrice}
          </Text>
        </View>
      </View>
    ));
  };

  const renderPaymentMethod = () => {
    return (
      <View style={styles.paymentMethod}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentOption}>
          <View style={[styles.paymentRadio, styles.paymentRadioSelected]} />
          <Text style={styles.paymentText}>Cash on Delivery</Text>
        </View>
        <Text style={styles.paymentNote}>
          Pay PKR {totalAmount} when your order is delivered
        </Text>
      </View>
    );
  };

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
          <Text style={styles.summaryValue}>PKR {totalAmount - DELIVERY_CHARGE}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>PKR {DELIVERY_CHARGE}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>PKR {totalAmount}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Place Order • PKR {totalAmount}"
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
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
    textAlign: 'center',
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
