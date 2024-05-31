import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Camera, CameraDevice, CameraPosition, getCameraDevice, useCameraFormat } from 'react-native-vision-camera';
import { Modal, Provider, Portal, Button } from 'react-native-paper';
import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';
import { Linking } from 'react-native';
import { COLOR_CODE } from '../utils/enums';
import environments from '../utils/environments';

type RouteParams = {
  commonScreen: boolean,
  matchId: number,
  matchedUserId: number
}

Ionicons.loadFont();
MaterialCommunityIcons.loadFont();
const { height, width } = Dimensions.get('window');

const CameraScreen = ({ navigation, route }: any) => {
  const { commonScreen, matchId, matchedUserId }: RouteParams = route.params;
  const camera = useRef<Camera>(null);
  const [flash, setFlash] = useState(false);
  const [cameraPos, setCameraPos] = useState('back');
  const isFocused = useIsFocused()
  const appState = useAppState()
  const isActive = isFocused && appState === 'active';
  const devices = Camera.getAvailableCameraDevices();
  const device = getCameraDevice(devices, cameraPos as CameraPosition);
  const format = useCameraFormat(device, [
    { photoResolution: { height: 720, width: 1280 } }
  ]);

  const onPressImage = () => {
    setFlash(false);
    navigation.navigate('AddFileScreen');
  }

  const onPressFlash = () => {
    setFlash(!flash);
  }
  const onPressSetCameraPos = () => {
    if (cameraPos === 'back') {
      setFlash(false);
      setCameraPos('front');
    } else {
      setCameraPos('back');
    }
  }
  const onPressCapture = async () => {
    if (camera?.current) {
      const capturedPhoto = await camera.current.takePhoto();
      if (capturedPhoto) {
        if (flash) {
          setFlash(false);
        }
        if (commonScreen) {
          navigation.navigate('ChatCapturedCameraScreen', { 
            matchId, 
            matchedUserId,
            capturedPhoto: { 
              path: capturedPhoto.path, 
              height: capturedPhoto.height, 
              width: capturedPhoto.width 
            } 
          });
        } else {
          navigation.navigate('CapturedCameraScreen', { 
            capturedPhoto: { 
              path: capturedPhoto.path, 
              height: capturedPhoto.height, 
              width: capturedPhoto.width 
            } 
          });
        }
      }
    }
  }
  const cameraPermission = Camera.getCameraPermissionStatus();
  const linkToCameraSetting = async () => {
    try {
      await Linking.openSettings();
    } catch(error) {
      if (environments.appEnv !== 'prod') {
        console.log('linking error', error);
      }
    }
  };
  let showSettingModal = false;
  const requestPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    if (newCameraPermission === 'denied') {
      showSettingModal = true;
    }
  }
  if (cameraPermission === 'denied') {
    showSettingModal = true;
  } else if (cameraPermission === 'not-determined') {
    requestPermission().then().catch();
  }

  return (
    <View style={styles.mainContainer}>
      <Provider>
        <Portal>
          <Modal visible={showSettingModal} contentContainerStyle={styles.modalContainer}>
            <View style={styles.requestCameraContainer}>
              <Text numberOfLines={2} adjustsFontSizeToFit style={{ fontSize: 12, fontWeight: 'bold' }}>
                Please enable Camera 📷 access from the Settings{'\n'}
              </Text>
              <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={() => linkToCameraSetting()} style={{ width: '50%', alignSelf: 'center' }}>
                Setting
              </Button>
            </View>
          </Modal>
        </Portal>
        <Camera 
          torch={flash ? 'on' : 'off'}
          ref={camera}
          style={{ flex: 1 }}
          device={device as CameraDevice}
          isActive={isActive}
          format={format}
          photo={true}
          onError={(error) => {
            if (environments.appEnv !== 'prod') {
              console.log('Cannot use camera', error)
            }
          }}
        />
        {
          !showSettingModal && 
          <View style={styles.cameraIconsContainer}>
            <TouchableOpacity onPress={() => onPressFlash()} style={styles.flashIcon}>
              <Ionicons name={ flash ? 'flash' : 'flash-off' } color={COLOR_CODE.BLACK} size={30} />  
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressCapture()} style={styles.captureIcon}>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressSetCameraPos()} style={styles.syncIcon}>
              <Ionicons name='sync' color={COLOR_CODE.BLACK} size={30} />  
            </TouchableOpacity>
          </View>
        }
        {
          !showSettingModal && 
          !commonScreen && 
          <View style={styles.uploadIconContainer}>
            <TouchableOpacity onPress={() => onPressImage()} style={styles.plusIcon}>
              <Ionicons name='images' color={COLOR_CODE.OFF_WHITE} size={35} />  
            </TouchableOpacity>
          </View>
        }
      </Provider>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, backgroundColor: COLOR_CODE.OFF_WHITE
  },
  requestCameraContainer: { flex: 1, alignItems: 'center', justifyContent: 'space-evenly' },
  cameraIconsContainer: { 
    flex: 0, 
    position: 'absolute', 
    width, 
    height: height * 0.1, 
    bottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    alignItems: 'center' 
  },
  modalContainer: { 
    backgroundColor: COLOR_CODE.OFF_WHITE, 
    height: height * 0.2, 
    width: width * 0.5,
    alignSelf: 'center', 
    borderRadius: 30 
  },
  flashIcon: { height: 50, width: 50, borderRadius: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR_CODE.OFF_WHITE, borderWidth: 2, borderColor: COLOR_CODE.LIGHT_GREY },
  captureIcon: { height: 75, width: 75, borderRadius: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR_CODE.OFF_WHITE, borderWidth: 5, borderColor: COLOR_CODE.LIGHT_GREY },
  syncIcon: { height: 50, width: 50, borderRadius: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR_CODE.OFF_WHITE, borderWidth: 2, borderColor: COLOR_CODE.LIGHT_GREY },
  uploadIconContainer: { 
    flex: 0, 
    position: 'absolute', 
    width: 50, 
    height: 50, 
    top: 50, 
    right: 10,
  },
  plusIcon: { 
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
  },
});