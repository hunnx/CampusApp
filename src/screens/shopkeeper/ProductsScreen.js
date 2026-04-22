import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import { COLORS } from '../../constants';
import { fetchMyProducts, updateProduct } from '../../redux/slices/productSlice';

const { width } = Dimensions.get('window');
const productCardWidth = (width - 48) / 2;

const ProductsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const toggleAvailability = async (product) => {
    try {
      await dispatch(updateProduct({
        id: product.id,
        productData: {
          ...product,
          available: !product.available,
        },
      })).unwrap();
    } catch (error) {
      Alert.alert('Error', error || 'Failed to update product availability.');
    }
  };

  const renderProductCard = (product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>
          {product.image?.startsWith('http') ? '📦' : product.image || '📦'}
        </Text>
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
            product.available ? styles.availableBadge : styles.unavailableBadge,
          ]}
        >
          <Text style={styles.statusText}>
            {product.available ? 'Available' : 'Out of Stock'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleAvailability(product)}
        >
          <Text style={styles.toggleButtonText}>
            {product.available ? 'Disable' : 'Enable'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="🛍️ My Products"
        onBackPress={() => navigation.goBack()}
        rightComponent={(
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Text style={styles.addButtonText}>➕ Add Product</Text>
          </TouchableOpacity>
        )}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.productsGrid}>
            {products.length > 0 ? (
              products.map(renderProductCard)
            ) : (
              <Text style={styles.emptyStateText}>No backend products found yet.</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
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
  emptyStateText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.gray,
    paddingVertical: 24,
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
    color: COLORS.primary,
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
  availableBadge: {
    backgroundColor: '#4CAF50',
  },
  unavailableBadge: {
    backgroundColor: '#f44336',
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
