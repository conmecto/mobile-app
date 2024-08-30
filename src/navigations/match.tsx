import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchHomeScreen from '../screens/match.home';
import MatchChatScreen from '../screens/match.chat';
import ProfileScreen from '../screens/profile';
import ViewPostScreen from '../screens/view.post';
import CameraScreen from '../screens/camera';
import ChatCapturedCameraScreen from '../screens/chat.captured.camera';
import ViewChatFile from '../screens/view.chat.file';
import MatchSummaryScreen from '../screens/match.summary';
import ConmectoChat from '../screens/conmecto.chat';
import FullProfileScreen from '../screens/full.profile';

const MatchStack = createNativeStackNavigator();

const MatchNavigator = ({ params }: any) => {
  return (
    <MatchStack.Navigator initialRouteName='MatchHomeScreen'>
      <MatchStack.Screen name='MatchHomeScreen' component={MatchHomeScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <MatchStack.Screen name='MatchChatScreen' component={MatchChatScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='MatchSummaryScreen' component={MatchSummaryScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='ConmectoChat' component={ConmectoChat} options={{ headerShown: false, gestureEnabled: false }} />
      <MatchStack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='FullProfileScreen' component={FullProfileScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='ViewPostScreen' component={ViewPostScreen} options={{ headerShown: false }} />
      <MatchStack.Screen name='CameraScreen' component={CameraScreen} options={{ headerShown: false }} 
        initialParams={{ commonScreen: false, matchId: null, matchedUserId: null }}/>
      <MatchStack.Screen name='ChatCapturedCameraScreen' component={ChatCapturedCameraScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <MatchStack.Screen name='ViewChatFile' component={ViewChatFile} options={{ headerShown: false }} />
    </MatchStack.Navigator>
  );
}

export default MatchNavigator;