import React, { useRef, useEffect, useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../common/store/Auth';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import BasketScreen from '../screens/Basket/BasketScreen';
import CheckoutScreen from '../screens/Basket/CheckoutScreen';
import OrderSuccessScreen from '../screens/Order/OrderSuccessScreen';
import AccountInfoScreen from '../screens/Profile/AccountInfoScreen';
import OrderHistoryScreen from '../screens/Order/OrderHistoryScreen';
import FavoriteScreen from '../screens/Favorite/FavoriteScreen';
import Footer from '../common/components/Footer';
import HomeStack from './HomeStack';
import SearchScreen from '../screens/Search/SearchScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => {
        const activeRoute = state.routeNames[state.index];
        return <Footer navigation={navigation} active={activeRoute} />;
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Əsas' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Axtar' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Hesabım' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const navigationRef = useRef<any>(null);
  const { isAuthenticated, accessToken } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (navigationRef.current) {
    }
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (navigationRef.current) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [isAuthenticated, accessToken]);

  const initialRoute = useMemo(() => {
    if (!isReady) return 'Splash';
    return isAuthenticated && accessToken ? 'MainTabs' : 'Splash';
  }, [isReady, isAuthenticated, accessToken]);

  if (!isReady) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Basket" component={BasketScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="Favorite" component={FavoriteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
