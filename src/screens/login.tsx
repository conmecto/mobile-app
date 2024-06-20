import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { COLOR_CODE, ERROR_CODES } from '../utils/enums';
//import findNumber from '../api/find.number';
import verifyOtp from '../api/otp.verify';
import TopBar from '../components/top.bar';
import environments from '../utils/environments';
import { setAccessToken } from '../utils/token';
import { saveToken, getToken } from '../utils/helpers';
import { setUserId } from '../utils/user.id';

type LoginObj = {
  appleAuthUserId?: string,
  appleAuthToken?: string,
  deviceToken?: string
}

FontAwesome.loadFont();

const { height, width } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  //const numberRegex = new RegExp(/^[0-9]*$/);
  //const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  //const extension = '+91';
  const [loginObj, setLoginObj] = useState<LoginObj>({});
  const [loginError, setLoginError] = useState('');
  const [loginUser, setLoginUser] = useState(false);
  useEffect(() => {
    let check = true;
    let timerId: NodeJS.Timeout;
    const callLogin = async () => {
      const res = await verifyOtp(loginObj);
      if (check) {
        setLoginObj({});
        setLoginUser(false);
        if (res && res.errorCode && res.errorCode === ERROR_CODES.TOKEN_INVALID) {
          setLoginError('Invalid token, please retry with same apple id you used for creating user');
          timerId = setTimeout(() => navigation.navigate('WelcomeScreen'), 3000);
        } else if (res && res.errorCode && res.errorCode === ERROR_CODES.USER_NOT_FOUND) {
          setLoginError('User not found, Please sign up first');
          timerId = setTimeout(() => navigation.navigate('WelcomeScreen'), 3000);
        } else if (res && res.data) {
          const userId = res.data[0].userId as number;
          const key = userId + ':auth:token';
          await Promise.all([
            saveToken('userId', userId?.toString()),
            saveToken(key, JSON.stringify({ refresh: res.data[0].refresh }))
          ]);
          setUserId(userId);
          setAccessToken(res.data[0].access as string);
          setLoginError('');
          navigation.replace('HomeTabNavigator'); 
        } else {
          setLoginError('');
          navigation.navigate('ContactAdminScreen');
        }
      }
    }
    if (loginUser) {
      callLogin();
    }
    return () => {
      clearTimeout(timerId);
      check = false;
    }
  }, [loginUser]);

  const onAppleButtonPress = async () => {
    try {
      if (loginObj.appleAuthToken) {
        return;
      }
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: []
      });
      if (!appleAuthRequestResponse.identityToken || !appleAuthRequestResponse.user) {
        throw new Error();
      } else {
        const deviceTokenObj = await getToken('deviceToken');
        setLoginObj({ 
          appleAuthUserId: appleAuthRequestResponse.user,
          appleAuthToken: appleAuthRequestResponse.identityToken,
          ...(deviceTokenObj ? { deviceToken: deviceTokenObj.password } : {})
        });
        setLoginUser(true);
      }
    } catch(error) {
      if (environments.appEnv !== 'prod') {
        console.log('Apple sign in error', error);
      }
      setLoginError('Something went wrong, please retry or contact admin@conmecto.com');
    }
  }

  return (
    <View style={{ flex: 1 }}>  
      <TopBar />
      <View style={styles.container}>
        <View style={styles.hiContainer}>
          <Text style={styles.hiText}>Hi There!</Text>
          <Text style={styles.hiText}>Welcome back! 😁</Text>
        </View>   
        <View style={styles.signinContainer}>
          <Text style={styles.errorTextStyle} numberOfLines={1} adjustsFontSizeToFit>{loginError}</Text>
          <Text>{'\n'}{'\n'}</Text>
          <AppleButton 
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: width * 0.5,
              height: height * 0.07
            }}
            onPress={() => onAppleButtonPress()}
          />
        </View>       
      </View>
    </View>
  )
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    //borderWidth: 1
  },

  signinContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //paddingBottom: 50,
    //borderWidth: 1
  },

  errorTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_CODE.BRIGHT_RED
  },

  hiContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1
  },
  hiText: {
    //fontWeight: '',
    fontSize: 25,
    padding: 2,
    //color: COLOR_CODE.BLACK
  },
});
