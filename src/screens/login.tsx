import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Dimensions, StyleSheet, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLOR_CODE, ERROR_CODES } from '../utils/enums';
import resendOtp from '../api/resend.otp';
import { IMAGE_LOGO } from '../files';

FontAwesome.loadFont();

const { height, width } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const numberRegex = new RegExp(/^[0-9]*$/);
  const extension = '+91';
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [numberError, setNumberError] = useState<string>('');
  const [sendOtp, setSendOtp] = useState(false);

  useEffect(() => {
    let check = true;
    const callLogin = async () => {
      const res = await resendOtp(extension, phoneNumber);
      if (check) {
        setSendOtp(false);
        setPhoneNumber('');
        if (res) {
          if (res.token) {
            setNumberError('');
            navigation.navigate('CodeVerificationScreen', { extension, number: phoneNumber, token: res.token });
          } else if (res?.errorCode === ERROR_CODES.USER_NOT_FOUND){
            setNumberError('User with this number not found');
          } else if (res?.errorCode === ERROR_CODES.OTP_RESEND_LIMIT) {
            setNumberError('');
            navigation.navigate('ContactAdminScreen', { error: 'OTP resend max attempts reached' });
          }
        } else {
          setNumberError('');
        }
      }
    }
    if (sendOtp && phoneNumber.length && numberError.length === 0) {
      callLogin();
    }
    return () => {
      check = false;
    }
  }, [sendOtp]);

  const onChangeText = (text: string) => {
    if (!numberRegex.test(text)) {
      setNumberError('Only digits are allowed');
    } else {
      if (text.length === 10) {
        setNumberError('');
        setPhoneNumber(text);
      } else {
        setNumberError('Number should have exactly 10 digits');
      }
    }
  }

  const onPressSignup = () => {
    setPhoneNumber('');
    setNumberError('');
    navigation.navigate('SignupHomeScreen');
  }

  const onPressSend = () => {
    if (phoneNumber.length && numberError.length === 0) {
      setSendOtp(true);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.logoMainContainer}>
        <Image source={ IMAGE_LOGO } style={styles.logo} />
        <Text style={{ fontSize: 50, fontWeight: '800', fontFamily: 'SavoyeLetPlain' }}>Conmecto</Text>
      </View>
      <View style={styles.loginMainContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name='mobile' size={height * 0.1} color={COLOR_CODE.OFF_WHITE}/>
          <FontAwesome name='commenting-o' size={height * 0.05} color={COLOR_CODE.OFF_WHITE} style={{ paddingLeft: 10 }}/>
        </View>

        <View style={styles.inputMainContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.extensionContainer}>
              <Text style={styles.extensionText}>{extension}</Text>
            </View>
            <TextInput placeholder='Enter your number' style={styles.inputField} onChangeText={onChangeText}/>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.numberErrorText}>{numberError}</Text> 
            <Text style={styles.infoText}>We need to send you a OTP </Text>
            <Text style={styles.infoText}>to verify your mobile number</Text>
          </View>
        </View>

        <View style={styles.sendContainer}>
          <TouchableOpacity style={styles.sendPressable} onPress={onPressSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={styles.signupText}>Don't have an account yet? </Text>
            </View>
            <TouchableOpacity onPress={onPressSignup}>
              <Text style={styles.signupPressableText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  logoMainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },

  loginMainContainer: {
    flex: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLOR_CODE.BRIGHT_BLUE,
  },

  iconContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: 'black'
  },

  inputMainContainer: {
    flex: 2,
    // borderWidth: 1,
    // borderColor: 'black'
  },
  inputContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  extensionContainer: {
    height: '75%',
    width: '20%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: COLOR_CODE.LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  extensionText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLOR_CODE.OFF_WHITE
  },
  inputField: {
    height: '75%',
    width: '60%',
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    fontSize: 20
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },
  numberErrorText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black'
  },

  sendContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  sendPressable: {
    height: '50%',
    width: '30%',
    borderRadius: 30,
    backgroundColor: COLOR_CODE.BRIGHT_RED,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  sendText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_CODE.OFF_WHITE
  },

  signupContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  signupPressableText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE,
    textDecorationLine: 'underline'
  },
  signupText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },

  logo: {
    height: height * 0.15,
    width: height * 0.15
  }
});
