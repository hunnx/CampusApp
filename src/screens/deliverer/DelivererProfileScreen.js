import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const DelivererHomeScreen = ({ navigate, handleLogout }) => {
  // Mock available orders data
  const [availableOrders] = useState([
    {
      id: 1,
      customerName: 'John Doe',
      items: ['Burger Combo', 'Pizza Slice'],
      totalAmount: 550,
      pickupLocation: 'Shop A',
      deliveryLocation: 'Hostel Block B',
      status: 'READY',
      time: '2 mins ago',
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      items: ['Pasta Bowl', 'Salad'],
      totalAmount: 460,
      pickupLocation: 'Shop B',
      deliveryLocation: 'Hostel Block C',
      status: 'READY',
      time: '5 mins ago',
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      items: ['Sandwich', 'Ice Cream'],
      totalAmount: 270,
      pickupLocation: 'Shop A',
      deliveryLocation: 'Library',
      status: 'READY',
      time: '8 mins ago',
    },
  ]);

  const OrderCard = ({ order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: '#FF6B6B' }
        ]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      
      <View style={styles.orderItems}>
        <Text style={styles.itemsText} numberOfLines={2}>
          {order.items.join(', ')}
        </Text>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.amount}>PKR {order.totalAmount}</Text>
        <Text style={styles.time}>{order.time}</Text>
      </View>
      
      <TouchableOpacity style={styles.acceptButton}>
        <Text style={styles.acceptButtonText}>Accept Order</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('Welcome')}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🚴 Deliverer Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.ordersList}>
          {availableOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navLabel}>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏃</Text>
          <Text style={styles.navLabel}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
          <Text style={styles.navIcon}>🚪</Text>
          <Text style={styles.navLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  placeholder: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  ordersList: {
    padding: 16,
    paddingBottom: 100, // Space for bottom nav
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  acceptButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default DelivererHomeScreen;
