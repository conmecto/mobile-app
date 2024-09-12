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
  userName?: string,
  description?: string,
  city?: string,
  country?: string,
  university?: string,
  work?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number
}

type props = {
  profileDetails: UserProfileRes,
  navigate: any,
  commonScreen: boolean
}

const ProfileDetails = ({ profileDetails, navigate, commonScreen }: props) => {
  const { appTheme } = useContext(ThemeContext);
  const { age, name, profilePicture, city, description } = profileDetails;
  const isProfileComplete = !!(name && description && city && age && profilePicture);
  
  const onPressEditProfile = () => {
    navigate('EditProfileScreen', { profileDetails });
  }

  const onPressProfile = () => {
    navigate('FullProfileScreen', { profileDetails });
  }

  const themeColor = appTheme === 'dark' ? {
    completeFont: COLOR_CODE.LIGHT_GREY
  } : {
    completeFont: COLOR_CODE.BLACK
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
            <TouchableOpacity onPress={onPressEditProfile} style={{ height: '100%', width: '15%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: COLOR_CODE.BRIGHT_BLUE }}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 12, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE }}>
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
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.commonText, profilePicture ? { color: COLOR_CODE.OFF_WHITE } : {}]}>
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
  editButtonContainer: {
    flex: 1,
    paddingRight: 10,
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
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