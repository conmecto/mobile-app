import React, { useEffect, useContext } from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RESULTS } from 'react-native-permissions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingScreen from '../screens/setting';
import FeedScreen from '../screens/feed';
import ProfileNavigator from './profile';
import MatchNavigator from './match';
import CameraNavigator from './camera';
import { checkLocation, askLocationAccess, updateLocation } from '../utils/update.location';
import { COLOR_CODE } from '../utils/enums';
import { ThemeContext } from '../contexts/theme.context';

Foundation.loadFont();
FontAwesome.loadFont();
Ionicons.loadFont();

const Tab = createBottomTabNavigator();

const { height } = Dimensions.get('window');
const barHeight = Math.floor(height/10);
const marginBottom = Math.floor(height/50);

const HomeTabNavigator = (data: any) => { 
  const { appTheme } = useContext(ThemeContext);

  useEffect(() => {
    let check = true;
    const runLocationService = async () => {
      let permissionStatus = await checkLocation();
      if (permissionStatus) {
        if (permissionStatus === RESULTS.DENIED) {
          permissionStatus = await askLocationAccess();
        }
        if (permissionStatus === RESULTS.GRANTED && check) {
          await updateLocation();
        } 
      } 
    }
    runLocationService();
    return () => {
      check = false;
    }
  }, []);

  const themeColor = appTheme === 'dark' ? {
    tabBarStyleBackgroundColor: COLOR_CODE.BLACK,
    tabBarActiveBackgroundColor: COLOR_CODE.BLACK,
    tabBarInactiveBackgroundColor: COLOR_CODE.BLACK,
    tabBarIconColor: COLOR_CODE.OFF_WHITE,
  } : {
    tabBarStyleBackgroundColor: COLOR_CODE.OFF_WHITE,
    tabBarActiveBackgroundColor: COLOR_CODE.OFF_WHITE,
    tabBarInactiveBackgroundColor: COLOR_CODE.OFF_WHITE,
    tabBarIconColor: COLOR_CODE.BLACK,
  }

  return (
    <Tab.Navigator screenOptions={{  
        tabBarShowLabel: false,
        tabBarStyle: {
          borderBottomLeftRadius: 50, borderBottomRightRadius: 50, height: barHeight, 
          backgroundColor: themeColor.tabBarStyleBackgroundColor
        }, 
        tabBarItemStyle: { marginBottom, borderRadius: 50, height: barHeight },
        tabBarActiveBackgroundColor: themeColor.tabBarActiveBackgroundColor, 
        tabBarInactiveBackgroundColor: themeColor.tabBarInactiveBackgroundColor
      }}>

      <Tab.Screen name='FeedScreen' component={FeedScreen} options={{ 
        tabBarLabel: 'Feed', headerShown: false, 
        tabBarIcon: ({focused, color, size}) => (<Foundation name='home' color={ focused ? COLOR_CODE.BRIGHT_BLUE : themeColor.tabBarIconColor } size={30} />)
        }} 
         />

      <Tab.Screen name='MatchNavigator' component={MatchNavigator} options={{ 
        tabBarLabel: 'Match', headerShown: false, 
        tabBarIcon: ({focused, color, size}) => (<Ionicons name='chatbubble-ellipses-outline' color={ focused ? COLOR_CODE.BRIGHT_BLUE : themeColor.tabBarIconColor } size={30} />)
        }} 
         />

      <Tab.Screen name='CameraNavigator' component={CameraNavigator} options={{ 
        tabBarLabel: 'Camera', headerShown: false, 
        tabBarIcon: ({focused, color, size}) => (<Ionicons name='camera' color={ focused ? COLOR_CODE.BRIGHT_BLUE : themeColor.tabBarIconColor } size={30} />)
        }} 
         />
        
      <Tab.Screen name='ProfileNavigator' component={ProfileNavigator} options={{ 
        tabBarLabel: 'Profile', headerShown: false,
        tabBarIcon: ({focused, color, size}) => (<FontAwesome name='user' color={ focused ? COLOR_CODE.BRIGHT_BLUE : themeColor.tabBarIconColor } size={25}/>)
        }} 
         />

      <Tab.Screen name='SettingScreen' component={SettingScreen} options={{ 
        tabBarLabel: 'Setting', headerShown: false,
        tabBarIcon: ({focused, color, size}) => (<FontAwesome name='gear' color={ focused ? COLOR_CODE.BRIGHT_BLUE : themeColor.tabBarIconColor } size={25}/>)
        }} 
         />
    </Tab.Navigator>
  );
}

export default HomeTabNavigator;