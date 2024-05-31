import React from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingScreen from '../screens/setting';
import { COLOR_CODE } from '../utils/enums';
import ProfileNavigator from './profile';
import FeedScreen from '../screens/feed';
import MatchNavigator from './match';
import CameraNavigator from './camera';

Foundation.loadFont();
FontAwesome.loadFont();
Ionicons.loadFont();

const Tab = createBottomTabNavigator();

const { height, width } = Dimensions.get('window');
const marginLeft = Math.floor(width/20);
const marginRight = marginLeft;
const barHeight = Math.floor(height/12);
const marginBottom = Math.floor(height/50);

const HomeTabNavigator = (data: any) => { 

  return (
    <Tab.Navigator screenOptions={{  
        tabBarShowLabel: false,
        tabBarStyle: { marginBottom, marginLeft, marginRight, borderRadius: 50, height: barHeight, backgroundColor: COLOR_CODE.OFF_WHITE }, 
        tabBarItemStyle: { marginBottom, borderRadius: 50, height: barHeight },
        tabBarActiveBackgroundColor: COLOR_CODE.OFF_WHITE, 
        tabBarInactiveBackgroundColor: COLOR_CODE.OFF_WHITE
      }}>

      <Tab.Screen name='FeedScreen' component={FeedScreen} options={{ 
        tabBarLabel: 'Feed', headerShown: false, 
        tabBarIcon: ({focused, color, size}) => (<Foundation name='home' color={ focused ? COLOR_CODE.BRIGHT_BLUE : COLOR_CODE.BLACK } size={30} />)
        }} 
        initialParams={data.params} />

      <Tab.Screen name='MatchNavigator' component={MatchNavigator} options={{ 
        tabBarLabel: 'Match', headerShown: false, 
        tabBarIcon: ({focused, color, size}) => (<Ionicons name='chatbubble-ellipses-outline' color={ focused ? COLOR_CODE.BRIGHT_BLUE : COLOR_CODE.BLACK } size={30} />)
        }} 
        initialParams={data.params} />

      <Tab.Screen name='CameraNavigator' component={CameraNavigator} options={{ 
        tabBarLabel: 'Camera', headerShown: false, 
        tabBarIcon: ({focused, color, size}) => (<Ionicons name='camera' color={ focused ? COLOR_CODE.BRIGHT_BLUE : COLOR_CODE.BLACK } size={30} />)
        }} 
        initialParams={data.params} />
        
      <Tab.Screen name='ProfileNavigator' component={ProfileNavigator} options={{ 
        tabBarLabel: 'Profile', headerShown: false,
        tabBarIcon: ({focused, color, size}) => (<FontAwesome name='user' color={ focused ? COLOR_CODE.BRIGHT_BLUE : COLOR_CODE.BLACK } size={25}/>)
        }} 
        initialParams={data.params} />

      <Tab.Screen name='SettingScreen' component={SettingScreen} options={{ 
        tabBarLabel: 'Setting', headerShown: false,
        tabBarIcon: ({focused, color, size}) => (<FontAwesome name='gear' color={ focused ? COLOR_CODE.BRIGHT_BLUE : COLOR_CODE.BLACK } size={25}/>)
        }} 
        initialParams={data.params} />
    </Tab.Navigator>
  );
}

export default HomeTabNavigator;