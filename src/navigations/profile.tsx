import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile';
import EditProfileScreen from '../screens/edit.profile';
import ViewPostScreen from '../screens/view.post';

const ProfileStack = createNativeStackNavigator();

const ProfileNavigator = (props: any) => {
  return (
    <ProfileStack.Navigator initialRouteName='ProfileScreen'>
      <ProfileStack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }} initialParams={props.route.params} />
      <ProfileStack.Screen name='EditProfileScreen' component={EditProfileScreen} options={{ headerShown: false }} initialParams={props.route.params} />
      <ProfileStack.Screen name='ViewPostScreen' component={ViewPostScreen} options={{ headerShown: false }} initialParams={props.route.params} />
    </ProfileStack.Navigator>
  );
}

export default ProfileNavigator;