import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/welcome';
import SignupSecondScreen from '../screens/signup.second';
import ContactAdminScreen from '../screens/contact.admin';
import LogoScreen from '../screens/logo';
import SignupThirdScreen from '../screens/signup.third';
import { getToken, updateTokens } from '../utils/helpers';
import { initialLogoScreenTimeMilli } from '../utils/constants';
import { setUserId } from '../utils/user.id';
import { setUserCountry } from '../utils/user.country';
import HomeTabNavigator from './home';

const Stack = createNativeStackNavigator();

const LaunchStackNavigator = () => {
  const [isLoading, setLoading] = useState(true);
  const [initialScreen, setInitialScreen] = useState('WelcomeScreen');

  const checkAuthenticated = async () => {
    const userIdObj = await getToken('userId');
    if (userIdObj) {
      const userId = Number(userIdObj?.password);
      setUserId(userId);
      const authCheckRes = await updateTokens(userId);
      if (authCheckRes) {
        setInitialScreen('HomeTabNavigator');
      }
    }
    setTimeout(() => setLoading(false), initialLogoScreenTimeMilli);
  }

  useEffect(() => {
    let check = true;
    if (check) {
      setUserCountry();
      checkAuthenticated();
    }
    return () => {
      check = false;
    }
  }, []);

  return (
    (
      isLoading ? 
      (<LogoScreen />) :
      (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialScreen}>
            <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} options={{headerShown: false}}/>
            {/* <Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}}/> */}
            {/* <Stack.Screen name='SignupHomeScreen' component={SignupHomeScreen} options={{headerShown: false}}/> */}
            {/* <Stack.Screen name='SignupSecondScreen' component={SignupSecondScreen} options={{headerShown: false, gestureEnabled: false}}/> */}
            {/* <Stack.Screen name='SignupThirdScreen' component={SignupThirdScreen} options={{headerShown: false, gestureEnabled: false}}/> */}
            <Stack.Screen name='HomeTabNavigator' component={HomeTabNavigator} options={{headerShown: false, gestureEnabled: false}} />
            <Stack.Screen name='ContactAdminScreen' component={ContactAdminScreen} options={{headerShown: false}}/>
          </Stack.Navigator>
        </NavigationContainer>
      )
    )
  );
}

export default LaunchStackNavigator;