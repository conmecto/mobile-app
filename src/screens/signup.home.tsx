import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import { getCountry } from "react-native-localize";
import checkAccount from '../api/check.account';
//import findNumber from '../api/find.number';
import TopBar from '../components/top.bar';
import TermsItem from '../components/terms';
import PolicyItem from '../components/policy';
import Loading from '../components/loading';
import { COLOR_CODE } from '../utils/enums';
import environments from '../utils/environments';
import { getToken } from '../utils/helpers';

type SignupObj = {
  country: string,
  email?: string,
  name?: string,
  appleAuthToken?: string,
  termsAccepted?: boolean,
  appleAuthUserId?: string,
  deviceToken?: string
}

FontAwesome.loadFont();

const { height, width } = Dimensions.get('window');

const SignupHomeScreen = ({ navigation }: any) => {
  //const numberRegex = new RegExp(/^[0-9]*$/);
  //const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  //const extension = '+91';
  const country = getCountry()?.toLowerCase() || 'in';
  const [signupObj, setSignupObj] = useState<SignupObj>({ country: country });
  const [signupError, setSignupError] = useState('');
  const [showTerms, setShowTerms] = useState('');
  const [checkAccountExists, setCheckAccountExists] = useState(false);

  useEffect(() => {
    let check = true;
    const callCheck = async () => {
      const res = await checkAccount(signupObj.appleAuthUserId as string);
      if (check) {
        setCheckAccountExists(false);
        if (res && !res.deletedAt) {  
          setSignupError('We already have an Account connected to that Apple ID.');
        } else {
          if (res?.name) {
            signupObj.name = res.name;
          }
          navigation.navigate('SignupSecondScreen', { signupObj: JSON.stringify(signupObj) });
        }
      }
    }
    if (checkAccountExists && signupObj.appleAuthUserId) {
      callCheck();
    }
    return () => {
      check = false;
    }
  }, [checkAccountExists]);

  const onAppleButtonPress = async () => {
    try {
      setSignupError('');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
      });
      if (!appleAuthRequestResponse.identityToken || !appleAuthRequestResponse.user) {
        return;
      } else {
        let name = '';
        if (appleAuthRequestResponse.fullName?.givenName) {
          name += appleAuthRequestResponse.fullName?.givenName;
          if (appleAuthRequestResponse.fullName?.familyName) {
            name += (' ' + appleAuthRequestResponse.fullName?.familyName);
          }
          name = name.toLowerCase();
        }
        const deviceTokenObj = await getToken('deviceToken');
        setSignupObj({ 
          ...signupObj, 
          appleAuthToken: appleAuthRequestResponse.identityToken, 
          ...(appleAuthRequestResponse.email ? { email: appleAuthRequestResponse.email } : {}),
          name,
          appleAuthUserId: appleAuthRequestResponse.user,
          ...(deviceTokenObj ? { deviceToken: deviceTokenObj.password } : {}),
          termsAccepted: true
        });
        setCheckAccountExists(true);
      }
    } catch(error) {
      if (environments.appEnv !== 'prod') {
        console.log('Apple sign in error', error);
      }
    }
  }

  const onPressLogin = () => {
    setSignupObj({ country: country });
    setSignupError('');
    navigation.navigate('LoginScreen');
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
          checkAccountExists ? <Loading /> : 
          (
            <View style={styles.container}>
              <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>
                  Create your Account
                </Text>
              </View> 
              <View style={styles.termsContainer}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={styles.termsText}>
                  By continuing with Sign up, you agree to our
                </Text>
                <Button mode='text' onPress={() => setShowTerms('terms')} labelStyle={styles.linkText}>
                  Terms of Service
                </Button>
                <Text style={styles.termsText}>
                  And that you have read our  
                </Text>
                <Button mode='text' onPress={() => setShowTerms('policy')} labelStyle={styles.linkText}>
                  Privacy Policy
                </Button>
              </View>
              <View style={styles.signinContainer}>
                <AppleButton 
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_UP}
                  style={{
                    width: width * 0.6,
                    height: height * 0.07
                  }}
                  onPress={() => onAppleButtonPress()}
                />
              </View>
              <View style={styles.signupErrorContainer}>
                <Text style={styles.errorTextStyle} numberOfLines={3} adjustsFontSizeToFit>
                  {signupError}
                </Text>
              </View> 
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an Account? Please 
                </Text>
                <Button mode='text' onPress={onPressLogin} labelStyle={styles.linkText}>
                  Login
                </Button>
              </View> 
            </View>
          )
        }
      </Provider>
    </View>
  )
}

export default SignupHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  createAccountContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  createAccountText: { fontSize: 25, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_BLUE },

  signinContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //paddingBottom: 50
  },

  termsContainer: {
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

  termsText: { 
    fontSize: 16,
    color: COLOR_CODE.GREY,
    fontWeight: '700' 
  },

  linkText: { 
    fontSize: 16,
    color: 'black',
    textDecorationLine: 'underline', 
    fontWeight: 'bold' 
  },

  errorTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_CODE.BRIGHT_RED
  },

  loginContainer: { flex: 0.5, justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 15, color: COLOR_CODE.GREY, fontWeight: 'bold' },

  signupErrorContainer: { flex: 0.5, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }
});
