import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchOrders } from '../../redux/slices/orderSlice';
import Header from '../../components/common/Header';
import OrderCard from '../../components/cards/OrderCard';
import { COLORS, SIZES, ORDER_STATUS, CONTENT_BOTTOM_PADDING, BORDER_RADIUS, SHADOWS } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  const insets = useSafeAreaInsets();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Calculate bottom padding: base ContentBottomPadding + safe area insets + extra 24px
  const bottomPadding = CONTENT_BOTTOM_PADDING + insets.bottom + 24;

  // Load orders when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [user?.id])
  );

  const loadOrders = async () => {
    try {
      await dispatch(fetchOrders({ 
        userId: user?.id, 
        userRole: user?.role 
      }));
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (order) => {
    console.log('OrdersScreen - Order pressed:', order.id, order);
    navigation.navigate('OrderTracking', { orderId: order.id });
  };

  const getFilteredOrders = () => {
    const list = Array.isArray(orders) ? orders : [];

    const filtered = selectedFilter === 'All'
      ? list
      : list.filter((order) => {
          const orderStatus = (order?.status || '').toString().toLowerCase();
          const filterKey = String(selectedFilter || '').toLowerCase();
          return orderStatus === filterKey;
        });

    return filtered.slice().sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  };

  const getStatusCount = (status) => {
    const ordersArray = Array.isArray(orders) ? orders : [];
    const s = String(status || '').toLowerCase();
    return ordersArray.filter(order => String(order?.status || '').toLowerCase() === s).length;
  };

  // Modern pill-style filter tabs (All, Pending, Ready only)
  const renderFilterTabs = () => {
    const ordersArray = Array.isArray(orders) ? orders : [];
    
    // Only show main 3 tabs: All, Pending, Ready
    const filters = [
      { key: 'All', label: 'All', count: ordersArray.length },
      { key: ORDER_STATUS.PENDING, label: 'Pending', count: getStatusCount(ORDER_STATUS.PENDING) },
      { key: ORDER_STATUS.READY, label: 'Ready', count: getStatusCount(ORDER_STATUS.READY) },
    ];

    return (
      <View style={styles.filterTabsContainer}>
        <View style={styles.filterTabsInner}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === filter.key && styles.filterTabTextActive,
                ]}
              >
                {filter.label}
              </Text>
              {filter.count > 0 && (
                <View style={[
                  styles.filterBadge,
                  selectedFilter === filter.key && styles.filterBadgeActive,
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    selectedFilter === filter.key && styles.filterBadgeTextActive,
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptySubtitle}>
          You haven't placed any orders yet.{'\n'}Start shopping to see your orders here!
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Custom Header with safe area */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}>
<View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
        >
          <Icon name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>Orders total</Text>
      </View>

      </View>

      {/* Filter Tabs */}
      {renderFilterTabs()}

      {/* Orders List - Single column layout */}
      <FlatList
        data={getFilteredOrders()}
        keyExtractor={(item, index) => String(item?.id || index)}
        // REMOVED: numColumns={2} - now single column
        // REMOVED: columnWrapperStyle - not needed for single column
        renderItem={({ item, index }) => {
          if (!item) return null;
          return (
            <View style={styles.cardWrapper}>
              <OrderCard
                order={item}
                onPress={handleOrderPress}
                showActions={false}
              />
            </View>
          );
        }}
        contentContainerStyle={[
          styles.ordersContent,
          { paddingBottom: bottomPadding },
          // Center empty state when no orders
          Array.isArray(orders) && orders.length === 0 && { flex: 1 },
        ]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
    backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  // Header Styles
  headerContainer: {
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: 'rgba(254, 255, 254, 0.14)',
  },
  backArrow: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'left',
    width: '100%',
    marginRight: 12,
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: SIZES.font - 2,
    color: 'rgba(255, 255, 255, 0)',
    marginTop: 2,
    display: 'none', // Hide subtitle for cleaner look
  },
  headerRight: {
    width: 36,
  },

  // Filter Tabs - Modern Pill Style
  filterTabsContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  filterTabsInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: 4,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: COLORS.white,
  },
  filterBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 24,
    alignItems: 'center',
    marginLeft: 6,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: SIZES.font - 2,
    color: COLORS.primary,
    fontWeight: '700',
  },
  filterBadgeTextActive: {
    color: COLORS.white,
  },

  // Orders Content
  ordersContent: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
  },
  cardWrapper: {
    marginBottom: 16, // Space between cards
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 4,
    paddingHorizontal: SIZES.padding * 2,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: SIZES.padding,
  },
  emptyTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  emptySubtitle: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: '700',
  },
});

export default OrdersScreen;
