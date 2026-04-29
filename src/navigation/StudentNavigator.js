import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CustomTabBar from './CustomTabBar';

import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import CartScreen from '../screens/student/CartScreen';
import OrdersScreen from '../screens/student/OrdersScreen';
import StudentProfileScreen from '../screens/student/StudentProfileScreen';
import ProductDetailScreen from '../screens/student/ProductDetailScreen';
import CheckoutScreen from '../screens/student/CheckoutScreen';
import OrderTrackingScreen from '../screens/student/OrderTrackingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CartList" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrdersList" component={OrdersScreen} />
    <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
  </Stack.Navigator>
);

const StudentNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Cart" component={CartStack} options={{ tabBarLabel: 'Cart' }} />
      <Tab.Screen name="Orders" component={OrdersStack} options={{ tabBarLabel: 'Orders' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default StudentNavigator;
