import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedHomeScreen from '../screens/feed.home';
import ProfileScreen from '../screens/profile';
import ViewPostScreen from '../screens/view.post';

const FeedStack = createNativeStackNavigator();

const FeedNavigator = ({ params }: any) => {
  return (
    <FeedStack.Navigator initialRouteName='FeedHomeScreen'>
      <FeedStack.Screen name='FeedHomeScreen' 
        component={FeedHomeScreen} options={{ headerShown: false, gestureEnabled: false }}
      />
      <FeedStack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }} />
      <FeedStack.Screen name='ViewPostScreen' component={ViewPostScreen} options={{ headerShown: false }} />
    </FeedStack.Navigator>
  );
}

export default FeedNavigator;