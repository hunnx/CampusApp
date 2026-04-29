import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CustomTabBar from './CustomTabBar';

import ShopkeeperDashboardScreen from '../screens/shopkeeper/ShopkeeperDashboardScreen';
import ProductsScreen from '../screens/shopkeeper/ProductsScreen';
import AddProductScreen from '../screens/shopkeeper/AddProductScreen';
import ShopkeeperOrdersScreen from '../screens/shopkeeper/ShopkeeperOrdersScreen';
import ShopkeeperProfileScreen from '../screens/shopkeeper/ShopkeeperProfileScreen';
import ProductDetailScreen from '../screens/shopkeeper/ProductDetailScreen';
import EditProductScreen from '../screens/shopkeeper/EditProductScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ShopkeeperDashboard" component={ShopkeeperDashboardScreen} />
  </Stack.Navigator>
);

const ProductsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProductsList" component={ProductsScreen} />
    <Stack.Screen name="AddProduct" component={AddProductScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="EditProduct" component={EditProductScreen} />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ShopkeeperOrders" component={ShopkeeperOrdersScreen} />
  </Stack.Navigator>
);

const ShopkeeperNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Dashboard" component={DashboardStack} options={{ tabBarLabel: 'Dashboard' }} />
    <Tab.Screen name="Products" component={ProductsStack} options={{ tabBarLabel: 'Products' }} />
    <Tab.Screen name="Orders" component={OrdersStack} options={{ tabBarLabel: 'Orders' }} />
    <Tab.Screen name="Profile" component={ShopkeeperProfileScreen} options={{ tabBarLabel: 'Profile' }} />
  </Tab.Navigator>
);

export default ShopkeeperNavigator;
