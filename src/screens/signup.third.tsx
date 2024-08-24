import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList, TextInput } from 'react-native';
import { Provider, Portal, Modal, Button } from 'react-native-paper';
import TopBar from '../components/top.bar';
import { COLOR_CODE, ERROR_CODES } from '../utils/enums';
import createUser from '../api/create.user';
import { GENDER, Cities } from '../utils/constants';
import { setUserId } from '../utils/user.id';
import { setAccessToken } from '../utils/token';
import { saveToken } from '../utils/helpers';

type SignupObj = {
  country: string,
  email?: string,
  name?: string,
  appleAuthToken?: string,
  termsAccepted?: boolean,
  appleAuthUserId?: string,
  dob?: Date,
  city?: string,
  gender?: string,
  deviceToken?: string
}

const { height, width } = Dimensions.get('window');

const SignupThirdScreen = ({ navigation, route }: any) => {
  const signupObjSecondStage: SignupObj = JSON.parse(route.params.signupObjSecondStage);
  //const extension = '+91';
  const cities: string[] = Cities[signupObjSecondStage?.country];
  const [finalSignupObj, setFinalSignupObj] = useState<SignupObj>({ ...signupObjSecondStage });
  const [signupError, setSignupError] = useState('');
  const [modalField, setModalField] = useState('');
  const [createUserCheck, setCreateUserCheck] = useState(false);

  const onSelectField = (value: string) => {
    setFinalSignupObj({ ...finalSignupObj, [modalField]: value });
    setSignupError('');
    setModalField('');
  }

  useEffect(() => {
    let check = true;
    let timerId: NodeJS.Timeout;
    const callCreateUser = async () => {
      const res = await createUser(finalSignupObj);
      if (check) {
        setCreateUserCheck(false);
        if (res?.errorCode === ERROR_CODES.TOKEN_INVALID) {
          setSignupError('Token expired or invalid, Please retry');
          timerId = setTimeout(() => navigation.navigate('WelcomeScreen'), 3000);
        } else if (res?.errorCode === ERROR_CODES.DUPLICATE_USER) {
          setSignupError('You have already signed up, Please login');
          timerId = setTimeout(() => navigation.navigate('WelcomeScreen'), 3000);
        } else if (res?.data && res.data[0].userId) {
          const userId = res.data[0].userId as number;
          const key = userId + ':auth:token';
          await Promise.all([
            saveToken('userId', userId?.toString()),
            saveToken(key, JSON.stringify({ refresh: res.data[0].refresh }))
          ]);
          setUserId(userId);
          setAccessToken(res.data[0].access as string);
          setSignupError('');
          navigation.replace('HomeTabNavigator');
        } else {
          setSignupError('');
          navigation.navigate('ContactAdminScreen');
        }
      }
    }
    if (createUserCheck) {
      callCreateUser();
    }
    return () => {
      clearTimeout(timerId);
      check = false;
    }
  }, [createUserCheck]);

  const renderItem = () => {
    return ({ item }: any) => {
      return (
        <View style={{ padding: 5 }}>
          <Button mode='text' 
            buttonColor={COLOR_CODE.OFF_WHITE} 
            onPress={() => onSelectField(item)} 
            style={{ width: '90%', alignSelf: 'center' }} 
            labelStyle={{ color: COLOR_CODE.BRIGHT_BLUE }}
          >
              {item}
          </Button>
        </View>
      );
    }
  }

  const onPressSubmit = () => {
    let error = '';
    if (!finalSignupObj.city) {
      error = 'Please select your City';
    }
    if (!finalSignupObj.gender) { 
      finalSignupObj.gender = 'n/s';
    }
    if (error) {
      setSignupError(error);
    } else {
      setCreateUserCheck(true);
    }
  }

  const onPressShowModal = (field: string) => {
    setModalField(field);
  }

  const getFlatListData = () => {
    if (modalField === 'gender') {
      return GENDER;
    } else {
      return cities;
    }
  }

  const onChangeCity = (text: string) => {
    setFinalSignupObj({ ...finalSignupObj, city: text.toLowerCase() });
  }

  return (
    <View style={{ flex: 1 }}>  
      <TopBar />
      <Provider>
        <Portal>
          <Modal visible={Boolean(modalField)} onDismiss={() => setModalField('')} 
            contentContainerStyle={[styles.modalContainer, modalField === 'gender' ? { height: height * 0.2 } : {}]}
          >
            <FlatList
              data={getFlatListData()}
              renderItem={renderItem()}
              keyExtractor={(item, index) => index.toString()}
            />
          </Modal>
        </Portal>
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTextStyle} numberOfLines={1} adjustsFontSizeToFit>{signupError}</Text>
          </View>
          <View style={styles.fieldContainer}>
            {
              cities ? 
              (
                <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={() => onPressShowModal('city')} style={styles.cityButton} labelStyle={styles.submitButtonText}>
                  {finalSignupObj.city || 'Select your City'}
                </Button>
              ) : (
                <TextInput
                  placeholder='Enter your City'
                  value={finalSignupObj.city}
                  onChangeText={onChangeCity}
                  style={styles.cityInput}
                />
              )
            }
            <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={() => onPressShowModal('gender')} style={styles.cityButton} labelStyle={styles.submitButtonText}>
              {finalSignupObj.gender || 'I identify as'}
            </Button>
          </View>
          <View style={styles.submitContainer}>
            <Button mode='contained' buttonColor={COLOR_CODE.BLACK} onPress={onPressSubmit} labelStyle={styles.submitButtonText}>
              Submit
            </Button>
          </View>
        </View>
      </Provider>
    </View>
  );
}

export default SignupThirdScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  modalContainer: { 
    backgroundColor: COLOR_CODE.OFF_WHITE, 
    height: height * 0.4, 
    width: width * 0.8, 
    alignSelf: 'center', 
    borderRadius: 20 
  },

  submitContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1
  },

  submitButtonText: {
    color: COLOR_CODE.OFF_WHITE
  },

  errorContainer: {
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

  fieldContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //borderWidth: 1
  },

  cityInput: { backgroundColor: COLOR_CODE.LIGHT_GREY, borderRadius: 10, width: '70%', height: height * 0.06, padding: 10 },
  cityButton: { width: '70%', borderRadius: 10 }
});