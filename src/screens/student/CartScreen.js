import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice';
import Header from '../../components/common/Header';
import { COLORS, SIZES, DELIVERY_CHARGE } from '../../constants';
import Button from '../../components/buttons/Button';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: cartItems, totalItems, totalAmount } = useSelector(state => state.cart);

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCharge = cartItems.length > 0 ? DELIVERY_CHARGE : 0;
  const finalTotal = subtotal + deliveryCharge;

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      dispatch(updateQuantity({ productId: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            dispatch(removeFromCart(itemId));
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            dispatch(clearCart());
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to cart before checkout');
      return;
    }

    navigation.navigate('Checkout', {
      items: cartItems,
      totalAmount: finalTotal,
    });
  };

  const renderCartItem = ({ item }) => {
    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemShop}>{item.shopkeeperName}</Text>
          <Text style={styles.itemPrice}>PKR {item.price}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <Text style={[
              styles.quantityButtonText,
              item.quantity <= 1 && styles.quantityButtonTextDisabled
            ]}>
              -
            </Text>
          </TouchableOpacity>

          <View style={styles.quantityValue}>
            <Text style={styles.quantityNumber}>{item.quantity}</Text>
          </View>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, 1)}
            disabled={item.quantity >= 10}
          >
            <Text style={[
              styles.quantityButtonText,
              item.quantity >= 10 && styles.quantityButtonTextDisabled
            ]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyCart = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add some delicious items to get started!
        </Text>
        <Button
          title="Start Shopping"
          onPress={() => navigation.navigate('Home')}
          style={styles.shopButton}
        />
      </View>
    );
  };

  const renderCartSummary = () => {
    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
          <Text style={styles.summaryValue}>PKR {subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Charge</Text>
          <Text style={styles.summaryValue}>PKR {deliveryCharge}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>PKR {finalTotal}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Shopping Cart"
        rightComponent={
          cartItems.length > 0 ? (
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {renderCartSummary()}

          <View style={styles.checkoutContainer}>
            <Button
              title={`Checkout (PKR ${finalTotal})`}
              onPress={handleCheckout}
              style={styles.checkoutButton}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  cartList: {
    padding: SIZES.padding,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
    marginRight: SIZES.padding,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 2,
  },
  itemShop: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: SIZES.font,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  quantityButtonTextDisabled: {
    color: COLORS.gray,
  },
  quantityValue: {
    minWidth: 40,
    alignItems: 'center',
  },
  quantityNumber: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
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
    color: COLORS.dark,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    paddingTop: SIZES.base,
    marginTop: SIZES.base,
  },
  totalLabel: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  checkoutButton: {
    marginBottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SIZES.padding,
  },
  emptyTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  emptySubtitle: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  shopButton: {
    marginBottom: 0,
  },
  clearButton: {
    fontSize: SIZES.font,
    color: COLORS.danger,
    fontWeight: '600',
  },
});

export default CartScreen;
