import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile';
import EditProfileScreen from '../screens/edit.profile';
import ViewPostScreen from '../screens/view.post';
import FullProfileScreen from '../screens/full.profile';
import MatchSummaryScreen from '../screens/match.summary';

const ProfileStack = createNativeStackNavigator();

const ProfileNavigator = (props: any) => {
  return (
    <ProfileStack.Navigator initialRouteName='ProfileScreen'>
      <ProfileStack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }} initialParams={{ commonScreen: false, matchedUserId: null }} />
      <ProfileStack.Screen name='EditProfileScreen' component={EditProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name='ViewPostScreen' component={ViewPostScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name='FullProfileScreen' component={FullProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name='MatchSummaryScreen' component={MatchSummaryScreen} options={{ headerShown: false }} />
    </ProfileStack.Navigator>
  );
}

export default ProfileNavigator;