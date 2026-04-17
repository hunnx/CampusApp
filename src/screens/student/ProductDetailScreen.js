import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import Header from '../../components/common/Header';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES, DELIVERY_CHARGE } from '../../constants';

const ProductDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { product } = route.params || {};
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product?.price || 0);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
      setTotalPrice(product.price * newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(addToCart({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        shopkeeperId: product.shopkeeperId || '1',
        shopkeeperName: product.shopkeeperName || 'Campus Shop',
      },
      quantity,
    }));

    Alert.alert(
      'Added to Cart',
      `${quantity}x ${product.name} added to cart`,
      [
        {
          text: 'Continue Shopping',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'View Cart',
          onPress: () => navigation.navigate('Cart'),
        },
      ]
    );
  };

  const handleBuyNow = () => {
    const cartItem = {
      ...product,
      quantity,
      totalPrice,
    };
    
    // Navigate to checkout
    navigation.navigate('Checkout', { 
      items: [cartItem],
      totalAmount: totalPrice + DELIVERY_CHARGE,
    });
  };

  const renderQuantitySelector = () => {
    return (
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Quantity</Text>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Text style={[
              styles.quantityButtonText,
              quantity <= 1 && styles.quantityButtonTextDisabled
            ]}>
              -
            </Text>
          </TouchableOpacity>
          
          <View style={styles.quantityValue}>
            <Text style={styles.quantityNumber}>{quantity}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
          >
            <Text style={[
              styles.quantityButtonText,
              quantity >= 10 && styles.quantityButtonTextDisabled
            ]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPriceSection = () => {
    return (
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Price per item:</Text>
          <Text style={styles.priceValue}>PKR {product.price}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Subtotal:</Text>
          <Text style={styles.priceValue}>PKR {totalPrice}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Delivery:</Text>
          <Text style={styles.priceValue}>PKR {DELIVERY_CHARGE}</Text>
        </View>
        
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>PKR {totalPrice + DELIVERY_CHARGE}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={product?.name || 'Product Details'} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.imageSection}>
        {product?.image && typeof product.image === 'string' && product.image.startsWith('http') ? (
          <Image source={{ uri: product.image }} style={styles.productImage} />
        ) : (
          <View style={styles.productImagePlaceholder}>
            <Text style={styles.productEmoji}>{product?.image || '🍽️'}</Text>
          </View>
        )}

      
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {product.description || 'No description available for this product.'}
        </Text>

        <View style={styles.divider} />

        {renderQuantitySelector()}

        <View style={styles.divider} />

        {renderPriceSection()}
      </View>

      <View style={styles.actionSection}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          type="outline"
          style={styles.addToCartButton}
        />
        
        <Button
          title="Buy Now"
          onPress={handleBuyNow}
          style={styles.buyNowButton}
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
    paddingBottom: SIZES.padding * 2,
  },
  imageSection: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  productImagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 72,
  },
  detailsSection: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  productName: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  category: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginBottom: SIZES.padding,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light,
    marginVertical: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  description: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    lineHeight: SIZES.font * 1.5,
  },
  quantityContainer: {
    marginBottom: SIZES.padding,
  },
  quantityLabel: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
    padding: SIZES.base / 2,
    width: 150,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: SIZES.h2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  quantityButtonTextDisabled: {
    color: COLORS.gray,
  },
  quantityValue: {
    flex: 1,
    alignItems: 'center',
  },
  quantityNumber: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  priceSection: {
    marginBottom: SIZES.padding,
  },
  priceRow: {
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
  priceLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  priceValue: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
  },
  totalLabel: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionSection: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    marginTop: SIZES.base,
  },
  addToCartButton: {
    marginBottom: SIZES.base,
  },
  buyNowButton: {
    marginTop: SIZES.base,
  },
});

export default ProductDetailScreen;
