import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { ThemeProvider } from './src/theme/ThemeContext';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
