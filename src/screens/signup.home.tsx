import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { Button, Checkbox, Modal, Portal, Provider } from 'react-native-paper';
import { getCountry } from "react-native-localize";
import { COLOR_CODE } from '../utils/enums';
//import findNumber from '../api/find.number';
import TopBar from '../components/top.bar';
import TermsItem from '../components/terms'
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
  const [showTerms, setShowTerms] = useState(false);
  
  const onPressTerms = () => {
    setSignupObj({ ...signupObj, termsAccepted: !signupObj.termsAccepted })
  }

  const onPressNextHandler = () => {
    let error = '';
    if (!signupObj.appleAuthToken) {
      error = 'Apple sign in error, Please retry';
    }
    if (!signupObj.termsAccepted) {
      error = 'Please read and accept the Term and Conditions';
    }
    if (error) {
      setSignupError(error);
    } else {
      navigation.navigate('SignupSecondScreen', { signupObj: JSON.stringify(signupObj) });
    }
  }
  const onAppleButtonPress = async () => {
    try {
      if (signupObj.appleAuthToken) {
        return;
      }
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
      });
      if (!appleAuthRequestResponse.identityToken || !appleAuthRequestResponse.user) {
        throw new Error();
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
          ...(deviceTokenObj ? { deviceToken: deviceTokenObj.password } : {})
        });
        setSignupError('');
      }
    } catch(error) {
      if (environments.appEnv !== 'prod') {
        console.log('Apple sign in error', error);
      }
      setSignupError('Something went wrong, please retry');
    }
  }

  return (
    <View style={{ flex: 1 }}>  
      <TopBar />
      <Provider>
        <Portal>
          <Modal visible={showTerms} onDismiss={() => setShowTerms(false)} contentContainerStyle={styles.modalContainer}>
            <TermsItem />
          </Modal>
        </Portal>
        <View style={styles.container}>          
          <View style={styles.signinContainer}>
            <Text style={styles.errorTextStyle} numberOfLines={1} adjustsFontSizeToFit>{signupError}</Text>
            <Text>{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</Text>
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
          <View style={styles.termsContainer}>
            <View style={styles.termsCheckBox}>
              <Checkbox
                status={signupObj.termsAccepted ? 'checked' : 'unchecked'}
                onPress={onPressTerms}
                color={COLOR_CODE.BRIGHT_BLUE}
              />
            </View>
            <View>
              <Button mode='text' onPress={() => setShowTerms(true)} textColor={COLOR_CODE.GREY} labelStyle={styles.termsText}>
                Terms and Privacy Policy
              </Button>
            </View>
          </View>
          <View style={styles.nextContainer}>
            <Button mode='outlined' onPress={onPressNextHandler} labelStyle={styles.nextButtonText}>Next</Button>
          </View>
        </View>
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

  signinContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    //paddingBottom: 50,
    //borderWidth: 1
  },

  termsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    //borderWidth: 1
  },

  nextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
    //borderWidth: 1
  },

  modalContainer: { 
    backgroundColor: COLOR_CODE.OFF_WHITE, 
    height: height * 0.6, 
    width: width * 0.8, 
    alignSelf: 'center', 
    borderRadius: 20 
  },

  termsText: { 
    textDecorationLine: 'underline', 
    fontWeight: 'bold' 
  },

  errorTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_CODE.BRIGHT_RED
  },

  termsCheckBox: { 
    transform: [{ scale: 0.8 }], 
    borderWidth: 0.5, 
    borderRadius: 50 
  },

  nextButtonText: {
    color: COLOR_CODE.BRIGHT_BLUE
  }
});
