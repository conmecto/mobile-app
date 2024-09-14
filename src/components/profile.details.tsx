import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { formatText } from '../utils/helpers';
import { COLOR_CODE } from '../utils/enums';
import { DEFAULT_PROFILE_PIC } from '../files';
import { ThemeContext } from '../contexts/theme.context';

FontAwesome.loadFont();
MaterialCommunityIcons.loadFont();

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

type props = {
  profileDetails: UserProfileRes,
  navigate: any,
  commonScreen: boolean
}

const ProfileDetails = ({ profileDetails, navigate, commonScreen }: props) => {
  const { appTheme } = useContext(ThemeContext);
  const { 
    age, name, city, description, profilePicture, work, university, preferences, 
    lookingFor, traits
  } = profileDetails;
  const isProfileComplete = !!(
    name && description && city && age && profilePicture && work && university && preferences && 
    lookingFor && traits
  );
  
  const onPressEditProfile = () => {
    navigate('EditProfileScreen', { profileDetails });
  }

  const onPressProfile = () => {
    navigate('FullProfileScreen', { profileDetails });
  }

  const themeColor = appTheme === 'dark' ? {
    completeFont: COLOR_CODE.LIGHT_GREY,
    nameText: COLOR_CODE.OFF_WHITE,
  } : {
    completeFont: COLOR_CODE.BLACK,
    nameText: COLOR_CODE.BLACK,
  }

  return (
    <View style={styles.mainContainer}>
      {
        !commonScreen && 
        (
          <View style={[styles.headerContainer, isProfileComplete ? { justifyContent: 'flex-end', paddingRight: 20 } : {}]}>
            {
              !isProfileComplete && (
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 12, fontWeight: 'bold' }, { color: themeColor.completeFont }]}>
                  Complete your Profile❗
                </Text>
              )
            }
            <TouchableOpacity onPress={onPressEditProfile} style={styles.editButtonContainer}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        )
      }
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={onPressProfile} style={styles.profileTouchable}>
          <Image source={profilePicture ? 
            { uri: profilePicture } : DEFAULT_PROFILE_PIC} style={styles.profilePic} />
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.commonText, profilePicture ? { color: COLOR_CODE.OFF_WHITE } : { color: themeColor.nameText }]}>
            {formatText(name)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 3
  },
  headerContainer: { 
    flex: 0.5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row'
  },
  editButtonContainer: { height: '100%', width: '15%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: COLOR_CODE.BRIGHT_BLUE },
  editText: { fontSize: 12, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE },
  
  profilePic: { 
    height: '100%', 
    width: '100%',
    borderRadius: 20,
  },
  commonText: { 
    position: 'absolute',
    bottom: 5,
    paddingLeft: 15,
    fontSize: 25, 
    fontWeight: 'bold' 
  },
  profileContainer: {
    flex: 4,
  },
  profileTouchable: {
    flex: 1,
    padding: 5
  }
});