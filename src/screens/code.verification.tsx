import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ERROR_CODES, COLOR_CODE } from '../utils/enums';
import { saveToken, getToken } from '../utils/helpers';
import verifyCode from '../api/otp.verify';
import resendOtp from '../api/resend.otp';
import { IMAGE_LOGO } from '../files';
import { setUserId } from '../utils/user.id';
import { setAccessToken } from '../utils/token';

type VerifyOtpRes = {
  error?: string,
  errorCode?: string,
  userId?: number,
  access?: string,
  refresh?: string
}

FontAwesome.loadFont();
const { height, width } = Dimensions.get('window');

const CodeVerificationScreen = ({ navigation, route }: any) => {
  //const { extension, number } = route.params;
  const { email } = route.params;
  const numberRegex = new RegExp(/^[0-9]*$/);
  const [token, setToken] = useState(route.params.token);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [sendOtp, setSendOtp] = useState(false);
  const [showResendTimer, setShowResendTimer] = useState(true);
  const [resendTimerCount, setResendTimerCount] = useState(60);

  const handleLoginSuccess = async (res: VerifyOtpRes) => {
    const userId = res.userId as number;
    const key = userId + ':auth:token';
    await Promise.all([
      saveToken('userId', userId?.toString()),
      saveToken(key, JSON.stringify({ refresh: res.refresh }))
    ]);
    setUserId(userId);
    setAccessToken(res.access as string);
    navigation.navigate('HomeScreen');
  }

  useEffect(() => {
    let check = true;
    const callLogin = async () => {
      const res = await resendOtp(email);
      if (check) {
        setSendOtp(false);
        if (res) {
          if (res.token) {
            setShowResendTimer(true);
            setResendTimerCount(60);
            setToken(res.token);
          } else if (res?.errorCode === ERROR_CODES.OTP_RESEND_LIMIT) {
            navigation.navigate('ContactAdminScreen', { error: 'OTP resend max attempts reached' });
          }
        } 
      }
    }
    if (sendOtp) {
      callLogin();
    }
    return () => {
      check = false;
    }
  }, [sendOtp]);

  useEffect(() => {
    if (showResendTimer) {
      const timerId = setInterval(() => {
        setResendTimerCount(prevResendTimerCount => {
          if (prevResendTimerCount <= 1) {
            clearInterval(timerId); 
            setShowResendTimer(false);
          }
          return prevResendTimerCount - 1;
        });
      }, 1000);
      return () => {
        clearInterval(timerId);
      }
    }
  }, [showResendTimer]);

  useEffect(() => {
    let check = true;
    const callVerify = async () => {
      let deviceToken: string | undefined;
      const deviceTokenObj = await getToken('deviceToken');
      if (deviceTokenObj) {
        deviceToken = deviceTokenObj.password;
      }
      const res = await verifyCode(email, Number(otp), token, deviceToken);
      if (check) {
        setOtp('');
        setVerifyOtp(false);
        if (res) {
          if (res?.access) {
            setOtpError('');
            handleLoginSuccess(res);
          } else if (res.errorCode === ERROR_CODES.OTP_INVALID) {
            setOtpError('Invalid OTP');
          } else if (res.errorCode === ERROR_CODES.OTP_VALIDATION_ATTEMPTS_LIMIT) {
            setOtpError('');
            navigation.navigate('ContactAdminScreen', { error: 'OTP validation max attempts reached' });
          }
        } else {
          setOtpError('');
        }
      }
    }
    if (verifyOtp && otp.length && otpError.length === 0) {
      callVerify();
    }
    return () => {
      check = false;
    }
  }, [verifyOtp]);

  const onChangeText = (text: string) => {
    if (!numberRegex.test(text)) {
      setOtpError('Only digits are allowed');
    } else {
      if (text.length === 6) {
        setOtpError('');
        setOtp(text);
      } else {
        setOtpError('OTP should have exactly 6 digits');
      }
    }
  }

  const onPressVerify = () => {
    if (otp && otpError.length === 0) {
      setVerifyOtp(true);
    }
  }

  const onPressResend = () => {
    if (!showResendTimer && resendTimerCount === 0) {
      setSendOtp(true);
    }
  }
 
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.logoMainContainer}>
        <Image source={ IMAGE_LOGO } style={styles.logo} />
        <Text style={{ fontSize: 50, fontWeight: '800', fontFamily: 'SavoyeLetPlain' }}>Conmecto</Text>
      </View>
      <View style={styles.verifyMainContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name='mobile' size={height * 0.1} color={COLOR_CODE.OFF_WHITE}/>
          <FontAwesome name='commenting-o' size={height * 0.05} color={COLOR_CODE.OFF_WHITE} style={{ paddingLeft: 10 }}/>
        </View>
        
        <View style={styles.inputMainConatiner}>
          <View style={styles.inputContainer}> 
            <View style={styles.inputLayout}>
              <TextInput placeholder='OTP' style={styles.otpInput} onChangeText={onChangeText}/>
            </View>
          </View>
          <Text style={styles.otpErrorText}>{otpError}</Text>
          <View style={styles.verifyConatiner}>
            <TouchableOpacity style={styles.verifyPressable} onPress={onPressVerify}> 
              <Text style={styles.verifyText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resendMainconatiner}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={styles.resendText}>Did not receive the OTP? </Text>
            </View>
            {
              showResendTimer && resendTimerCount >= 1 ?
              (
                <View>
                  <Text style={styles.resendText}>Resend in {resendTimerCount}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={onPressResend}>
                  <Text style={styles.resendPressableText}>Resend</Text>
                </TouchableOpacity>
              )
            }            
          </View>
        </View>
      </View>
    </View>
  );
}

export default CodeVerificationScreen;

const styles = StyleSheet.create({
  logoMainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },

  verifyMainContainer: {
    flex: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLOR_CODE.BRIGHT_BLUE,
  },

  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: 'black'
  },

  inputMainConatiner: {
    flex: 1
  },

  otpErrorText: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: COLOR_CODE.BLACK
  },

  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  inputLayout: {
    height: height * 0.06,
    width: width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_CODE.OFF_WHITE,
    borderRadius: 20,
  },
  otpInput: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  verifyConatiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  verifyPressable: {
    height: height * 0.05,
    width: width * 0.3,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: COLOR_CODE.BRIGHT_RED
  },
  verifyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_CODE.OFF_WHITE
  },

  resendMainconatiner: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  resendPressableText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE,
    textDecorationLine: 'underline'
  },
  resendText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },

  logo: {
    height: height * 0.15,
    width: height * 0.15
  }
});