import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Header from '../../components/common/Header';
import { COLORS, SIZES } from '../../constants';

const StudentHomeScreen = ({ navigation }) => {
  const [products] = useState([
    { id: 1, name: 'Burger Combo', price: 350, category: 'Fast Food', image: '🍔', available: true },
    { id: 2, name: 'Pizza Slice', price: 200, category: 'Fast Food', image: '🍕', available: true },
    { id: 3, name: 'Sandwich', price: 150, category: 'Snacks', image: '🥪', available: true },
    { id: 4, name: 'Pasta Bowl', price: 280, category: 'Italian', image: '🍝', available: true },
    { id: 5, name: 'Salad Bowl', price: 180, category: 'Healthy', image: '🥗', available: true },
    { id: 6, name: 'Ice Cream', price: 120, category: 'Desserts', image: '🍦', available: false },
  ]);

  const handleProductPress = useCallback((product) => {
    navigation.navigate('ProductDetail', { product });
  }, [navigation]);

  const renderProduct = useCallback(({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>{item.image}</Text>
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

  const productsKeyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <Header title="🎓 Student Home" />
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
});

export default StudentHomeScreen;
