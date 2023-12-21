import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TopBar from '../components/top.bar';
import { COLOR_CODE } from '../utils/enums';
import getUserMatchSettings from '../api/user.match.setting';
import updateMatchSetting from '../api/update.match.setting';
import getPastMatches from '../api/past.matches';
import Loading from '../components/loading';
import { deleteToken, formatText, fireColorScoreBased } from '../utils/helpers';
import getCities from '../api/get.cities';

type UserMatchSettingObject = {
  id?: number,
  country?: string, 
  searchFor?: string,
  searchIn?: string,
  minSearchAge?: number,
  maxSearchAge?: number
}

type UserProfileDetail = {
  id: number,
  userName?: string,
  profilePicture?: string,
  userId: number,
  name: string
}

type UserMatchRes = {
  id: number,
  userId1: number,
  userId2: number,
  score: number,
  createdAt: Date,
  city: string,
  country: string,
  profileUserId1?: UserProfileDetail,
  profileUserId2?: UserProfileDetail
}

type SearchSettings = UserMatchSettingObject & {
  isLoading: boolean,
  updateSettings: string,
  modal: string
}

FontAwesome.loadFont();
MaterialCommunityIcons.loadFont();
const { height } = Dimensions.get('window');

const searchFor = ['everyone', 'men', 'women'];
const age: number[] = [];
for(let i = 18; i <= 70; i++) {
  age.push(i);
}

const SettingScreen = ({ navigation, route }: any) => {  
  const { userId } = route.params;
  const [cities, setCities] = useState<string[]>([]);
  const [searchSettings, setSearchSettings] = useState<SearchSettings>({
    isLoading: true,
    updateSettings: '',
    modal: ''
  });
  const [pastMatches, setPastMatches] = useState<UserMatchRes[]>([]);
  const [isLoadingPastMatches, setIsLoadingPastMatches] = useState(true);
  
  useEffect(() => {
    let check = true;
    const callCities = async () => {
      const res = await getCities('india');
      if (check && res) {
        setCities(res);
      }
    }
    const callPastMatches = async () => {
      const res = await getPastMatches(userId);
      if (check && res) {
        setIsLoadingPastMatches(false);
        if (res) {
          setPastMatches(res);
        } 
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
        setSearchSettings({ ...searchSettings, isLoading: false });
      }
    }
    if (!cities.length) {
      callCities();
    }
    if (isLoadingPastMatches) {
      callPastMatches();
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
        setTimeout(() => {
          setSearchSettings({ ...searchSettings, updateSettings: '', isLoading: false });
        }, 1000);
      }
    }
    if (searchSettings.updateSettings) {
      callUpdateSettings();
    }
    return () => {
      check = false;
    }
  }, [searchSettings.updateSettings]);

  const getListData = (key: string) => {
    if (key === 'searchFor') return searchFor;
    if (key === 'searchIn') return cities;
    if (key === 'age') return age;
    return null;
  }

  const onPressOpenModal = (key: string) => {
    setSearchSettings({ ...searchSettings, modal: key });
  }

  const onPressSelectModalOption = (value: string) => {
    let isSame = false;
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
      searchSettings.isLoading = false;
    } else {
      searchSettings.updateSettings = searchSettings.modal;
      searchSettings.isLoading = true;
    }
    searchSettings.modal = '';
    setSearchSettings({ ...searchSettings });
  }

  const onPressLogout = () => {
    deleteToken(userId).then(res => {
      if (res) {
        navigation.navigate('WelcomeScreen');
      }
    }).catch(error => console.log('Logout error: ', error));
  }

  const renderItemsSettings = (item: string | number, index: number) => {
    return (
      <TouchableOpacity style={styles.selectSettingPressable} onPress={() => onPressSelectModalOption(item?.toString())} key={index}>
        <Text style={{ fontSize: 25, fontWeight: '600', color: COLOR_CODE.BRIGHT_BLUE }}>{formatText(item?.toString())}</Text>
      </TouchableOpacity>
    );
  }

  const renderItemsPastMatches = (item: UserMatchRes, index: number) => {
    const profile = userId === item.userId1 ? item.profileUserId1 : item.profileUserId2;
    return (
      <View style={styles.matchContainer} key={index}>
        <View style={styles.matchImageContainer}>
          <Image source={{ uri: profile?.profilePicture }} style={styles.profilePicture}/>
        </View>
        <View style={styles.matchNameContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.nameText}>{formatText(profile?.name)}</Text>
        </View>
        <View style={styles.matchScoreContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.scoreText}>{item.score}</Text>
        </View>
        <View style={styles.matchIconContainer}>
          <MaterialCommunityIcons name='fire' color={fireColorScoreBased(item.score)} size={30}/> 
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView>
        <View style={styles.settingContainer}>

          <View style={styles.settingHeader}>
            <View style={styles.settingTextHeader}>
              <Text style={styles.settingText}>Match Settings</Text>
            </View>
          </View>

          <View style={styles.settingBodyContainer}>
            {
              searchSettings.isLoading ?
              (<Loading />) : (
                searchSettings.modal ?
                (
                  <ScrollView style={{ flex: 1 }}> 
                    {getListData(searchSettings.modal)?.map(renderItemsSettings)}
                  </ScrollView>
                ) : (
                  <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.settingFieldText}>Search In</Text>
                      <TouchableOpacity style={styles.settingFieldPressable} onPress={() => onPressOpenModal('searchIn')}>
                        <View style={styles.settingFieldTextContainer}> 
                          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.settingValueText}>{formatText(searchSettings?.searchIn)}</Text>
                        </View>
                        <View style={styles.settingFieldIconContainer}> 
                          <FontAwesome name='angle-right' size={30} />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.settingFieldText}>Search For</Text>
                      <TouchableOpacity style={styles.settingFieldPressable} onPress={() => onPressOpenModal('searchFor')}>
                        <View style={styles.settingFieldTextContainer}> 
                          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.settingValueText}>{formatText(searchSettings?.searchFor)}</Text>
                        </View>
                        <View style={styles.settingFieldIconContainer}> 
                          <FontAwesome name='angle-right' size={30} />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
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
                          <FontAwesome name='angle-right' size={30} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              )
            }
          </View>

        </View>

        <Text>{'\n\n'}</Text>

        <View style={styles.accountSettingContainer}>
          <View style={styles.accountSettingHeader}>
            <Text style={styles.accountSettingText}>Account Settings</Text>
          </View>

          <View style={styles.accountSettingBody}>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={onPressLogout}>
              <View style={styles.settingFieldTextContainer}> 
                <Text style={styles.logoutText}>Logout</Text>
              </View>
              <View style={styles.settingFieldIconContainer}> 
                <FontAwesome name='angle-right' size={30} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text>{'\n\n'}</Text>

        <View style={styles.pastMatchMainContainer}>
          <View style={styles.pastMatchHeader}>
            <Text style={styles.pastMatchText}>Past Matches</Text>
          </View>

          <View style={styles.pastMatchBody}>
            {
              isLoadingPastMatches ? 
              (<Loading />) : 
              (
                <ScrollView style={{ flex: 1 }}>
                  {pastMatches.map(renderItemsPastMatches)}
                </ScrollView>
              )
            }
          </View>
        </View>
      </ScrollView>
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
    height: height * 0.3
  },

  settingHeader: {
    height: height * 0.05,
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },
  settingTextHeader: {
    flex: 2,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  settingText: {
    fontSize: 20,
    fontWeight: '600'
  },

  settingBodyContainer: {
    flex: 4,
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
    paddingLeft: 10
  },
  settingValueText: {
    fontSize: 20,
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
//    borderWidth: 1
  },

  accountSettingContainer: {
    height: height * 0.1,
//    borderWidth: 1
  },
  accountSettingHeader: {
    height: height * 0.05,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },
  accountSettingText: {
    fontSize: 20,
    fontWeight: '600'
  },
  accountSettingBody: {
    flex: 1
  },
  logoutText: {
    fontSize: 20,
    fontWeight: '600'
  },

  pastMatchMainContainer: {
    height: height * 0.3
  },
  pastMatchHeader: {
    height: height * 0.05,
    backgroundColor: COLOR_CODE.LIGHT_GREY,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  pastMatchText: {
    fontSize: 20,
    fontWeight: '600'
  },
  pastMatchBody: {
    flex: 1,
  },
  matchContainer: {
    height: height * 0.05,
    flexDirection: 'row',
  },
  matchImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchNameContainer: {
    flex: 3,
    paddingLeft: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  }, 
  matchIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  matchScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLOR_CODE.BRIGHT_BLUE
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLOR_CODE.BRIGHT_BLUE
  },
  profilePicture: {
    height: '75%',
    width: '45%',
    borderRadius: 100
  }
});