import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const StudentHomeScreen = ({ navigate, handleLogout }) => {
  // Mock products data
  const [products] = useState([
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
      available: true,
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

  const ProductCard = ({ product }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>{product.image}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productPrice}>PKR {product.price}</Text>
        <View style={[
          styles.availabilityBadge,
          { backgroundColor: product.available ? '#4CAF50' : '#f44336' }
        ]}>
          <Text style={styles.availabilityText}>
            {product.available ? 'Available' : 'Out of Stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('Welcome')}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎓 Student Home</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navLabel}>Orders</Text>
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
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Space for bottom nav
  },
  productCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    marginBottom: 8,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    color: '#ffffff',
    fontSize: 10,
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

export default StudentHomeScreen;
