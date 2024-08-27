import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
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
    const callLogin = async () => {
      const res = await verifyOtp(loginObj);
      if (check) {
        setLoginObj({});
        setLoginUser(false);
        if (res && res.errorCode && res.errorCode === ERROR_CODES.TOKEN_INVALID) {
          setLoginError('Invalid token, Please retry with same Apple ID you used for Creating the Account');
        } else if (res && res.errorCode && res.errorCode === ERROR_CODES.USER_NOT_FOUND) {
          setLoginError('We could not found an Account connected to that Apple ID. Please Create a new Account.');
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
      check = false;
    }
  }, [loginUser]);

  const onAppleButtonPress = async () => {
    try {
      setLoginError('');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: []
      });
      if (!appleAuthRequestResponse.identityToken || !appleAuthRequestResponse.user) {
        return;
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
    }
  }

  const onPressSignup = () => {
    setLoginObj({});
    setLoginUser(false);
    setLoginError('');
    navigation.navigate('SignupHomeScreen');
  }

  return (
    <View style={{ flex: 1 }}>  
      <TopBar />
      <View style={styles.container}>
        <View style={styles.hiContainer}>
          <Text style={styles.hiText}>Hi There, Welcome back! 😁</Text>
          <Text style={styles.hiText}>Login back to your Account</Text>
        </View>   
        <View style={styles.signinContainer}>
          <AppleButton 
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: width * 0.6,
              height: height * 0.07
            }}
            onPress={() => onAppleButtonPress()}
          />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTextStyle} numberOfLines={3} adjustsFontSizeToFit>
            {loginError}
          </Text>
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an Account yet? Please 
          </Text>
          <Button mode='text' onPress={onPressSignup} labelStyle={styles.linkText}>
            Signup
          </Button>
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
    color: COLOR_CODE.RED
  },

  hiContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1
  },
  hiText: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 2,
    color: COLOR_CODE.BRIGHT_BLUE
  },

  linkText: { 
    fontSize: 15,
    color: 'black',
    textDecorationLine: 'underline', 
    fontWeight: 'bold' 
  },

  signupContainer: { flex: 0.5, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 0.5, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 },
  signupText: { fontSize: 15, color: COLOR_CODE.GREY, fontWeight: 'bold' }
});
