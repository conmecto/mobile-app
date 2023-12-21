import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Dimensions, StyleSheet, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLOR_CODE, ERROR_CODES } from '../utils/enums';
import { getAge } from '../utils/helpers';
import findNumber from '../api/find.number';
import { IMAGE_LOGO } from '../files';

type SignupObj = {
  number?: string,
  name?: string,
  dob?: Date,
  country?: string,
}

type SignupErrors = {
  number?: string,
  name?: string,
  dob?: string,
}

FontAwesome.loadFont();

const { height, width } = Dimensions.get('window');

const SignupHomeScreen = ({ navigation }: any) => {
  const numberRegex = new RegExp(/^[0-9]*$/);
  const extension = '+91';
  const [signupObj, setSignupObj] = useState<SignupObj>({ country: 'india' });
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [numberCheck, setNumberCheck] = useState(false);

  useEffect(() => {
    let check = true;
    const callNumberCheck = async () => {
      const res = await findNumber('91', signupObj.number as string);
      if (check) {
        setNumberCheck(false);
        if (res?.userId) {
          setSignupObj({ ...signupObj, number: '' });
          setSignupErrors({ ...signupErrors, number: 'This number already exists' });
        } else if (res?.errorCode === ERROR_CODES.USER_NOT_FOUND) {
          navigation.navigate('SignupSecondScreen', { signupObj: JSON.stringify(signupObj) });
        } 
      }
    }
    if (numberCheck) {
      callNumberCheck();
    }
    return () => {
      check = false;
    }
  }, [numberCheck]);

  const onPressShowDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  }

  const onChangeNumber = (text: string) => {
    if (!numberRegex.test(text)) {
      setSignupErrors({ ...signupErrors, number: 'Only digits are allowed' });
    } else {
      if (text.length === 10) {
        setSignupErrors({ ...signupErrors, number: '' });
        setSignupObj({ ...signupObj, number: text });
      } else {
        setSignupErrors({ ...signupErrors, number: 'Number should have exactly 10 digits' });
      }
    }
  }

  const onChangeName = (text: string) => {
    if (text.length >= 2) {
      setSignupErrors({ ...signupErrors, name: '' });
      setSignupObj({ ...signupObj, name: text });
    } else {
      setSignupErrors({ ...signupErrors, name: 'Name should have atleast 2 characters' });
    }
  }

  const onChangeDob = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const age = getAge(selectedDate?.toISOString() as string);
    if (age >= 18) {
      setSignupObj({ ...signupObj, dob: selectedDate });
      setSignupErrors({ ...signupErrors, dob: '' });
    } else {
      setSignupErrors({ ...signupErrors, dob: 'Age should be 18 or above' });
    }
  };

  const onPressLogin = () => {
    setSignupObj({ country: 'india' });
    setSignupErrors({});
    setShowDatePicker(false);
    navigation.navigate('LoginScreen');
  }

  const onPressNext = () => {
    let errors: SignupErrors = {};
    if (!signupObj.number) {
      errors.number = 'Number is required';
    }
    if (!signupObj.name) {
      errors.name = 'Name is required';
    }
    if (signupObj.dob === undefined) {
      errors.dob = 'Date of birth is required';
    }
    if (Object.keys(errors).length) {
      setSignupErrors({ ...signupErrors, ...errors });
      return;
    }
    const checkErrors = Object.values(signupErrors).find(i => Boolean(i.length));
    if (!checkErrors) {
      setNumberCheck(true);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.logoMainContainer}>
        <Image source={ IMAGE_LOGO } style={styles.logo} />
        <Text style={{ fontSize: 50, fontWeight: '800', fontFamily: 'SavoyeLetPlain' }}>Conmecto</Text>
      </View>
      <View style={styles.signupMainContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name='user-plus' color={COLOR_CODE.OFF_WHITE} size={height * 0.05}/>
        </View>

        <View style={styles.phoneFieldContainer}>
          <View style={styles.phoneContainer}>
            <View style={styles.extensionContainer}>
              <Text style={styles.extensionText}>{extension}</Text>
            </View>
            <TextInput placeholder='Enter your number' style={styles.inputField} onChangeText={onChangeNumber}/>
          </View>
          <View style={styles.phoneErrorContainer}>
            <Text style={styles.numberErrorText}>{signupErrors?.number}</Text>
          </View>
        </View>

        <View style={styles.nameFieldContainer}>
          <TextInput placeholder='Name' style={styles.nameInput} onChangeText={onChangeName}/>
          <Text style={styles.nameErrorText}>{signupErrors?.name}</Text>
        </View>

        <View style={styles.dobFieldContainer}>
          { 
            showDatePicker ? 
            (
              <View>
                <RNDateTimePicker 
                  value={signupObj?.dob ? signupObj?.dob : new Date()} 
                  display='spinner'
                  onChange={onChangeDob} 
                  textColor={COLOR_CODE.OFF_WHITE}   
                  maximumDate={new Date()}
                  minimumDate={new Date(1950,0,1)}
                  style={styles.datePicker}
                />
                <TouchableOpacity onPress={onPressShowDatePicker} style={styles.closeDatePickerPressable}>
                  <Text style={styles.datePickerCloseText}>Select</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity onPress={onPressShowDatePicker} style={styles.datePickerPressable}>
                  <Text style={styles.datePickerText}>{signupObj.dob ? signupObj.dob?.toDateString() : 'Select date of birth'}</Text>
                </TouchableOpacity>
                <Text style={styles.dobErrorText}>{signupErrors?.dob}</Text>
              </View>
            )
          }
        </View>

        <View style={styles.nextOrLoginContainer}>
          <View style={styles.nextContainer}>
            <Text style={styles.confirmText}>Please confirm all the details before clicking next</Text>
            <Text style={styles.confirmText}>you cannot edit these options again.</Text>
            <Text style={styles.confirmText}></Text>
            <TouchableOpacity style={styles.nextPressable} onPress={onPressNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loginContainer}>
            <View>
              <Text style={styles.loginText}>Already have an account?  </Text>
            </View>
            <TouchableOpacity onPress={onPressLogin}>
              <Text style={styles.loginPressableText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default SignupHomeScreen;

const styles = StyleSheet.create({
  logoMainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },

  signupMainContainer: {
    flex: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLOR_CODE.BRIGHT_BLUE,
  },

  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },

  phoneFieldContainer: {
    flex: 2,
    // borderWidth: 1,
    // borderColor: 'black'
  },
  phoneContainer: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  phoneErrorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  extensionContainer: {
    height: '60%',
    width: '20%',
    backgroundColor: COLOR_CODE.LIGHT_GREY,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
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
    height: '60%',
    width: '60%',
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    fontSize: 20
  },
  numberErrorText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },

  nameFieldContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  nameInput: {
    height: '50%',
    width: '80%',
    borderRadius: 20,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    fontSize: 20
  },
  nameErrorText: {
    paddingTop: 5,
    fontSize: 15,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },

  dobFieldContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePicker: {
    flex: 1,
  },
  closeDatePickerPressable: {
    height: height * 0.03,
    width: width * 0.2,
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_CODE.BRIGHT_RED,
  },
  datePickerCloseText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },
  datePickerPressable: {
    height: height * 0.07,
    width: width * 0.5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_CODE.LIGHT_GREY,
  },
  datePickerText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },
  dobErrorText: {
    paddingTop: 10,
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },

  nextOrLoginContainer: {
    flex: 2,
  },
  loginContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  nextContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  nextPressable: {
    height: '50%',
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: COLOR_CODE.BRIGHT_RED,
    // borderWidth: 1,
    // borderColor: 'black'
  },
  nextText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },
  loginPressableText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE,
    textDecorationLine: 'underline'
  },
  loginText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },
  confirmText: {
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: COLOR_CODE.BLACK
  },

  logo: {
    height: height * 0.15,
    width: height * 0.15
  }
});
