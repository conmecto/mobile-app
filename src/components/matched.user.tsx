import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { fireColorScoreBased, formatText } from '../utils/helpers';
import { DEFAULT_PROFILE_PIC } from '../files';
import { COLOR_CODE } from '../utils/enums';

FontAwesome.loadFont();
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
        <View style={styles.detailsContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>{formatText(matchedUserProfile.name)}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>{matchedUserProfile.age}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}><FontAwesome name='map-pin' color={COLOR_CODE.BRIGHT_RED} /> {formatText(matchedUserProfile.city)}</Text>
        </View>
      </View>
      <View style={styles.secondRow}>
        <View style={styles.scoreHeaderContainer}>
          <Text style={styles.headerText}>Match Streak</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>{matchScore}</Text>
          <MaterialCommunityIcons name='fire' color={fireColorScoreBased(matchScore)} size={50}/> 
        </View>
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
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  profilePic: { 
    height: 100, 
    width: 100, 
    borderRadius: 100, 
    borderWidth: 1 
  },
  detailsContainer: { 
    flex: 1.5, 
    alignItems: 'flex-start', 
    justifyContent: 'center' 
  },
  commonText: { 
    fontSize: 25, 
    fontWeight: 'bold' 
  },
  scoreContainer: { 
    flex: 4, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  scoreHeaderContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerText: { 
    fontSize: 10, 
    fontWeight: 'bold' 
  }
});