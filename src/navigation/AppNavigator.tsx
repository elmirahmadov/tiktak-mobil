import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import BasketScreen from '../screens/BasketScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import Search from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AccountInfoScreen from '../screens/AccountInfoScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
        <Stack.Screen name="Basket" component={BasketScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
