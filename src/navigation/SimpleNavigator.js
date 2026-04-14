import React, { useState } from 'react';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import ShopkeeperDashboardScreen from '../screens/shopkeeper/ShopkeeperDashboardScreen';
import ProductsScreen from '../screens/shopkeeper/ProductsScreen';
import AddProductScreen from '../screens/shopkeeper/AddProductScreen';
import AddCategoryScreen from '../screens/shopkeeper/AddCategoryScreen';
import DelivererHomeScreen from '../screens/deliverer/DelivererProfileScreen';

const SimpleNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('Welcome');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('student'); // 'student', 'shopkeeper', 'deliverer'

  const navigate = (screenName) => {
    setCurrentScreen(screenName);
  };

  const handleLogin = (role = 'student') => {
    setIsLoggedIn(true);
    setUserRole(role);
    
    // Navigate to role-specific screen
    switch (role) {
      case 'student':
        setCurrentScreen('StudentHome');
        break;
      case 'shopkeeper':
        setCurrentScreen('ShopkeeperDashboard');
        break;
      case 'deliverer':
        setCurrentScreen('DelivererHome');
        break;
      default:
        setCurrentScreen('Home');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('student');
    setCurrentScreen('Welcome');
  };

  const renderScreen = () => {
    const navigationProps = {
      navigate,
      handleLogin,
      handleLogout,
      userRole,
    };

    switch (currentScreen) {
      case 'Welcome':
        return <WelcomeScreen {...navigationProps} />;
      case 'Login':
        return <LoginScreen {...navigationProps} />;
      case 'Register':
        return <RegisterScreen {...navigationProps} />;
      case 'Home':
        return <HomeScreen {...navigationProps} />;
      case 'StudentHome':
        return <StudentHomeScreen {...navigationProps} />;
      case 'ShopkeeperDashboard':
        return <ShopkeeperDashboardScreen {...navigationProps} />;
      case 'Products':
        return <ProductsScreen {...navigationProps} />;
      case 'AddProduct':
        return <AddProductScreen {...navigationProps} />;
      case 'AddCategory':
        return <AddCategoryScreen {...navigationProps} />;
      case 'DelivererHome':
        return <DelivererHomeScreen {...navigationProps} />;
      default:
        return <WelcomeScreen {...navigationProps} />;
    }
  };

  return renderScreen();
};

export default SimpleNavigator;
