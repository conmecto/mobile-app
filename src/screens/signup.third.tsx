import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Provider, Portal, Modal, Button } from 'react-native-paper';
import TopBar from '../components/top.bar';
import { COLOR_CODE, ERROR_CODES } from '../utils/enums';
import createUser from '../api/create.user';
import getCities from '../api/get.cities';
import { GENDER, SEARCH_FOR } from '../utils/constants';
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
  searchIn?: string,
  searchFor?: string,
  gender?: string
}

FontAwesome.loadFont();

const { height, width } = Dimensions.get('window');

const SignupThirdScreen = ({ navigation, route }: any) => {
  const signupObjSecondStage = JSON.parse(route.params.signupObjSecondStage);
  //const extension = '+91';
  const [cities, setCities] = useState<string[]>([]);
  const [finalSignupObj, setFinalSignupObj] = useState<SignupObj>({ ...signupObjSecondStage });
  const [signupError, setSignupError] = useState('');
  const [modalField, setModalField] = useState('');
  const [createUserCheck, setCreateUserCheck] = useState(false);
  useEffect(() => {
    let check = true;
    const callCities = async () => {
      const res = await getCities('india');
      if (check && res) {
        setCities(res);
      }
    }
    if (!cities.length) {
      callCities();
    }
    return () => {
      check = false;
    }
  }, []);

  const onSelectField = (value: string) => {
    setFinalSignupObj({ ...finalSignupObj, [modalField]: value });
    setSignupError('');
    setModalField('');
  }

  useEffect(() => {
    let check = true;
    let timerId1: NodeJS.Timeout;
    let timerId2: NodeJS.Timeout; 
    const callCreateUser = async () => {
      const res = await createUser(finalSignupObj);
      if (check) {
        setCreateUserCheck(false);
        setSignupError('');
        if (res?.errorCode === ERROR_CODES.TOKEN_INVALID) {
          setSignupError('Token expired or invalid, please retry');
          timerId1 = setTimeout(() => navigation.navigate('SignupHomeScreen'), 3000);
        } else if (res?.errorCode === ERROR_CODES.INVALID_EMAIL) {
          setSignupError('Invalid email, please retry');
          timerId2 = setTimeout(() => navigation.navigate('SignupHomeScreen'), 3000);
        } else if (res?.data && res.data[0].userId) {
          const userId = res.data[0].userId as number;
          const key = userId + ':auth:token';
          await Promise.all([
            saveToken('userId', userId?.toString()),
            saveToken(key, JSON.stringify({ refresh: res.data[0].refresh }))
          ]);
          setUserId(userId);
          setAccessToken(res.data[0].access as string);
          navigation.navigate('HomeScreen');
        } else {
          navigation.navigate('ContactAdminScreen');
        }
      }
    }
    if (createUserCheck) {
      callCreateUser();
    }
    return () => {
      clearTimeout(timerId1);
      clearTimeout(timerId2)
      check = false;
    }
  }, [createUserCheck]);

  const renderItem = () => {
    return ({ item }: any) => {
      return (
        <View style={{ padding: 5 }}>
          <Button mode='text' buttonColor={COLOR_CODE.OFF_WHITE} onPress={() => onSelectField(item)} style={{ width: '90%', alignSelf: 'center' }} labelStyle={{ color: COLOR_CODE.GREY }}>{item}</Button>
        </View>
      );
    }
  }

  const onPressSubmit = () => {
    let error = '';
    if (!finalSignupObj.searchIn) {
      error = 'Please select Connect with users in';
    }
    if (!finalSignupObj.city) {
      error = 'Please select your City';
    }
    if (!finalSignupObj.searchFor) {
      error = 'Please select Connect with';
    }
    if (!finalSignupObj.gender) {
      error = 'Please select I identify as';
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
    } else if (modalField === 'searchFor') {
      return SEARCH_FOR;
    } else {
      return cities;
    }
  }

  return (
    <View style={{ flex: 1 }}>  
      <TopBar />
      <Provider>
        <Portal>
          <Modal visible={Boolean(modalField)} onDismiss={() => setModalField('')} contentContainerStyle={styles.modalContainer}>
            <FlatList
              //style={{ flex: 1, padding: 5 }}
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
            <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={() => onPressShowModal('gender')} style={{ width: '80%' }} labelStyle={styles.submitButtonText}>{finalSignupObj.gender || 'I identify as'}</Button>
            <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={() => onPressShowModal('searchFor')} style={{ width: '80%' }} labelStyle={styles.submitButtonText}>{finalSignupObj.searchFor || 'Connect with'}</Button>
            <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={() => onPressShowModal('city')} style={{ width: '80%' }} labelStyle={styles.submitButtonText}>{finalSignupObj.city || 'Select your City'}</Button>
            <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={() => onPressShowModal('searchIn')} style={{ width: '80%' }} labelStyle={styles.submitButtonText}>{finalSignupObj.searchIn || 'Connect with users in'}</Button>
          </View>
          <View style={styles.submitContainer}>
            <Button mode='contained' buttonColor={COLOR_CODE.BLACK} onPress={onPressSubmit} labelStyle={styles.submitButtonText}>Submit</Button>
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
    height: height * 0.6, 
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
});