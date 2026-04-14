import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import ShopkeeperDashboardScreen from '../screens/shopkeeper/ShopkeeperDashboardScreen';
import DelivererHomeScreen from '../screens/deliverer/DelivererProfileScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  // Temporary auth logic - change to true/false to test different flows
  const isLoggedIn = false;
  const userRole = 'student'; // 'student', 'shopkeeper', 'deliverer'

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main App Stack - Role-based
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            {userRole === 'student' && (
              <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
            )}
            {userRole === 'shopkeeper' && (
              <Stack.Screen name="ShopkeeperDashboard" component={ShopkeeperDashboardScreen} />
            )}
            {userRole === 'deliverer' && (
              <Stack.Screen name="DelivererHome" component={DelivererHomeScreen} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
