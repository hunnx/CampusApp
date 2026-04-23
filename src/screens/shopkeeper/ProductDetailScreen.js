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
import Header from '../../components/common/Header';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '../../redux/slices/productSlice';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES } from '../../constants';

const ProductDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.products);
  
  const { product } = route.params;
  const [currentProduct, setCurrentProduct] = useState(product);

  const handleToggleAvailability = async () => {
    try {
      const updatedProduct = {
        ...currentProduct,
        available: !currentProduct.available,
      };
      
      await dispatch(updateProduct({ 
        id: currentProduct.id, 
        productData: updatedProduct 
      })).unwrap();
      
      setCurrentProduct(updatedProduct);
      
      Alert.alert(
        'Success',
        `Product is now ${updatedProduct.available ? 'available' : 'unavailable'}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update product availability');
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditProduct', { product: currentProduct });
  };

  const renderStatusBadge = () => {
    return (
      <View style={[
        styles.statusBadge,
        { backgroundColor: currentProduct.available ? COLORS.success : COLORS.gray }
      ]}>
        <Text style={styles.statusText}>
          {currentProduct.available ? 'Available' : 'Unavailable'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Product Details" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.imageSection}>
        {currentProduct?.image && typeof currentProduct.image === 'string' && currentProduct.image.startsWith('http') ? (
          <Image source={{ uri: currentProduct.image }} style={styles.productImage} />
        ) : (
          <View style={styles.productImagePlaceholder}>
            <Text style={styles.productImagePlaceholderText}>📦</Text>
          </View>
        )}
        {renderStatusBadge()}
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.headerRow}>
          <Text style={styles.productName}>{currentProduct.name}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.category}>{currentProduct.category}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>PKR {currentProduct.price}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {currentProduct.description || 'No description available for this product.'}
        </Text>

        <View style={styles.divider} />

        {currentProduct.shopkeeperName || currentProduct.shopkeeperId ? (
          <>
            <Text style={styles.sectionTitle}>Shop Information</Text>
            <Text style={styles.shopName}>{currentProduct.shopkeeperName}</Text>
            {currentProduct.shopkeeperId ? (
              <Text style={styles.shopId}>Shop ID: {currentProduct.shopkeeperId}</Text>
            ) : null}

            <View style={styles.divider} />
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Product Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Product ID</Text>
            <Text style={styles.detailValue}>{currentProduct.productCategoryItemId || currentProduct.id}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{currentProduct.category}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>PKR {currentProduct.price}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={[
              styles.detailValue,
              { color: currentProduct.available ? COLORS.success : COLORS.gray }
            ]}>
              {currentProduct.available ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionSection}>
        <Button
          title={currentProduct.available ? 'Mark Unavailable' : 'Mark Available'}
          onPress={handleToggleAvailability}
          loading={isLoading}
          type={currentProduct.available ? 'secondary' : 'primary'}
          style={styles.actionButton}
        />
        
        <Button
          title="Edit Product"
          onPress={handleEdit}
          type="outline"
          style={styles.editProductButton}
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
    height: 250,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImagePlaceholderText: {
    fontSize: 72,
  },
  statusBadge: {
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.font - 1,
  },
  detailsSection: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  productName: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
    marginRight: SIZES.base,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: SIZES.font + 4,
  },
  category: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  priceRow: {
    marginBottom: SIZES.padding,
  },
  price: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  shopName: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base / 2,
  },
  shopId: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: SIZES.base,
  },
  detailLabel: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  detailValue: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
  },
  actionSection: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    marginTop: SIZES.base,
  },
  actionButton: {
    marginBottom: SIZES.base,
  },
  editProductButton: {
    marginTop: SIZES.base,
  },
});

export default ProductDetailScreen;
