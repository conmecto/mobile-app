import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Modal, Provider, Portal, Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TopBar from '../components/top.bar';
import { COLOR_CODE } from '../utils/enums';
import getUserMatchSettings from '../api/user.match.setting';
import updateMatchSetting from '../api/update.match.setting';
import Loading from '../components/loading';
import { deleteToken, formatText } from '../utils/helpers';
import getCities from '../api/get.cities';
import { deleteAllChatSocketInstance } from '../sockets/chat.socket';
import TermsItem from '../components/terms'
import { getUserId, resetUserId } from '../utils/user.id';
import { resetToken } from '../utils/token';
import { resetPosts } from '../utils/post';
import removeAccount from '../api/remove.account';
import logout from '../api/logout';
import { IMAGE_LOGO } from '../files';

type UserMatchSettingObject = {
  id?: number,
  country?: string, 
  searchFor?: string,
  searchIn?: string,
  minSearchAge?: number,
  maxSearchAge?: number
}

type SearchSettings = UserMatchSettingObject & {
  updateSettings: string,
  modal: string
}

FontAwesome.loadFont();
MaterialCommunityIcons.loadFont();
const { height, width } = Dimensions.get('window');

const searchFor = ['everyone', 'men', 'women'];
const age: number[] = [];
for(let i = 18; i <= 70; i++) {
  age.push(i);
}

const SettingScreen = ({ navigation }: any) => {  
  const userId = getUserId() as number;
  const [cities, setCities] = useState<string[]>([]);
  const [showAccountModal, setShowAccountModal] = useState('');
  const [accountAction, setAccountAction] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchSettings, setSearchSettings] = useState<SearchSettings>({
    updateSettings: '',
    modal: ''
  });
  
  useEffect(() => {
    let check = true;
    const callCities = async () => {
      const res = await getCities('india');
      if (check && res) {
        setCities(res);
      }
    }
    const callSettings = async () => {
      const res = await getUserMatchSettings(userId);
      if (check) {
        if (res) {
          searchSettings.minSearchAge = res.minSearchAge;
          searchSettings.maxSearchAge = res.maxSearchAge;
          searchSettings.searchIn = res.searchIn;
          searchSettings.searchFor = res.searchFor;
          searchSettings.id = res.id;
          searchSettings.country = res.country;
        }
        setSearchSettings({ ...searchSettings });
        setIsLoading(false);
      }
    }
    if (!cities.length) {
      callCities();
    }
    if (!searchSettings.id) {
      callSettings();
    }
    return () => {
      check = false;
    }
  }, []);
  
  useEffect(() => {
    let check = true;
    const callUpdateSettings = async () => {
      const updateObj = searchSettings.updateSettings === 'age' ? { 
        minSearchAge: searchSettings.minSearchAge,
        maxSearchAge: searchSettings.maxSearchAge
      } : (
        searchSettings.updateSettings === 'searchFor' ? { searchFor: searchSettings.searchFor } : {
        searchIn: searchSettings.searchIn
      })
      const res = await updateMatchSetting(userId, updateObj);
      if (check) {
        if (res) {
          searchSettings.minSearchAge = res.minSearchAge;
          searchSettings.maxSearchAge = res.maxSearchAge;
          searchSettings.searchIn = res.searchIn;
          searchSettings.searchFor = res.searchFor;
        }
        setSearchSettings({ ...searchSettings, updateSettings: '' });
        setIsLoading(false);
      }
    }
    if (searchSettings.updateSettings) {
      callUpdateSettings();
    }
    return () => {
      check = false;
    }
  }, [searchSettings.updateSettings]);

  useEffect(() => {
    let check = true;
    const callAccountLogout = async () => {
      const res = await logout(userId);
      if (check) {
        setAccountAction('');
        setIsLoading(false);
        if (res) {
          await deleteToken(userId);
          deleteAllChatSocketInstance();
          resetToken();
          resetUserId();
          resetPosts();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,              
              routes: [
                {
                  name: 'WelcomeScreen'
                }
              ]
            })
          );
        }
      }
    }
    const callRemoveAccount = async () => {
      const res = await removeAccount(userId);
      if (check) {
        setAccountAction('');
        setIsLoading(false);
        if (res) {
          await deleteToken(userId);
          deleteAllChatSocketInstance();
          resetToken();
          resetUserId();
          resetPosts();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,              
              routes: [
                {
                  name: 'WelcomeScreen'
                }
              ]
            })
          );
        }
      }
    }
    if (accountAction === 'logout') {
      callAccountLogout();
    } else if (accountAction === 'delete') {
      callRemoveAccount();
    }
    return () => {
      check = false;
    }
  }, [accountAction]);

  const onPressOpenModal = (key: string) => {
    setSearchSettings(prevState => ({ ...prevState, modal: key }));
  }

  const onPressDismissSearchModal = () => {
    setSearchSettings(prevState => ({ 
      ...prevState, updateSettings: '', modal: '', isLoading: false 
    }));
  }

  const getFlatListData = (): any => {
    if (searchSettings.modal === 'age') {
      return age;
    } else if (searchSettings.modal === 'searchFor') {
      return searchFor;
    } else {
      return cities;
    }
  }

  const onPressSelectModalOption = (value: string) => {
    let isSame = false;
    let loadingCheck = false;
    if (searchSettings.modal === 'age') {
      const age = Number(value);
      const minSearchAge = age === 18 ? 18 : age - 1;
      const maxSearchAge = age === 70 ? 70 : age + 1;
      if (minSearchAge === searchSettings.minSearchAge && maxSearchAge === searchSettings.maxSearchAge) {
        isSame = true;
      } else {
        searchSettings.minSearchAge = minSearchAge;
        searchSettings.maxSearchAge = maxSearchAge;
      }
    } else if (searchSettings.modal === 'searchFor') {
      if (value === searchSettings.searchFor) {
        isSame = true;
      } else {
        searchSettings.searchFor = value;
      }
    } else {
      if (value === searchSettings.searchIn) {
        isSame = true;
      } else {
        searchSettings.searchIn = value;
      }
    }

    if (isSame) {
      searchSettings.updateSettings = '';
    } else {
      searchSettings.updateSettings = searchSettings.modal;
      loadingCheck = true;
    }
    searchSettings.modal = '';
    setSearchSettings({ ...searchSettings });
    setIsLoading(loadingCheck);
  }

  const onPressAccountModal = (key: string) => {
    setShowAccountModal(key);
  }

  const onPressAccountAction = (key: string) => {
    setShowAccountModal('');
    setIsLoading(true);
    setAccountAction(key);
  }

  const SearchItem = ({ item, index }: any ) => {
    return (
      <TouchableOpacity 
        style={styles.selectSettingPressable} 
        onPress={() => onPressSelectModalOption(item?.toString())} key={index}
      >
        <Text style={{ fontSize: 15, fontWeight: '600', color: COLOR_CODE.BRIGHT_BLUE }}>
          {formatText(item?.toString())}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <Provider>
        { 
          isLoading ? 
          (
            <Loading />
          ) : (
            <View style={{ flex: 1 }}>
              <Portal>
                <Modal 
                  visible={Boolean(searchSettings.modal)} 
                  onDismiss={onPressDismissSearchModal} 
                  contentContainerStyle={styles.modalContainer}
                >
                  <FlatList
                    data={getFlatListData()}
                    renderItem={({ item, index }) => <SearchItem item={item} index={index}/>}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </Modal>
                <Modal visible={Boolean(showAccountModal)} 
                  onDismiss={() => setShowAccountModal('')} 
                  contentContainerStyle={showAccountModal === 'terms' ? styles.termsModal : styles.modalStyle}
                >
                  {
                    showAccountModal === 'delete' ? 
                    (
                      <View style={styles.accountModalContainer}>
                        <Text numberOfLines={6} style={styles.deleteTitle}>
                          Are you sure? This action will permanently remove your account and all the related things to your account. 
                          Account cannot be recovered once deleted. 
                        </Text>
                        <Button onPress={() => onPressAccountAction('delete')} buttonColor={COLOR_CODE.BRIGHT_RED} textColor={COLOR_CODE.OFF_WHITE}>
                          Confirm
                        </Button>
                      </View>
                    ) : (
                      showAccountModal === 'logout' ? (
                        <View style={styles.accountModalContainer}>
                          <Text numberOfLines={2} adjustsFontSizeToFit style={styles.logoutTitle}>
                            Are you sure you want to logout?
                          </Text>
                          <Button onPress={() => onPressAccountAction('logout')} buttonColor={COLOR_CODE.BRIGHT_RED} textColor={COLOR_CODE.OFF_WHITE}>
                            Confirm
                          </Button>
                        </View>
                      ) : (
                        <TermsItem />
                      )
                    )
                  }
                </Modal>
              </Portal>
              <View style={styles.settingContainer}>
                <View style={styles.settingHeader}>
                  <Text style={styles.settingText}>Match Settings</Text>
                </View>

                <View style={{ flex: 2 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingFieldText}>Search In</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <TouchableOpacity style={styles.settingFieldPressable} onPress={() => onPressOpenModal('searchIn')}>
                      <View style={styles.settingFieldTextContainer}> 
                        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.settingValueText}>{formatText(searchSettings?.searchIn)}</Text>
                      </View>
                      <View style={styles.settingFieldIconContainer}> 
                        <FontAwesome name='angle-right' size={25} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ flex: 2 }}>
                  <Text style={styles.settingFieldText}>Search For</Text>
                  <TouchableOpacity style={styles.settingFieldPressable} onPress={() => onPressOpenModal('searchFor')}>
                    <View style={styles.settingFieldTextContainer}> 
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.settingValueText}>{formatText(searchSettings?.searchFor)}</Text>
                    </View>
                    <View style={styles.settingFieldIconContainer}> 
                      <FontAwesome name='angle-right' size={25} />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 2 }}>
                  <Text style={styles.settingFieldText}>Age Range</Text>
                  <TouchableOpacity style={styles.settingFieldPressable} onPress={() => onPressOpenModal('age')}>
                    <View style={styles.settingFieldTextContainer}> 
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.settingValueText}>
                        {searchSettings?.minSearchAge}
                        {'   -   '}
                        {searchSettings?.maxSearchAge}
                      </Text>
                    </View>
                    <View style={styles.settingFieldIconContainer}> 
                      <FontAwesome name='angle-right' size={25} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.accountSettingContainer}>
                <View style={styles.accountSettingHeader}>
                  <Text style={styles.accountSettingText}>Account Settings</Text>
                </View>

                <View style={styles.accountSettingBody}>
                  <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => onPressAccountModal('logout')}>
                    <View style={styles.settingFieldTextContainer}> 
                      <Text style={styles.logoutText}>Logout</Text>
                    </View>
                    <View style={styles.settingFieldIconContainer}> 
                      <FontAwesome name='angle-right' size={25} />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.accountSettingBody}>
                  <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => onPressAccountModal('terms')}>
                    <View style={styles.settingFieldTextContainer}> 
                      <Text style={styles.logoutText}>Terms & Conditions</Text>
                    </View>
                    <View style={styles.settingFieldIconContainer}> 
                      <FontAwesome name='angle-right' size={25} />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.accountSettingBody}>
                  <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => onPressAccountModal('delete')}>
                    <View style={styles.settingFieldTextContainer}> 
                      <Text style={styles.logoutText}>Delete Account</Text>
                    </View>
                    <View style={styles.settingFieldIconContainer}> 
                      <FontAwesome name='angle-right' size={25} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flex: 3, alignItems: 'center', justifyContent: 'flex-end' }}>
                <Image source={ IMAGE_LOGO } style={styles.logo} />
                <Text>{'\n'}</Text>
                <Text style={styles.conmectoText}>Conmecto</Text>
                <Text>{'\n'}</Text>
              </View>
            </View>
          )
        }
      </Provider>
    </View>
  );
}

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE,
  },
  
  settingContainer: {
    flex: 3
  },

  settingHeader: {
    flex: 1,
    backgroundColor: COLOR_CODE.LIGHT_GREY,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  settingText: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  settingFieldText: {
    fontSize: 15,
    fontWeight: '600',
    padding: 5
  },
  settingFieldPressable: {
    flex: 1,
    flexDirection: 'row',
  },
  settingFieldTextContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  settingValueText: {
    fontSize: 15,
    color: COLOR_CODE.GREY
  },
  settingFieldIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectSettingPressable: {
    height: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1
  },

  accountSettingContainer: {
    flex: 2
  },
  accountSettingHeader: {
    flex: 1.5,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },
  accountSettingText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  accountSettingBody: {
    flex: 2
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR_CODE.GREY
  },
  modalContainer: { 
    backgroundColor: COLOR_CODE.OFF_WHITE, 
    height: height * 0.3, 
    width: width * 0.8, 
    alignSelf: 'center', 
    borderRadius: 20 
  },
  modalStyle: { alignSelf: 'center', borderRadius: 30, height: height * 0.2, width: width * 0.6, backgroundColor: COLOR_CODE.OFF_WHITE},
  deleteTitle: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  logoutTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  accountModalContainer: { flex: 1, padding: 5, alignItems: 'center', justifyContent: 'space-around' },
  termsModal: { 
    backgroundColor: COLOR_CODE.OFF_WHITE, 
    height: height * 0.5, 
    width: width * 0.8, 
    alignSelf: 'center', 
    borderRadius: 20 
  },
  logo: {
    height: height * 0.15,
    width: width * 0.8,
    borderRadius: 20
  },
  conmectoText: {
    fontWeight: 'bold',
    fontFamily: 'SavoyeLetPlain',
    fontSize: 25
  }
});