import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';

// Student Screens
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import CartScreen from '../screens/student/CartScreen';
import OrdersScreen from '../screens/student/OrdersScreen';
import StudentProfileScreen from '../screens/student/StudentProfileScreen';
import ProductDetailScreen from '../screens/student/ProductDetailScreen';
import CheckoutScreen from '../screens/student/CheckoutScreen';
import OrderTrackingScreen from '../screens/student/OrderTrackingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};

// Cart Stack Navigator
const CartStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartList" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};

// Orders Stack Navigator
const OrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersList" component={OrdersScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
    </Stack.Navigator>
  );
};

const StudentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let fallbackIcon;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
            fallbackIcon = '🏠';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'shopping-cart' : 'shopping-cart';
            fallbackIcon = '🛒';
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
        name="Home" 
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartStack}
        options={{ tabBarLabel: 'Cart' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersStack}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default StudentNavigator;
