import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { fireColorScoreBased, formatText, getFormatedView } from '../utils/helpers';
import { DEFAULT_PROFILE_PIC } from '../files';
import { COLOR_CODE } from '../utils/enums';

Ionicons.loadFont();
FontAwesome.loadFont();
MaterialCommunityIcons.loadFont();

type UserProfileRes = {
  id: number,
  profilePicture?: string,
  userId: number,
  name: string
}

type props = { 
  matchedUserProfile: UserProfileRes,
  matchScore: number,
  onPressMatchedUser: () => void,
  onPressCamera: () => void
}

const { width } = Dimensions.get('window');

const MatchedUser = ({ matchedUserProfile, matchScore, onPressMatchedUser, onPressCamera }: props) => {
  let profilePictureSource = DEFAULT_PROFILE_PIC;
  if (matchedUserProfile?.profilePicture) {
    profilePictureSource = { 
      uri: matchedUserProfile.profilePicture
    }
  }
  return (
    <TouchableOpacity style={styles.mainContainer} onPress={onPressMatchedUser}>
      <View style={styles.profilePicContainer}>
        <Image source={profilePictureSource} style={styles.profilePic}/>
      </View>
      <View style={{ flex: 2 }}>
        <View style={styles.nameContainer}>
          <Text numberOfLines={2} adjustsFontSizeToFit style={styles.commonText}>
            {formatText(matchedUserProfile.name)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.scoreHeaderContainer}>
            <Text style={styles.headerText}>
              Match Streak
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.scoreText}>
              {getFormatedView(matchScore)}<MaterialCommunityIcons name='fire' color={fireColorScoreBased(matchScore)} />
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cameraContainer}>
        <TouchableOpacity onPress={onPressCamera} style={styles.cameraTouchable}>
          <Ionicons name='camera' size={35} color={COLOR_CODE.BLACK}/> 
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default MatchedUser;

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    borderWidth: 1, 
    borderRadius: 20,
    flexDirection: 'row'
  },
  profilePicContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  profilePic: { 
    height: width * 0.15, 
    width: width * 0.15, 
    borderRadius: 100, 
    borderWidth: 0.5 
  },
  nameContainer: { flex: 1.5, alignItems: 'flex-start', justifyContent: 'center' },
  scoreText: {
    fontSize: 20,
    fontWeight: '600'
  },
  commonText: { 
    fontSize: 20, 
    fontWeight: '500' 
  },
  scoreContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  scoreHeaderContainer: { 
    flex: 0, 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
  },
  headerText: { 
    fontSize: 8, 
    fontWeight: 'bold',
    color: COLOR_CODE.GREY
  },
  cameraContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  cameraTouchable: { 
    height: width * 0.12, 
    width: width * 0.12, 
    alignItems: 'center', 
    justifyContent: 'center',
  }
});