import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import { COLORS, SIZES } from '../../constants';
import { fetchProducts } from '../../redux/slices/productSlice';

const StudentHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector(state => state.products);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchProducts()).then(() => {
      setRefreshing(false);
    });
  }, [dispatch]);

  const handleProductPress = useCallback((product) => {
    navigation.navigate('ProductDetail', { product });
  }, [navigation]);

  const renderProduct = useCallback(({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>{item.image?.includes('http') ? '📦' : item.image || '📦'}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>PKR {item.price}</Text>
        <View style={[
          styles.availabilityBadge,
          { backgroundColor: item.available ? COLORS.success : COLORS.danger }
        ]}>
          <Text style={styles.availabilityText}>
            {item.available ? 'Available' : 'Out of Stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [handleProductPress]);

  const productsKeyExtractor = useCallback(
    (item) => String(item.productCategoryItemId || item.id || item.name),
    []
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="🎓 Student Home" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="🎓 Student Home" />
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        style={styles.scrollView}
        data={products}
        renderItem={renderProduct}
        keyExtractor={productsKeyExtractor}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        windowSize={10}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          !isLoading && products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products available</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollView: {
    flex: 1,
  },
  productsContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding * 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SIZES.base * 2,
  },
  productCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    height: 80,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  },
  productEmoji: {
    fontSize: 40,
  },
  productInfo: {
    padding: SIZES.base,
  },
  productName: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  productCategory: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  productPrice: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  availabilityBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    color: COLORS.white,
    fontSize: SIZES.font - 4,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.font,
    marginBottom: SIZES.base,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
});

export default StudentHomeScreen;
