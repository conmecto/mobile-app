import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import getConmectoScore from '../api/get.conmecto.score';
import TopBar from '../components/top.bar';
import ProfileTagItem from '../components/profile.tag';
import { fireColorScoreBased, formatText, getFormatedView } from '../utils/helpers';
import { COLOR_CODE } from '../utils/enums';
import { ThemeContext } from '../contexts/theme.context';
import { DEFAULT_PROFILE_PIC } from '../files';

FontAwesome.loadFont();
MaterialCommunityIcons.loadFont();
Ionicons.loadFont();

type UserProfileRes = {
  id: number,
  description?: string,
  city?: string,
  country?: string,
  university?: string,
  work?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number,
  preferences?: string,
	traits?: string,
	lookingFor?: string
}

type params = {
  profileDetails: UserProfileRes,
  commonScreen: boolean
}

type props = {
  route: any
}

const { height, width } = Dimensions.get('window');

const FullProfileScreen = ({ route }: props) => {
  const { appTheme } = useContext(ThemeContext);
  const { profileDetails }: params = route?.params;
  const { 
    userId, name, profilePicture, lookingFor, city, age, work, university,
  } = profileDetails;
  const description = profileDetails.description?.substring(0, 300);
  const preferences = profileDetails.preferences?.split(',');
  const traits = profileDetails.traits?.split('|');
  const [conmectoStreak, setConmectoStreak] = useState(5);
 
  useEffect(() => {
    let check = true;
    const callGetData = async () => {
      const res = await getConmectoScore(userId);
      if (check && res?.conmectoScore) {
        setConmectoStreak(res.conmectoScore);
      }
    }
    callGetData();
    return () => {
      check = false;
    }
  }, []);

  const themeColor = appTheme === 'dark' ? {
    mainContainerBackgroundColor: COLOR_CODE.BLACK,
    nameText: COLOR_CODE.OFF_WHITE,
    commonText: COLOR_CODE.OFF_WHITE,
    iconColor: COLOR_CODE.OFF_WHITE,
    tagsColor: COLOR_CODE.BRIGHT_BLUE
  } : {
    mainContainerBackgroundColor: COLOR_CODE.OFF_WHITE,
    nameText: COLOR_CODE.BLACK,
    commonText: COLOR_CODE.CHARCOAL_GREY,
    iconColor: COLOR_CODE.BLACK,
    tagsColor: COLOR_CODE.CHARCOAL_GREY
  }

  const descriptionLength = description?.length || 0;
  const descriptionHeights = [0.15, 0.2, 0.23, 0.28, 0.32, 0.35, 0.35];
  const descriptionContainerHeight = Math.floor(height * descriptionHeights[Math.floor(descriptionLength / 50)]);
  
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <ScrollView style={[styles.mainContainer, { backgroundColor: themeColor.mainContainerBackgroundColor }]}>
        <View style={styles.profilePicContainer}>
          <Image source={profilePicture ? { uri: profilePicture } : DEFAULT_PROFILE_PIC} style={styles.profilePic} />
        </View>
        <View style={[styles.infoContainer, { backgroundColor: themeColor.mainContainerBackgroundColor }]}>
          <View style={styles.headContainer}>
            <View style={styles.nameContainer}>
              <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.nameText, { color: themeColor.nameText }]}>
                {formatText(name) || 'User'}
              </Text>
            </View>
            <View style={styles.streakContainer}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.streakText, { color: themeColor.nameText }]}>
                {getFormatedView(conmectoStreak)}
              </Text>
              <MaterialCommunityIcons name='fire' color={fireColorScoreBased(conmectoStreak)} size={30}/>
            </View>
          </View>
          {
            description && (
              <View style={[styles.descriptionMainContainer, { height: descriptionContainerHeight }]}>
                <View style={styles.descriptionContainer}>
                  <Text numberOfLines={10} adjustsFontSizeToFit style={styles.descriptionText}>
                    {description?.substring(0, 300)}
                  </Text>
                </View>
              </View>
            )
          }
          {
            age && (
              <View style={styles.ageContainer}>
                <MaterialCommunityIcons name='cake' color={themeColor.iconColor} size={25}/>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.ageText, { color: themeColor.commonText }]}>
                  {age} 
                </Text>
              </View>
            )
          }
          {
            city && (
              <View style={styles.ageContainer}>
                <Ionicons name='location-sharp' color={themeColor.iconColor} size={25}/>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.ageText, { color: themeColor.commonText }]}>
                  {formatText(city)}
                </Text>
              </View>
            )
          }
          {
            work && (
              <View style={styles.ageContainer}>
                <MaterialCommunityIcons name='briefcase-variant' color={themeColor.iconColor} size={25}/>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.ageText, { color: themeColor.commonText }]}>
                  {formatText(work)} 
                </Text>
              </View>
            )
          }
          {
            university && (
              <View style={styles.ageContainer}>
                <FontAwesome name='book' color={themeColor.iconColor} size={25}/>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.ageText, { color: themeColor.commonText }]}>
                  {formatText(university)} 
                </Text>
              </View>
            )
          }
          {
            lookingFor && (
              <View style={styles.lookingForContainer}>
                <View style={styles.lookingForInternalContainer}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.lookingForText}>
                    Looking For 😍
                  </Text>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={styles.lookingForValueText}>
                    {lookingFor}
                  </Text>
                </View>
              </View>
            )
          }
          {
            traits && (
              <View style={styles.traitsContainer}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.traitsHeaderText, { color: themeColor.nameText }]}>
                  Core Values 💯
                </Text>
                <ProfileTagItem tag={traits[0]} tagColor={COLOR_CODE.LOGO_COLOR} borderRadius={10} />
                {
                  traits.length === 2 && (
                    <ProfileTagItem tag={traits[1]} tagColor={COLOR_CODE.LOGO_COLOR} borderRadius={10} />
                  )
                }
              </View>
            )
          }
          {
            preferences && (
              <View style={styles.preferencesContainer}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.preferencesText, { color: themeColor.nameText }]}>
                  What Defines Me 😉
                </Text>
              </View>
            )
          }
          {
            preferences && (
              <View style={styles.preferencesValueContainer}>
                {
                  preferences.map((preference, index) => 
                    <ProfileTagItem key={index} tag={formatText(preference)} tagColor={themeColor.tagsColor} borderRadius={10} />
                  )
                }
              </View>
            )
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  profilePicContainer: { height: height * 0.4, width },
  profilePic: { 
    height: '100%', 
    width: '100%',
  },

  infoContainer: { 
    width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
    paddingTop: 10
  },

  headContainer: {
    height: height * 0.1,
    flexDirection: 'row'
  },
  nameContainer: {
    flex: 3,
    justifyContent: 'center',
    paddingLeft: width * 0.05,
  },
  nameText: { 
    fontSize: 25, 
    fontWeight: 'bold'
  },

  streakContainer: { 
    flex: 1, 
    alignItems: 'center',
    flexDirection: 'row'
  },
  streakText: { 
    fontSize: 22, 
    fontWeight: '500'
  },

  ageContainer: { 
    height: height * 0.07, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingLeft: width * 0.05 
  },
  ageText: { 
    paddingLeft: width * 0.05,
    fontSize: 20, 
    fontWeight: '600'
  },

  descriptionMainContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  descriptionContainer: { 
    height: '70%',
    width: '95%', 
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 20, 
    borderWidth: 5,
    borderColor: COLOR_CODE.LOGO_COLOR,
    backgroundColor: COLOR_CODE.LOGO_COLOR, opacity: 0.9 
  },
  descriptionText: { 
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_CODE.OFF_WHITE
  },

  lookingForContainer: {
    height: height * 0.15, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  lookingForInternalContainer: {
    height: '60%',
    width: '95%',
    borderRadius: 15,
    backgroundColor: '#F77C7C',
    justifyContent: 'space-evenly'
  },
  lookingForText: { 
    paddingLeft: 10,
    fontSize: 12, 
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },
  lookingForValueText: { 
    paddingLeft: 10,
    fontSize: 15, 
    fontWeight: 'bold',
    color: COLOR_CODE.OFF_WHITE
  },

  traitsContainer: {
    height: height * 0.2, 
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  traitsHeaderText: { 
    paddingLeft: 10,
    fontSize: 15, 
    fontWeight: 'bold'
  },

  preferencesContainer: {
    height: height * 0.1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferencesText: { 
    fontSize: 15, 
    fontWeight: 'bold'
  },
  preferencesValueContainer: {
    height: height * 0.2, 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', 
    padding: 10 
  }
});

export default FullProfileScreen;