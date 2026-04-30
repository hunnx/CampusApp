import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CustomTabBar from './CustomTabBar';
import { CONTENT_BOTTOM_PADDING } from '../constants';

import AvailableOrdersScreen from '../screens/deliverer/AvailableOrdersScreen';
import ActiveDeliveryScreen from '../screens/deliverer/ActiveDeliveryScreen';
import DeliveryHistoryScreen from '../screens/deliverer/DeliveryHistoryScreen';
import DelivererProfileScreen from '../screens/deliverer/DelivererProfileScreen';
import OrderDetailScreen from '../screens/deliverer/OrderDetailScreen';
import DeliveryMapScreen from '../screens/deliverer/DeliveryMapScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AvailableOrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AvailableOrders" component={AvailableOrdersScreen} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
  </Stack.Navigator>
);

const ActiveDeliveryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ActiveDelivery" component={ActiveDeliveryScreen} />
    <Stack.Screen name="DeliveryMap" component={DeliveryMapScreen} />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="History" component={DeliveryHistoryScreen} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
  </Stack.Navigator>
);

const DelivererNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
      contentStyle: { paddingBottom: CONTENT_BOTTOM_PADDING + 20 }
    }}
  >
    <Tab.Screen name="Available" component={AvailableOrdersStack} options={{ tabBarLabel: 'Available' }} />
    <Tab.Screen name="Active" component={ActiveDeliveryStack} options={{ tabBarLabel: 'Active' }} />
    <Tab.Screen name="History" component={HistoryStack} options={{ tabBarLabel: 'History' }} />
    <Tab.Screen name="Profile" component={DelivererProfileScreen} options={{ tabBarLabel: 'Profile' }} />
  </Tab.Navigator>
);

export default DelivererNavigator;
