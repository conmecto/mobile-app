import React, { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';
import { unlink } from 'react-native-fs';
import { COLOR_CODE, ChatSocketEvents } from '../utils/enums';
import environments from '../utils/environments';
import requestSignedUrl from '../api/request.signed.url';
import { getUserId } from '../utils/user.id';
import { getFileType } from '../utils/helpers';
import { sendFileAsMessage } from '../sockets/chat.socket';
import Loading from '../components/loading';

type RouteParams = { 
  capturedPhoto: {
    path: string, 
    height: number,
    width: number
  },
  matchId: number,
  matchedUserId: number
}

const ChatCapturedCameraScreen = ({ route, navigation }: any) => { 
  const userId = getUserId() as number;
  const { capturedPhoto, matchId, matchedUserId }: RouteParams = route.params;
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [keyboardEnabled, setKeyboardEnabled] = useState(false);
  const [sendFile, setSendFile] = useState(false);
  
  useEffect(() => {
    let check = true;
    const callSendImage = async () => {
      const fileName = capturedPhoto.path.split('/').pop() as string;
      const fileType = getFileType(fileName.split('.').pop() as string) as string;
      const res = await requestSignedUrl({ userId, fileName, contentType: fileType });
      let uploadError = '';
      if (check && res?.url) {
        const result = await fetch(capturedPhoto.path);
        const file = await result.blob();
        try {
          const url = res.url as string;
          const key = url.split('?')?.shift() as string; 
          const uploadRes = await fetch(url,  {
              method: 'PUT',
              headers: {
                  'Content-Type': fileType,
              },
              body: file
          });
          if (uploadRes.status === 200)  {
            const data = {
              key,
              name: fileName,
              mimetype: fileType,
              size: file.size, 
              height: capturedPhoto.height,
              width: capturedPhoto.width,
              message: message || '',
              event: ChatSocketEvents.SAVE_FILE,
              matchId,
              matchedUserId,
              userId
            }
            sendFileAsMessage(data);
            unlink(capturedPhoto.path)
              .then()
              .catch((err) => {
              if (environments.appEnv !== 'prod') {
                console.log('file delete error');
              }
              });
            navigation.navigate('MatchHomeScreen');
          }
        } catch(error) {
          uploadError = 'Something went wrong, please retry!';
          if (environments.appEnv !== 'prod') {
            console.log('Send file error', error);
          }
        }
        setSendFile(false);
        setError(uploadError);      
      }
    }
    if (sendFile && matchId && matchedUserId && capturedPhoto.path && !error) {
      callSendImage();
    }
    return () => {
      check = false;
    }
  }, [sendFile]);
  
  const onPressRetake = () => {
    unlink(capturedPhoto.path)
    .then()
    .catch((err) => {
      if (environments.appEnv !== 'prod') {
        console.log('file delete error');
      }
    });
    navigation.goBack();
  }

  const onChangeText = (value: string) => {
    if (value.length > 100) {
      setError('Caption character limit is 100');
    } else {
      setError('');
      setMessage(value);
    } 
  }

  const onPressSend = () => {
    setError('');
    setSendFile(true);
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      {
        sendFile ? 
        (<Loading />) : (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled={keyboardEnabled}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedPhoto.path }} style={styles.image} />
            </View>
            <View style={styles.detailsContainer}>
              <View style={{ flex: 0, alignItems: 'center' }}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.errorText}>
                  {error}
                </Text>
              </View>
              <View style={styles.commonContainer}>
                <TextInput
                  placeholder='Add Caption'
                  value={message}
                  onChangeText={text => onChangeText(text)}
                  style={styles.captionInput}
                  onFocus={() => setKeyboardEnabled(true)}
                  onSubmitEditing={() => setKeyboardEnabled(false)}
                />
              </View>
              <View style={styles.actionContainer}>
                {
                  !keyboardEnabled && 
                  (
                    <Button mode='contained' buttonColor={COLOR_CODE.RED} onPress={() => onPressRetake()}>
                      Retake
                    </Button>
                  )
                }
                {
                  !keyboardEnabled && 
                  (
                    <Button mode='contained' buttonColor={COLOR_CODE.BLACK} onPress={() => onPressSend()}>
                      Send 📸
                    </Button>
                  )
                }
              </View>
            </View>
          </KeyboardAvoidingView>
        )
      }
    </SafeAreaView>
  );
}

export default ChatCapturedCameraScreen;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLOR_CODE.BLACK },
  imageContainer: { flex: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR_CODE.BLACK },
  image: { height: '95%', width: '95%', borderRadius: 20, borderColor: COLOR_CODE.OFF_WHITE },
  captionInput: { 
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_CODE.BRIGHT_BLUE    
  },
  detailsContainer: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: COLOR_CODE.OFF_WHITE },
  errorText: { color: COLOR_CODE.BRIGHT_RED, fontSize: 10, fontWeight: 'bold' },
  commonContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  actionContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }
});