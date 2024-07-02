import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from '../screens/camera';
import CapturedCameraScreen from '../screens/captured.camera';
import UploadFileScreen from '../screens/upload.file';
import AddFileScreen from '../screens/add.file';
import TagsScreen from '../screens/tags';

const CameraStack = createNativeStackNavigator();

const CameraNavigator = ({ params }: any) => {
  return (
    <CameraStack.Navigator initialRouteName='CameraScreen'>
      <CameraStack.Screen name='CameraScreen' 
        component={CameraScreen} options={{ headerShown: false }} 
        initialParams={{ commonScreen: false, matchId: null, matchedUserId: null }}
      />
      <CameraStack.Screen name='AddFileScreen' 
        component={AddFileScreen} options={{ headerShown: false }}
      />
      <CameraStack.Screen name='CapturedCameraScreen' 
        component={CapturedCameraScreen} options={{ headerShown: false, gestureEnabled: false }}
      />
      <CameraStack.Screen name='TagsScreen' 
        component={TagsScreen} options={{ headerShown: false, gestureEnabled: false }}
      />
      <CameraStack.Screen name='UploadFileScreen' 
        component={UploadFileScreen} options={{ headerShown: false, gestureEnabled: false }}
      />
    </CameraStack.Navigator>
  );
}

export default CameraNavigator;