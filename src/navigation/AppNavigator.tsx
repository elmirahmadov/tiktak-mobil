import React, { useRef, useEffect, useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../common/store/Auth';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import CategoryDetailScreen from '../screens/Category/CategoryDetailScreen';
import BasketScreen from '../screens/Basket/BasketScreen';
import CheckoutScreen from '../screens/Basket/CheckoutScreen';
import OrderSuccessScreen from '../screens/Order/OrderSuccessScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AccountInfoScreen from '../screens/Profile/AccountInfoScreen';
import OrderHistoryScreen from '../screens/Order/OrderHistoryScreen';
import FavoriteScreen from '../screens/Favorite/FavoriteScreen';
import { setNavigationRef } from '../common/helpers/instance';
import SafeAreaWrapper from '../common/components/SafeAreaWrapper';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const navigationRef = useRef<any>(null);
  const { isAuthenticated, accessToken } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
    }

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const initialRoute = useMemo(() => {
    if (!isReady) return 'Splash';
    return isAuthenticated && accessToken ? 'Home' : 'Splash';
  }, [isReady, isAuthenticated, accessToken]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaWrapper>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="CategoryDetail"
            component={CategoryDetailScreen}
          />
          <Stack.Screen name="Basket" component={BasketScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="Favorite" component={FavoriteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaWrapper>
  );
}
