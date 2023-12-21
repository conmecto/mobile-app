import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Dimensions, StyleSheet, Modal, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLOR_CODE } from '../utils/enums';
import createUser from '../api/create.user';
import getCities from '../api/get.cities';

type SignupObj = {
  number?: string,
  name?: string,
  dob?: Date,
  city?: string,
  country?: string,
  searchIn?: string,
  searchFor?: string,
  gender?: string
}

type SignupErrors = {
  city?: string,
  searchIn?: string,
  searchFor?: string,
  gender?: string
}

type ModalCheck = {
  city: boolean,
  searchIn: boolean,
  searchFor: boolean,
  gender: boolean
}

FontAwesome.loadFont();

const { height, width } = Dimensions.get('window');

const SignupSecondScreen = ({ navigation, route }: any) => {
  const signupObj = JSON.parse(route.params.signupObj);
  const extension = '+91';
  const [cities, setCities] = useState<string[]>([]); 
  const [finalSignupObj, setFinalSignupObj] = useState<SignupObj>({});
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});
  const [showModal, setShowModal] = useState<ModalCheck>({
    city: false,
    searchIn: false,
    searchFor: false,
    gender: false
  });
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

  const onPressShowModal = (field: string) => {
    setShowModal({ ...showModal, [field]: true });
  } 

  const onSelectField = (field: string, fieldValue: string) => {
    setFinalSignupObj({ ...finalSignupObj, [field]: fieldValue });
    setSignupErrors({ ...signupErrors, [field]: '' });
    setShowModal({ ...showModal, [field]: false });
  }

  useEffect(() => {
    let check = true;
    const callCreateUser = async () => {
      const res = await createUser({ ...signupObj, ...finalSignupObj });
      if (check) {
        setCreateUserCheck(false);
        setSignupErrors({});
        if (res?.userId) {
          navigation.navigate('CodeVerificationScreen', { extension, number: signupObj.number, token: res.token });
        }
      }
    }
    if (createUserCheck) {
      callCreateUser();
    }
    return () => {
      check = false;
    }
  }, [createUserCheck]);

  const renderCities = (field: string) => {
    return ({ item }: any) => {
      return (
        <TouchableOpacity style={styles.searchInModalPressable} onPress={() => onSelectField(field, item)}>
          <Text style={styles.searchInText}>{item}</Text>
        </TouchableOpacity>
      );
    }
  }

  const onPressCreate = () => {
    let errors: SignupErrors = {};
    if (!finalSignupObj.gender) {
      errors.gender = 'Gender is required';
    }
    if (!finalSignupObj.city) {
      errors.city = 'City is required';
    }
    if (!finalSignupObj.searchFor) {
      errors.searchFor = 'Connect with is required';
    }
    if (!finalSignupObj.searchIn) {
      errors.searchIn = 'Connect in is required';
    }
    if (Object.keys(errors).length) {
      setSignupErrors({ ...signupErrors, ...errors });
      return;
    }
    const checkErrors = Object.values(signupErrors).find(i => Boolean(i.length));
    if (!checkErrors) {
      setCreateUserCheck(true);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.logoMainContainer}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_BLUE }}>Conmecto</Text>
      </View>
      <View style={styles.signupMainContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name='user-plus' color={COLOR_CODE.OFF_WHITE} size={height * 0.05}/>
        </View>

        <View style={styles.genderContainer}>
          <TouchableOpacity style={styles.genderPressable} onPress={() => onPressShowModal('gender')}>
            <Text style={styles.genderText}>{finalSignupObj.gender ? finalSignupObj.gender : 'I identify as'}</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{signupErrors.gender}</Text>
          { 
            showModal.gender &&
            <Modal transparent visible={showModal.gender} animationType='none'>
              <View style={styles.genderModal}>
                {['man', 'nonbinary', 'woman'].map((gender, index) => {
                  return (
                    <TouchableOpacity style={styles.genderModalPressable} key={index+1} onPress={() => onSelectField('gender', gender)}>
                      <Text style={styles.genderText}>{gender}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </Modal>
          }
        </View>

        <View style={styles.cityContainer}>
          <TouchableOpacity style={styles.cityPressable} onPress={() => onPressShowModal('city')}>
            <Text style={styles.cityText}>{finalSignupObj.city ? finalSignupObj.city : 'Your location'}</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{signupErrors.city}</Text>
          { 
            showModal.city &&
            <Modal transparent visible={showModal.city} animationType='none'>
              <View style={styles.cityModal}>
                <FlatList 
                  data={cities}
                  style={{ flex: 1 }}
                  renderItem={renderCities('city')}
                  keyExtractor={(item, index) => index.toString()}
                  />
              </View>
            </Modal>
          }
        </View>

        <View style={styles.searchForContainer}>
          <TouchableOpacity style={styles.searchForPressable} onPress={() => onPressShowModal('searchFor')}>
            <Text style={styles.searchForText}>{finalSignupObj.searchFor ? finalSignupObj.searchFor : 'Connect with'}</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{signupErrors.searchFor}</Text>
          { 
            showModal.searchFor &&
            <Modal transparent visible={showModal.searchFor} animationType='none'>
              <View style={styles.searchForModal}>
                {['everyone', 'men', 'women'].map((item, index) => {
                  return (
                    <TouchableOpacity style={styles.searchForModalPressable} key={index+1} onPress={() => onSelectField('searchFor', item)}>
                      <Text style={styles.searchForText}>{item}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </Modal>
          }
        </View>

        <View style={styles.searchInContainer}>
          <TouchableOpacity style={styles.searchInPressable} onPress={() => onPressShowModal('searchIn')}>
            <Text style={styles.searchInText}>{finalSignupObj.searchIn ? finalSignupObj.searchIn : 'Connect with users in'}</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{signupErrors.searchIn}</Text>
          { 
            showModal.searchIn &&
            <Modal transparent visible={showModal.searchIn} animationType='none'>
              <View style={styles.searchInModal}>
                <FlatList 
                  data={cities}
                  style={{ flex: 1 }}
                  renderItem={renderCities('searchIn')}
                  keyExtractor={(item, index) => index.toString()}
                  />
              </View>
            </Modal>
          }
        </View>

        <View style={styles.createContainer}>
          <TouchableOpacity style={styles.createPressable} onPress={onPressCreate}>
            <Text style={styles.createText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default SignupSecondScreen;

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

  genderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  genderPressable: {
    height: '50%',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  genderModalPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLOR_CODE.BRIGHT_BLUE
  },
  genderModal: {
    position: 'absolute',
    height: width * 0.5,
    width: width * 0.5,
    top: height * 0.4,
    left: width * 0.25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLOR_CODE.BLACK,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  searchInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  searchInPressable: {
    height: '50%',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  searchInText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLOR_CODE.BRIGHT_BLUE
  },
  searchInModal: {
    position: 'absolute',
    height: width * 0.75,
    width: width * 0.75,
    top: height * 0.3,
    left: width * 0.15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLOR_CODE.BLACK,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  searchInModalPressable: {
    height: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchForContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  searchForPressable: {
    height: '50%',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  searchForText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLOR_CODE.BRIGHT_BLUE
  },
  searchForModal: {
    position: 'absolute',
    height: width * 0.5,
    width: width * 0.5,
    top: height * 0.4,
    left: width * 0.25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLOR_CODE.BLACK,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  searchForModalPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cityContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  cityPressable: {
    height: '50%',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  cityText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLOR_CODE.BRIGHT_BLUE
  },
  cityModal: {
    position: 'absolute',
    height: width * 0.75,
    width: width * 0.75,
    top: height * 0.3,
    left: width * 0.15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLOR_CODE.BLACK,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  cityModalPressable: {
    height: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },

  createContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  createPressable: {
    height: '50%',
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: COLOR_CODE.BRIGHT_RED,
    // borderWidth: 1,
    // borderColor: 'black'
  },
  createText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },

  errorText: {
    fontSize: 15,
    fontWeight: '500',
  }
});
