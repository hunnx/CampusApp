import React, { useState } from 'react';
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
import Header from '../../components/common/Header';
import { COLORS, SIZES, DELIVERY_CHARGE } from '../../constants';
import Button from '../../components/buttons/Button';

// Mock cart data - in real app, this would come from Redux state
const mockCartItems = [
  {
    id: '1',
    name: 'Fresh Juice',
    price: 150,
    quantity: 2,
    totalPrice: 300,
    image: 'https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=Juice',
    shopkeeperName: 'Campus Cafe',
  },
  {
    id: '2',
    name: 'Notebook',
    price: 80,
    quantity: 1,
    totalPrice: 80,
    image: 'https://via.placeholder.com/80x80/004E89/FFFFFF?text=Notebook',
    shopkeeperName: 'Campus Store',
  },
];

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCharge = cartItems.length > 0 ? DELIVERY_CHARGE : 0;
  const totalAmount = subtotal + deliveryCharge;

  const handleQuantityChange = (itemId, change) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          if (newQuantity >= 1 && newQuantity <= 10) {
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: item.price * newQuantity,
            };
          }
        }
        return item;
      })
    );
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
            setCartItems(prev => prev.filter(item => item.id !== itemId));
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
      totalAmount,
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
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.shopName}>{item.shopkeeperName}</Text>
          <Text style={styles.itemPrice}>PKR {item.price} each</Text>
          
          <View style={styles.quantityControls}>
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
            
            <Text style={styles.quantity}>{item.quantity}</Text>
            
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
        </View>
        
        <View style={styles.itemActions}>
          <Text style={styles.itemTotal}>PKR {item.totalPrice}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Text style={styles.removeButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyCart = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Add some delicious items to get started!</Text>
        <Button
          title="Browse Products"
          onPress={() => navigation.navigate('Home')}
          style={styles.browseButton}
        />
      </View>
    );
  };

  const renderOrderSummary = () => {
    if (cartItems.length === 0) return null;

    return (
      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text>
          <Text style={styles.summaryValue}>PKR {subtotal}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>PKR {deliveryCharge}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>PKR {totalAmount}</Text>
        </View>
        
        <Button
          title={`Checkout • PKR ${totalAmount}`}
          onPress={handleCheckout}
          style={styles.checkoutButton}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Shopping Cart" onBackPress={() => navigation.goBack()} rightComponent={<Text style={styles.itemCount}>{cartItems.length} items</Text>} />

      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.cartItems}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyCart()
      )}

      {renderOrderSummary()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  itemCount: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  cartItems: {
    padding: SIZES.base,
  },
  cartItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius / 2,
    marginRight: SIZES.padding,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.font + 1,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base / 4,
  },
  shopName: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
    marginBottom: SIZES.base / 4,
  },
  itemPrice: {
    fontSize: SIZES.font - 1,
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: SIZES.font + 2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  quantityButtonTextDisabled: {
    color: COLORS.gray,
  },
  quantity: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginHorizontal: SIZES.padding,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: SIZES.font + 1,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: SIZES.font,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
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
  browseButton: {
    paddingHorizontal: SIZES.padding * 2,
  },
  orderSummary: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
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
  checkoutButton: {
    marginTop: SIZES.padding,
  },
});

export default CartScreen;
