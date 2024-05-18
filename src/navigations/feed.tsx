import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedHomeScreen from '../screens/feed.home';

const FeedStack = createNativeStackNavigator();

const FeedNavigator = ({ params }: any) => {
  return (
    <FeedStack.Navigator initialRouteName='FeedHomeScreen'>
      <FeedStack.Screen name='FeedHomeScreen' component={FeedHomeScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </FeedStack.Navigator>
  );
}

export default FeedNavigator;