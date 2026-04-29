import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS, SHADOWS } from '../../constants';
import ModernCard from '../../components/common/ModernCard';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import SkeletonLoader, { SkeletonGrid } from '../../components/common/SkeletonLoader';
import { fetchProducts } from '../../redux/slices/productSlice';

const CATEGORIES = [
  { name: 'All', icon: 'apps-outline' },
  { name: 'Food', icon: 'fast-food-outline' },
  { name: 'Stationery', icon: 'pencil-outline' },
  { name: 'Electronics', icon: 'phone-portrait-outline' },
  { name: 'Clothing', icon: 'shirt-outline' },
  { name: 'Books', icon: 'book-outline' },
  { name: 'Sports', icon: 'basketball-outline' },
];

const StudentHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { products, isLoading, error } = useSelector(state => state.products);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchProducts()).then(() => setRefreshing(false));
  }, [dispatch]);

  const handleProductPress = useCallback((product) => {
    navigation.navigate('ProductDetail', { product });
  }, [navigation]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const renderCategoryItem = ({ item }) => {
    const isActive = selectedCategory === item.name;
    return React.createElement(TouchableOpacity, {
      onPress: () => setSelectedCategory(item.name),
      style: [styles.categoryItem, {
        backgroundColor: isActive ? colors.primary : colors.light,
        ...SHADOWS.sm,
      }],
    },
      React.createElement(Icon, { name: item.icon, size: 20, color: isActive ? '#FFFFFF' : colors.gray }),
      React.createElement(Text, { style: [styles.categoryLabel, { color: isActive ? '#FFFFFF' : colors.gray }] }, item.name)
    );
  };

  const renderProduct = ({ item }) => React.createElement(ModernCard, {
    onPress: () => handleProductPress(item),
    variant: 'elevated',
    borderRadius: BORDER_RADIUS['2xl'],
    padding: 0,
    style: { flex: 1, marginHorizontal: 6, marginBottom: 16 },
  },
    React.createElement(View, { style: styles.productImage },
      React.createElement(Icon, { name: 'cube-outline', size: 40, color: colors.primaryLight })
    ),
    React.createElement(View, { style: styles.productInfo },
      React.createElement(Text, { style: [styles.productName, { color: colors.dark }], numberOfLines: 1 }, item.name),
      React.createElement(Text, { style: [styles.productCategory, { color: colors.gray }] }, item.category),
      React.createElement(View, { style: styles.productFooter },
        React.createElement(Text, { style: [styles.productPrice, { color: colors.primary }] }, 'PKR ' + item.price),
        React.createElement(View, {
          style: [styles.availabilityBadge, {
            backgroundColor: item.available ? colors.successLight : colors.dangerLight,
          }],
        },
          React.createElement(Text, {
            style: [styles.availabilityText, { color: item.available ? colors.success : colors.danger }],
          }, item.available ? 'In Stock' : 'Out')
        )
      )
    )
  );

  if (isLoading && !refreshing) {
    return React.createElement(View, { style: [styles.container, { backgroundColor: colors.background }] },
      React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
        React.createElement(Text, { style: styles.headerTitle }, 'Discover'),
        React.createElement(Text, { style: styles.headerSubtitle }, 'Find what you need on campus')
      ),
      React.createElement(View, { style: { padding: 20 } }, React.createElement(SkeletonGrid, { count: 4 }))
    );
  }

  if (error) {
    return React.createElement(View, { style: [styles.container, { backgroundColor: colors.background }] },
      React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
        React.createElement(Text, { style: styles.headerTitle }, 'Discover')
      ),
      React.createElement(ErrorState, { onRetry: onRefresh })
    );
  }

  return React.createElement(View, { style: [styles.container, { backgroundColor: colors.background }] },
    // Header
    React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
      React.createElement(View, { style: styles.headerTop },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.headerTitle }, 'Discover'),
          React.createElement(Text, { style: styles.headerSubtitle }, 'Find what you need on campus')
        ),
        React.createElement(TouchableOpacity, {
          style: [styles.cartBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }],
          onPress: () => navigation.navigate('Cart'),
        }, React.createElement(Icon, { name: 'cart-outline', size: 22, color: '#FFFFFF' }))
      ),
      React.createElement(View, { style: styles.searchContainer },
        React.createElement(SearchBar, {
          value: searchQuery,
          onChangeText: setSearchQuery,
          placeholder: 'Search products...',
        })
      )
    ),

    // Categories
    React.createElement(View, { style: styles.categoriesSection },
      React.createElement(FlatList, {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        data: CATEGORIES,
        renderItem: renderCategoryItem,
        keyExtractor: (item) => item.name,
        contentContainerStyle: styles.categoriesList,
      })
    ),

    // Products
    React.createElement(FlatList, {
      data: filteredProducts,
      renderItem: renderProduct,
      keyExtractor: (item) => String(item.productCategoryItemId || item.id || item.name),
      numColumns: 2,
      columnWrapperStyle: styles.columnWrapper,
      contentContainerStyle: styles.productsContainer,
      showsVerticalScrollIndicator: false,
      refreshControl: React.createElement(RefreshControl, {
        refreshing: refreshing,
        onRefresh: onRefresh,
        colors: [colors.primary],
      }),
      ListEmptyComponent: !isLoading ? React.createElement(EmptyState, {
        icon: 'search-outline',
        title: 'No products found',
        subtitle: 'Try adjusting your search or category filter',
        actionTitle: 'Clear Filters',
        onAction: () => { setSearchQuery(''); setSelectedCategory('All'); },
      }) : null,
    })
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: FONTS.h1.size,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: FONTS.bodySmall.size,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginTop: 4,
  },
  categoriesSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  productsContainer: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productImage: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
  },
  productInfo: {
    padding: 14,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default StudentHomeScreen;
