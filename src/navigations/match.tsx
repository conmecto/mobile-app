import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchHomeScreen from '../screens/match.home';
import MatchChatScreen from '../screens/match.chat';
import CommonProfileScreen from '../screens/common.profile';
import ViewPostScreen from '../screens/view.post';
// import NoMatchScreen from '../screens/no.match';
import CameraScreen from '../screens/camera';
import CapturedCameraScreen from '../screens/captured.camera';
import UploadFileScreen from '../screens/upload.file';

const MatchStack = createNativeStackNavigator();

const MatchNavigator = ({ params }: any) => {
  return (
    <MatchStack.Navigator initialRouteName='MatchHomeScreen'>
      <MatchStack.Screen name='MatchHomeScreen' component={MatchHomeScreen} options={{ headerShown: false }} initialParams={params} />
      <MatchStack.Screen name='MatchChatScreen' component={MatchChatScreen} options={{ headerShown: false }} initialParams={params}/>
      <MatchStack.Screen name='CommonProfileScreen' component={CommonProfileScreen} options={{ headerShown: false }} initialParams={params}/>
      <MatchStack.Screen name='ViewPostScreen' component={ViewPostScreen} options={{ headerShown: false }} initialParams={params}/>
      {/* <MatchStack.Screen name='NoMatchScreen' component={NoMatchScreen} options={{ headerShown: false }} initialParams={params}/> */}
      <MatchStack.Screen name='CameraScreen' component={CameraScreen} options={{ headerShown: false }} initialParams={params}/>
      <MatchStack.Screen name='CapturedCameraScreen' component={CapturedCameraScreen} options={{ headerShown: false, gestureEnabled: false }}/>
      <MatchStack.Screen name='UploadFileScreen' component={UploadFileScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </MatchStack.Navigator>
  );
}

export default MatchNavigator;