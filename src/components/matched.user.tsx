import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fireColorScoreBased, formatText } from '../utils/helpers';
import { DEFAULT_PROFILE_PIC } from '../files';

MaterialCommunityIcons.loadFont();

type UserProfileRes = {
  id: number,
  userName?: string,
  description?: string,
  city?: string,
  country?: string,
  school?: string,
  work?: string,
  igId?: string,
  snapId?: string,
  interests?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number
}

type props = { 
  matchedUserProfile: UserProfileRes,
  matchScore: number,
  onPressMatchedUser: () => void,
}

const MatchedUser = ({ matchedUserProfile, matchScore, onPressMatchedUser }: props) => {
  let profilePictureSource = DEFAULT_PROFILE_PIC;
  if (matchedUserProfile?.profilePicture) {
    profilePictureSource = { 
      uri: matchedUserProfile.profilePicture
    }
  }
  return (
    <TouchableOpacity style={styles.mainContainer} onPress={onPressMatchedUser}>
      <View style={styles.firstRow}>
        <View style={styles.profilePicContainer}>
          <Image source={profilePictureSource} style={styles.profilePic}/>
        </View>
        <View style={styles.scoreContainer}>
          <MaterialCommunityIcons name='fire' color={fireColorScoreBased(matchScore)} size={70}/> 
          <Text numberOfLines={2} adjustsFontSizeToFit style={styles.scoreText}>{matchScore}</Text>
        </View>
      </View>
      <View style={styles.secondRow}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.scoreText}>{formatText(matchedUserProfile.name)},  {matchedUserProfile.age}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default MatchedUser;

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    borderWidth: 1, 
    borderRadius: 30 
  },
  firstRow: { 
    flex: 2, 
    flexDirection: 'row' 
  },
  secondRow: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  profilePicContainer: { 
    flex: 1.5, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  profilePic: { 
    height: 100, 
    width: 100, 
    borderRadius: 100, 
    borderWidth: 1 
  },
  scoreContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  scoreText: { 
    fontSize: 25, 
    fontWeight: '900' 
  }
});