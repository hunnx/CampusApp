import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS, DELIVERY_CHARGE, CONTENT_BOTTOM_PADDING } from '../../constants';
import ModernCard from '../../components/common/ModernCard';
import ModernButton from '../../components/common/ModernButton';
import EmptyState from '../../components/common/EmptyState';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { items: cartItems, totalItems } = useSelector(state => state.cart);
  const insets = useSafeAreaInsets();

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCharge = cartItems.length > 0 ? DELIVERY_CHARGE : 0;
  const finalTotal = subtotal + deliveryCharge;

  // Calculate the bottom padding needed to prevent the summary card from being hidden
  // behind the tab bar. Tab bar is at bottom: 16 with height: 72, so total ~88px
  const bottomPadding = CONTENT_BOTTOM_PADDING + insets.bottom + 48;

  const handleQuantityChange = (productCategoryItemId, change) => {
    const item = cartItems.find(c => String(c.productCategoryItemId) === String(productCategoryItemId));
    if (!item) return;
    const newQty = item.quantity + change;
    if (newQty >= 1 && newQty <= 10) dispatch(updateQuantity({ productCategoryItemId, quantity: newQty }));
  };

  const handleRemove = (id) => {
    Alert.alert('Remove Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => dispatch(removeFromCart(id)) },
    ]);
  };

  const handleClear = () => {
    Alert.alert('Clear Cart', 'Remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => dispatch(clearCart()) },
    ]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) { Alert.alert('Cart Empty', 'Please add items first'); return; }
    navigation.navigate('Checkout', { items: cartItems });
  };

  const renderItem = ({ item }) => React.createElement(ModernCard, {
    variant: 'elevated',
    borderRadius: BORDER_RADIUS.xl,
    padding: 16,
    style: { marginHorizontal: 16, marginBottom: 12 },
  },
    React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
      React.createElement(View, { style: [styles.itemImage, { backgroundColor: colors.light }] },
        React.createElement(Icon, { name: 'cube-outline', size: 28, color: colors.primary })
      ),
      React.createElement(View, { style: { flex: 1, marginLeft: 14 } },
        React.createElement(Text, { style: [styles.itemName, { color: colors.dark }] }, item.name),
        React.createElement(Text, { style: [styles.itemPrice, { color: colors.primary }] }, 'PKR ' + item.price)
      ),
      React.createElement(View, { style: styles.qtyContainer },
        React.createElement(TouchableOpacity, {
          style: [styles.qtyBtn, { backgroundColor: colors.light }],
          onPress: () => handleQuantityChange(item.productCategoryItemId, -1),
        }, React.createElement(Icon, { name: 'remove', size: 16, color: colors.dark })),
        React.createElement(Text, { style: [styles.qtyText, { color: colors.dark }] }, String(item.quantity)),
        React.createElement(TouchableOpacity, {
          style: [styles.qtyBtn, { backgroundColor: colors.light }],
          onPress: () => handleQuantityChange(item.productCategoryItemId, 1),
        }, React.createElement(Icon, { name: 'add', size: 16, color: colors.dark }))
      ),
      React.createElement(TouchableOpacity, {
        style: [styles.removeBtn, { backgroundColor: colors.dangerLight }],
        onPress: () => handleRemove(item.productCategoryItemId),
      }, React.createElement(Icon, { name: 'trash-outline', size: 16, color: colors.danger }))
    )
  );

if (cartItems.length === 0) {
    return React.createElement(SafeAreaView, { style: [styles.container, { backgroundColor: colors.background }], edges: ['top'] },
      React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
        React.createElement(Text, { style: styles.headerTitle }, 'Shopping Cart')
      ),
      React.createElement(EmptyState, {
        icon: 'cart-outline',
        title: 'Your cart is empty',
        subtitle: 'Add some items to get started',
        actionTitle: 'Start Shopping',
        onAction: () => navigation.navigate('Home'),
      })
    );
  }

  return React.createElement(SafeAreaView, { style: [styles.container, { backgroundColor: colors.background }], edges: ['top'] },
    React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
      React.createElement(View, { style: styles.headerTop },
        React.createElement(Text, { style: styles.headerTitle }, 'Shopping Cart'),
        React.createElement(TouchableOpacity, { onPress: handleClear },
          React.createElement(Text, { style: { color: 'rgba(255,255,255,0.9)', fontSize: 14 } }, 'Clear')
        )
      ),
      React.createElement(Text, { style: styles.headerSubtitle }, totalItems + ' items in your cart')
    ),

    React.createElement(FlatList, {
      data: cartItems,
      renderItem: renderItem,
      keyExtractor: (item) => item.productCategoryItemId.toString(),
      contentContainerStyle: { paddingTop: 16, paddingBottom: bottomPadding },
      showsVerticalScrollIndicator: false,
    }),

    React.createElement(View, { style: [styles.summaryCard, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 20 }] },
      React.createElement(View, { style: styles.summaryRow },
        React.createElement(Text, { style: [styles.summaryLabel, { color: colors.gray }] }, 'Subtotal (' + totalItems + ' items)'),
        React.createElement(Text, { style: [styles.summaryValue, { color: colors.dark }] }, 'PKR ' + subtotal)
      ),
      React.createElement(View, { style: styles.summaryRow },
        React.createElement(Text, { style: [styles.summaryLabel, { color: colors.gray }] }, 'Delivery'),
        React.createElement(Text, { style: [styles.summaryValue, { color: colors.dark }] }, 'PKR ' + deliveryCharge)
      ),
      React.createElement(View, { style: [styles.summaryRow, styles.totalRow, { borderTopColor: colors.light }] },
        React.createElement(Text, { style: [styles.totalLabel, { color: colors.dark }] }, 'Total'),
        React.createElement(Text, { style: [styles.totalValue, { color: colors.primary }] }, 'PKR ' + finalTotal)
      ),
      React.createElement(ModernButton, {
        title: 'Checkout - PKR ' + finalTotal,
        onPress: handleCheckout,
        fullWidth: true,
        size: 'lg',
        style: { marginTop: 16 },
      })
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerTitle: { fontSize: FONTS.h1.size, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: FONTS.bodySmall.size, color: 'rgba(255,255,255,0.8)' },
  itemImage: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  itemName: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  itemPrice: { fontSize: 14, fontWeight: '700' },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  qtyBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 4 },
  qtyText: { fontSize: 15, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  removeBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  summaryCard: { position: 'absolute', bottom: 108, left: 0, right: 0, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#969393', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 5   },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, paddingTop: 12, marginTop: 4, marginBottom: 4 },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '700' },
});

export default CartScreen;
