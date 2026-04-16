import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';

// Shopkeeper Screens
import ShopkeeperDashboardScreen from '../screens/shopkeeper/ShopkeeperDashboardScreen';
import ProductsScreen from '../screens/shopkeeper/ProductsScreen';
import AddProductScreen from '../screens/shopkeeper/AddProductScreen';
import ShopkeeperOrdersScreen from '../screens/shopkeeper/ShopkeeperOrdersScreen';
import ShopkeeperProfileScreen from '../screens/shopkeeper/ShopkeeperProfileScreen';
import ProductDetailScreen from '../screens/shopkeeper/ProductDetailScreen';
import EditProductScreen from '../screens/shopkeeper/EditProductScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack Navigator
const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopkeeperDashboard" component={ShopkeeperDashboardScreen} />
    </Stack.Navigator>
  );
};

// Products Stack Navigator
const ProductsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductsList" component={ProductsScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
    </Stack.Navigator>
  );
};

// Orders Stack Navigator
const OrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopkeeperOrders" component={ShopkeeperOrdersScreen} />
    </Stack.Navigator>
  );
};

const ShopkeeperNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let fallbackIcon;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'dashboard' : 'dashboard';
            fallbackIcon = '📊';
          } else if (route.name === 'Products') {
            iconName = focused ? 'inventory' : 'inventory';
            fallbackIcon = '📦';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt';
            fallbackIcon = '📋';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person';
            fallbackIcon = '👤';
          }

          try {
            return <Icon name={iconName} size={size} color={color} />;
          } catch (error) {
            // Fallback to text icon if vector icon fails
            return <Text style={{ fontSize: size, color }}>{fallbackIcon}</Text>;
          }
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductsStack}
        options={{ tabBarLabel: 'Products' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersStack}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ShopkeeperProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default ShopkeeperNavigator;
