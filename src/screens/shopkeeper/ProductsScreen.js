import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const productCardWidth = (width - 48) / 2; // 2 products per row

const ProductsScreen = ({ navigate }) => {
  // Mock products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Burger Combo',
      price: 350,
      category: 'Fast Food',
      image: '🍔',
      available: true,
    },
    {
      id: 2,
      name: 'Pizza Slice',
      price: 200,
      category: 'Fast Food',
      image: '🍕',
      available: true,
    },
    {
      id: 3,
      name: 'Sandwich',
      price: 150,
      category: 'Snacks',
      image: '🥪',
      available: false,
    },
    {
      id: 4,
      name: 'Pasta Bowl',
      price: 280,
      category: 'Italian',
      image: '🍝',
      available: true,
    },
    {
      id: 5,
      name: 'Salad Bowl',
      price: 180,
      category: 'Healthy',
      image: '🥗',
      available: true,
    },
    {
      id: 6,
      name: 'Ice Cream',
      price: 120,
      category: 'Desserts',
      image: '🍦',
      available: false,
    },
  ]);

  const handleAddProduct = () => {
    Alert.alert('Add Product', 'Navigate to Add Product Screen');
  };

  const handleProductPress = (product) => {
    Alert.alert('Product Details', `${product.name}\nPrice: PKR ${product.price}\nStatus: ${product.available ? 'Available' : 'Out of Stock'}`);
  };

  const toggleAvailability = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, available: !product.available }
          : product
      )
    );
  };

  const ProductCard = ({ product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>{product.image}</Text>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productPrice}>PKR {product.price}</Text>
      </View>

      <View style={styles.productStatus}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: product.available ? '#4CAF50' : '#f44336' },
          ]}
        >
          <Text style={styles.statusText}>
            {product.available ? 'Available' : 'Out of Stock'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleAvailability(product.id)}
        >
          <Text style={styles.toggleButtonText}>
            {product.available ? 'Disable' : 'Enable'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('ShopkeeperDashboard')}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🛍️ My Products</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>➕ Add Product</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  productCard: {
    width: productCardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    height: 80,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 40,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  productStatus: {
    padding: 12,
    paddingTop: 0,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  toggleButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
});

export default ProductsScreen;
