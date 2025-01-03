import React, { useState } from 'react';
import { View, TextInput, Text, Dimensions, StyleSheet } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import { COLOR_CODE } from '../utils/enums';
import { getAge } from '../utils/helpers';
//import findNumber from '../api/find.number';
import TopBar from '../components/top.bar';

type SignupObj = {
  country: string,
  email?: string,
  name?: string,
  appleAuthToken?: string,
  termsAccepted?: boolean,
  appleAuthUserId?: string,
  dob?: Date,
  deviceToken?: string
}

Octicons.loadFont();

const { height, width } = Dimensions.get('window');

const SignupSecondScreen = ({ navigation, route }: any) => {
  //const numberRegex = new RegExp(/^[0-9]*$/);
  //const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  //const extension = '+91';
  const signupObj = JSON.parse(route.params.signupObj);
  const [signupObjSecondStage, setSignupObjSecondStage] = useState<SignupObj>({ ...signupObj });
  const [signupError, setSignupError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // const onChangeName = (text: string) => {
  //   setSignupObjSecondStage({ ...signupObjSecondStage, name: text.toLowerCase() });
  // }

  const onPressShowDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  } 

  const onChangeDob = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const age = getAge(selectedDate?.toISOString() as string);
    if (age >= 18) {
      setSignupObjSecondStage({ ...signupObjSecondStage, dob: selectedDate });
      setSignupError('');
    } else {
      setSignupError('Age should be 18 or above');
    }
  };

  const onPressNextHandler = () => {
    let error = '';
    // if (!signupObjSecondStage.name) {
    //   error = 'Please enter your full name';
    // }
    if (!signupObjSecondStage.dob) {
      error = 'Please enter your date of birth';
    }
    if (error) {
      setSignupError(error);
    } else {
      navigation.navigate('SignupThirdScreen', { signupObjSecondStage: JSON.stringify(signupObjSecondStage) });
    }
  }
  return (
    <View style={{ flex: 1 }}>  
      <TopBar />
      <View style={styles.container}>   
        <View style={styles.headerContainer}>
          <Text numberOfLines={2} adjustsFontSizeToFit style={styles.headerText}>
            Few Additional Information Required for a Personalized App Experience
          </Text>
          <Text>
          {'\n'} 
          </Text>
          <Text numberOfLines={2} adjustsFontSizeToFit style={styles.subHeaderText}>
            Date of Birth (It can't be changed later!)
          </Text>
        </View> 
        {/* <View style={styles.nameContainer}>
          <TextInput
            placeholder='Name'
            value={signupObjSecondStage.name}
            onChangeText={onChangeName}
            style={styles.nameInput}
          />
        </View> */}
        <View style={styles.dobContainer}>
          { 
            showDatePicker ? 
            (
              <View>
                <RNDateTimePicker 
                  value={signupObjSecondStage?.dob ? signupObjSecondStage?.dob : new Date()} 
                  display='spinner'
                  onChange={onChangeDob} 
                  textColor={COLOR_CODE.BLACK}   
                  maximumDate={new Date()}
                  minimumDate={new Date(1950,0,1)}
                  style={styles.datePicker}
                />
              </View>
            ) : (
              <Button mode='contained-tonal' onPress={onPressShowDatePicker} buttonColor={COLOR_CODE.LIGHT_GREY} style={styles.dobButton} labelStyle={{ color: COLOR_CODE.BLACK }}>
                {signupObjSecondStage.dob ? signupObjSecondStage.dob?.toDateString() : 'Select date of birth'}
              </Button>
            )
          }
        </View>
        <View style={styles.selectContainer}>
          { 
            showDatePicker &&
            (
              <Button mode='contained' onPress={onPressShowDatePicker} buttonColor={COLOR_CODE.BRIGHT_RED} style={styles.selectButton} labelStyle={{ color: COLOR_CODE.OFF_WHITE }}>
                Select
              </Button>
            )
          }
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTextStyle} numberOfLines={1} adjustsFontSizeToFit>{signupError}</Text>
        </View>       
        <View style={styles.nextContainer}>
          <Button mode='contained' onPress={onPressNextHandler} buttonColor={COLOR_CODE.BRIGHT_BLUE} labelStyle={styles.nextButtonText}>
            Next
          </Button>
        </View>
        <View style={styles.pageDotsMainContainer}>
          <View style={styles.pageDotsContainer}>
            <Octicons name='dot-fill' size={30} />
            <Octicons name='dot' size={30} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default SignupSecondScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  headerContainer: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  subHeaderText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.GREY },

  nameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    //paddingBottom: 50,
    // borderWidth: 1
  },

  dobContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1
  },

  errorContainer: { flex: 0.5, alignItems: 'center', justifyContent: 'center' },

  nextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1
  },

  errorTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_CODE.BRIGHT_RED
  },

  nextButtonText: {
    color: COLOR_CODE.OFF_WHITE
  },

  nameInput: { 
    height: '35%', 
    width: '70%', 
    backgroundColor: COLOR_CODE.LIGHT_GREY, 
    borderRadius: 10,
    padding: 5 
  },

  dobButton: {
    width: '70%', 
    borderRadius: 10,
  },

  datePicker: {
    flex: 1,
  },
  datePickerPressable: {
    height: height * 0.07,
    width: width * 0.5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_CODE.LIGHT_GREY,
  },

  selectButton: {
    alignSelf: 'center'
  },

  pageDotsMainContainer: { flex: 0.5, justifyContent: 'center', alignItems: 'center' },
  pageDotsContainer: { height: '70%', width: width * 0.15, justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row' },

  selectContainer: { flex: 0.5, alignItems: 'center', justifyContent: 'center' }
});