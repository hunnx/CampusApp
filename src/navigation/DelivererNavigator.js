import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';

// Deliverer Screens
import AvailableOrdersScreen from '../screens/deliverer/AvailableOrdersScreen';
import ActiveDeliveryScreen from '../screens/deliverer/ActiveDeliveryScreen';
import DeliveryHistoryScreen from '../screens/deliverer/DeliveryHistoryScreen';
import DelivererProfileScreen from '../screens/deliverer/DelivererProfileScreen';
import OrderDetailScreen from '../screens/deliverer/OrderDetailScreen';
import DeliveryMapScreen from '../screens/deliverer/DeliveryMapScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Available Orders Stack Navigator
const AvailableOrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AvailableOrders" component={AvailableOrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
};

// Active Delivery Stack Navigator
const ActiveDeliveryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActiveDelivery" component={ActiveDeliveryScreen} />
      <Stack.Screen name="DeliveryMap" component={DeliveryMapScreen} />
    </Stack.Navigator>
  );
};

const DelivererNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let fallbackIcon;

          if (route.name === 'Available') {
            iconName = focused ? 'list' : 'list';
            fallbackIcon = '📋';
          } else if (route.name === 'Active') {
            iconName = focused ? 'local-shipping' : 'local-shipping';
            fallbackIcon = '🚴';
          } else if (route.name === 'History') {
            iconName = focused ? 'history' : 'history';
            fallbackIcon = '📜';
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
        name="Available" 
        component={AvailableOrdersStack}
        options={{ tabBarLabel: 'Available' }}
      />
      <Tab.Screen 
        name="Active" 
        component={ActiveDeliveryStack}
        options={{ tabBarLabel: 'Active' }}
      />
      <Tab.Screen 
        name="History" 
        component={DeliveryHistoryScreen}
        options={{ tabBarLabel: 'History' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={DelivererProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default DelivererNavigator;
