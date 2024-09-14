import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import { getCountry } from "react-native-localize";
import { pick } from 'lodash';
import verifyOtp from '../api/otp.verify';
import createUser from '../api/create.user';
import TopBar from '../components/top.bar';
import TermsItem from '../components/terms';
import PolicyItem from '../components/policy';
import Loading from '../components/loading';
import environments from '../utils/environments';
import { COLOR_CODE, ERROR_CODES } from '../utils/enums';
import { setAccessToken } from '../utils/token';
import { saveToken, getToken } from '../utils/helpers';
import { setUserId } from '../utils/user.id';
import { ThemeContext } from '../contexts/theme.context';

type SignupObj = {
  country?: string,
  email?: string,
  name?: string,
  appleAuthToken?: string,
  termsAccepted?: boolean,
  appleAuthUserId?: string,
  deviceToken?: string
}

FontAwesome.loadFont();

const { height, width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
  const { appTheme, setAppTheme } = useContext(ThemeContext);
  const country = getCountry()?.toLowerCase() || 'in';
  const [signupObj, setSignupObj] = useState<SignupObj>({ country: country });
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState('');
  const [loginFlow, setLoginFlow] = useState(false);
  const [continueSignupFlow, setContinueSignupFlow] = useState(false);

  useEffect(() => {
    let check = true;
    const callLogin = async () => {
      const loginRes = await verifyOtp(pick(signupObj, ['appleAuthToken', 'appleAuthUserId', 'deviceToken']));
      if (check) {
        setLoginFlow(false);
        if (loginRes && loginRes.errorCode && loginRes.errorCode === ERROR_CODES.TOKEN_INVALID) {
          setError('Invalid token, Please retry with same Apple ID you used for Creating the Account');
        } else if (loginRes && loginRes.errorCode && loginRes.errorCode === ERROR_CODES.USER_NOT_FOUND) {
          setContinueSignupFlow(true);
        } else if (loginRes && loginRes.data) {
          const userId = loginRes.data[0].userId as number;
          const key = userId + ':auth:token';
          await Promise.all([
            saveToken('userId', userId?.toString()),
            saveToken(key, JSON.stringify({ refresh: loginRes.data[0].refresh }))
          ]);
          setUserId(userId);
          setAccessToken(loginRes.data[0].access as string);
          setSignupObj({});
          navigation.replace('HomeTabNavigator'); 
        } else {
          navigation.navigate('ContactAdminScreen');
        }
      }
    }
    if (loginFlow && signupObj.appleAuthUserId) {
      callLogin();
    }
    return () => {
      check = false;
    }
  }, [loginFlow]);

  useEffect(() => {
    let check = true;
    const callCreateUser = async () => {
      const res = await createUser(signupObj);
      if (check) {
        setContinueSignupFlow(false);
        if (res?.errorCode === ERROR_CODES.TOKEN_INVALID) {
          setError('Token expired or invalid, Please retry');
        } else if (res?.data && res.data[0].userId) {
          const userId = res.data[0].userId as number;
          const key = userId + ':auth:token';
          await Promise.all([
            saveToken('userId', userId?.toString()),
            saveToken(key, JSON.stringify({ refresh: res.data[0].refresh }))
          ]);
          setUserId(userId);
          setAccessToken(res.data[0].access as string);
          setSignupObj({});
          navigation.replace('HomeTabNavigator');
        } else {
          navigation.navigate('ContactAdminScreen');
        }
      }
    }
    if (continueSignupFlow && !loginFlow &&signupObj.appleAuthUserId) {
      callCreateUser();
    }
    return () => {
      check = false;
    }
  }, [continueSignupFlow]);

  const onAppleButtonPress = async () => {
    try {
      setError('');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
      });
      if (!appleAuthRequestResponse.identityToken || !appleAuthRequestResponse.user) {
        return;
      } else {
        let fullName = '';
        if (appleAuthRequestResponse.fullName?.givenName) {
          fullName += appleAuthRequestResponse.fullName?.givenName;
          if (appleAuthRequestResponse.fullName?.familyName) {
            fullName += (' ' + appleAuthRequestResponse.fullName?.familyName);
          }
          fullName = fullName.toLowerCase();
        }
        const deviceTokenObj = await getToken('deviceToken');
        setSignupObj({ 
          ...signupObj, 
          appleAuthToken: appleAuthRequestResponse.identityToken, 
          ...(appleAuthRequestResponse.email ? { email: appleAuthRequestResponse.email } : {}),
          name: signupObj?.name || fullName,
          appleAuthUserId: appleAuthRequestResponse.user,
          ...(deviceTokenObj ? { deviceToken: deviceTokenObj.password } : {}),
          termsAccepted: true
        });
        setLoginFlow(true);
      }
    } catch(error) {
      if (environments.appEnv !== 'prod') {
        console.log('Apple sign in error', error);
      }
    }
  }

  const themeColors = appTheme === 'dark' ? {
    containerBackgroundColor: COLOR_CODE.BLACK,
    conmectoText: COLOR_CODE.OFF_WHITE,
    appleButtonColor: AppleButton.Style.WHITE
  } : {
    containerBackgroundColor: COLOR_CODE.OFF_WHITE,
    conmectoText: COLOR_CODE.BLACK,
    appleButtonColor: AppleButton.Style.BLACK
  }
  
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <Provider>
        <Portal>
          <Modal visible={Boolean(showTerms)} onDismiss={() => setShowTerms('')} contentContainerStyle={styles.modalContainer}>
            {
              showTerms === 'terms' ? <TermsItem /> : <PolicyItem />
            }
          </Modal>
        </Portal>
        { 
          (loginFlow || continueSignupFlow) ? <Loading /> :
          (
            <View style={[styles.container, { backgroundColor: themeColors.containerBackgroundColor }]}>
              <View style={styles.hiContainer}>
                <Text style={styles.hiText}>Hi there, Welcome to</Text>
                <Text style={[styles.conmectoText, { color: themeColors.conmectoText }]}>Conmecto 😁</Text>
                <Text style={styles.hiText}>We're thrilled to have you</Text>
                <Text style={styles.hiText}>join our community. 🎉</Text>
              </View>
              <View style={styles.signinContainer}>
                <AppleButton 
                  buttonStyle={themeColors.appleButtonColor}
                  buttonType={AppleButton.Type.SIGN_IN}
                  style={{
                    width: width * 0.7,
                    height: height * 0.07
                  }}
                  onPress={() => onAppleButtonPress()}
                />
              </View>
              {
                error && (
                  <View style={styles.signupErrorContainer}>
                    <Text style={styles.errorTextStyle} numberOfLines={3} adjustsFontSizeToFit>
                      {error}
                    </Text>
                  </View> 
                )
              }
              <View style={styles.termsContainer}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={styles.termsText}>
                  By continuing with Sign in, you agree to our
                </Text>
                <Button mode='text' onPress={() => setShowTerms('terms')} labelStyle={[styles.linkText, { color: themeColors.conmectoText }]}>
                  Terms of Service
                </Button>
                <Text style={styles.termsText}>
                  And that you have read our  
                </Text>
                <Button mode='text' onPress={() => setShowTerms('policy')} labelStyle={[styles.linkText, { color: themeColors.conmectoText }]}>
                  Privacy Policy
                </Button>
              </View>
            </View>
          )
        }
      </Provider>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  hiContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hiText: {
    fontSize: 25,
    padding: 2,
    color: COLOR_CODE.BRIGHT_BLUE,
    fontWeight: 'bold'
  },
  conmectoText: {
    fontSize: 25,
    padding: 2,
    fontWeight: 'bold',
  },

  termsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  termsText: { 
    fontSize: 16,
    color: COLOR_CODE.GREY,
    fontWeight: '700' 
  },
  linkText: { 
    fontSize: 16,
    textDecorationLine: 'underline', 
    fontWeight: 'bold' 
  },

  errorTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_CODE.BRIGHT_RED
  },
  signupErrorContainer: { flex: 0.5, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 },

  signinContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  modalContainer: { 
    backgroundColor: COLOR_CODE.OFF_WHITE, 
    height: height * 0.6, 
    width: width * 0.8, 
    alignSelf: 'center', 
    borderRadius: 20 
  },
});