import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES } from '../../constants';

const ProductCard = ({
  product,
  onPress,
  onAddToCart,
  loading = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {!product.available && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.price}>PKR {product.price}</Text>
          
          {onAddToCart && product.available && (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => onAddToCart(product)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.addToCartText}>+</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: SIZES.base,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.font,
  },
  content: {
    padding: SIZES.base,
  },
  name: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base / 2,
    minHeight: 40,
  },
  category: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addToCartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: SIZES.font + 4,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default ProductCard;
