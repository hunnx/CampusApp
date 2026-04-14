import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import ShopkeeperNavigator from './ShopkeeperNavigator';
import DelivererNavigator from './DelivererNavigator';
import { USER_ROLES } from '../constants';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const renderMainNavigator = () => {
    if (!user || !user.role) {
      return AuthNavigator;
    }

    switch (user.role) {
      case USER_ROLES.STUDENT:
        return StudentNavigator;
      case USER_ROLES.SHOPKEEPER:
        return ShopkeeperNavigator;
      case USER_ROLES.DELIVERER:
        return DelivererNavigator;
      default:
        return AuthNavigator;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen 
            name="Main" 
            component={renderMainNavigator()} 
          />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
