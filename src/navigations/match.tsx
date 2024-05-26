import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchHomeScreen from '../screens/match.home';
import MatchChatScreen from '../screens/match.chat';
import ProfileScreen from '../screens/profile';
import ViewPostScreen from '../screens/view.post';
import CameraScreen from '../screens/camera';
import CapturedCameraScreen from '../screens/captured.camera';
import UploadFileScreen from '../screens/upload.file';

const MatchStack = createNativeStackNavigator();

const MatchNavigator = ({ params }: any) => {
  return (
    <MatchStack.Navigator initialRouteName='MatchHomeScreen'>
      <MatchStack.Screen name='MatchHomeScreen' component={MatchHomeScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='MatchChatScreen' component={MatchChatScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='ViewPostScreen' component={ViewPostScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='CameraScreen' component={CameraScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='CapturedCameraScreen' component={CapturedCameraScreen} options={{ headerShown: false, gestureEnabled: false }}/>
      <MatchStack.Screen name='UploadFileScreen' component={UploadFileScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </MatchStack.Navigator>
  );
}

export default MatchNavigator;