import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CodeVerificationScreen from '../screens/code.verification';
import WelcomeScreen from '../screens/welcome';
import LoginScreen from '../screens/login';
import SignupHomeScreen from '../screens/signup.home';
import SignupSecondScreen from '../screens/signup.second';
import HomeScreen from '../screens/home';
import ContactAdminScreen from '../screens/contact.admin';
import { getToken, updateTokens } from '../utils/helpers';
import { initialLogoScreenTimeMilli } from '../utils/constants';
import LogoScreen from '../screens/logo';
import { setUserId } from '../utils/user.id';
import SignupThirdScreen from '../screens/signup.third';

const Stack = createNativeStackNavigator();

const LaunchStackNavigator = () => {
  const [isLoading, setLoading] = useState(true);
  const [initialScreen, setInitialScreen] = useState('WelcomeScreen');

  const checkAuthenticated = async () => {
    const userIdObj = await getToken('userId');
    if (userIdObj) {
      const userId = Number(userIdObj?.password);
      const authCheckRes = await updateTokens(userId);
      if (authCheckRes) {
        setUserId(userId);
        setInitialScreen('HomeScreen');
      }
    }
    setTimeout(() => setLoading(false), initialLogoScreenTimeMilli);
  }

  useEffect(() => {
    let check = true;
    if (check) {
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
            <Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name='SignupHomeScreen' component={SignupHomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name='SignupSecondScreen' component={SignupSecondScreen} options={{headerShown: false, gestureEnabled: false}}/>
            <Stack.Screen name='SignupThirdScreen' component={SignupThirdScreen} options={{headerShown: false, gestureEnabled: false}}/>
            {/* <Stack.Screen name='CodeVerificationScreen' component={CodeVerificationScreen} options={{headerShown: false}}/> */}
            <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown: false, gestureEnabled: false}} />
            <Stack.Screen name='ContactAdminScreen' component={ContactAdminScreen} options={{headerShown: false}}/>
          </Stack.Navigator>
        </NavigationContainer>
      )
    )
  );
}

export default LaunchStackNavigator;