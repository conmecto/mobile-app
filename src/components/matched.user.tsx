import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DEFAULT_PROFILE_PIC } from '../files';
import { fireColorScoreBased, formatText, getFormatedView } from '../utils/helpers';
import { COLOR_CODE } from '../utils/enums';
import { colors } from '../utils/constants';

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
  chatNotification?: boolean,
  newMatch: boolean,
  matchedUserProfile: UserProfileRes,
  matchScore: number,
  onPressMatchedUser: () => void,
  onPressCamera: () => void
}

const { width } = Dimensions.get('window');

const MatchedUser = ({ 
  newMatch, matchedUserProfile, matchScore, onPressMatchedUser, onPressCamera,
  chatNotification
}: props) => {
  let profilePictureSource = DEFAULT_PROFILE_PIC;
  if (matchedUserProfile?.profilePicture) {
    profilePictureSource = { 
      uri: matchedUserProfile.profilePicture
    }
  }
  if (newMatch) {
    chatNotification = false;
  }
  return (
    <TouchableOpacity style={[
        styles.mainContainer, 
        newMatch ? { borderWidth: 3, borderColor: colors[8] } : {}, 
        chatNotification ? { borderWidth: 3, borderColor: COLOR_CODE.LOGO_COLOR } : {}
      ]} 
      onPress={onPressMatchedUser}
    >
      <View style={styles.profilePicContainer}>
        <Image source={profilePictureSource} style={styles.profilePic}/>
      </View>
      <View style={{ flex: 2 }}>
        <View style={styles.nameContainer}>
          <Text numberOfLines={2} adjustsFontSizeToFit style={styles.commonText}>
            {formatText(matchedUserProfile.name)}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1}}> 
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
          {
            newMatch && (
              <View style={styles.newMatchContainer}>
                <View style={styles.newMatchBorderContainer}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.newMatchText}>
                    New Match
                  </Text>
                </View>
              </View>
            )
          }
          {
            (chatNotification && !newMatch) && (
              <View style={styles.newMatchContainer}>
                <View style={styles.chatNotificationBorderContainer}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.newMatchText}>
                    New Chat
                  </Text>
                </View>
              </View>
            )
          }
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
    borderWidth: 0.5, 
    borderRadius: 20,
    flexDirection: 'row',
    height: '80%', 
    width: '95%', 
    // shadowRadius: 3, 
    // shadowOffset: {
    //   width: 0,
    //   height: 0
    // }, 
    // shadowOpacity: 0.5, 
    backgroundColor: COLOR_CODE.OFF_WHITE 
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
  },
  newMatchContainer: { flex: 0, alignItems: 'center', justifyContent: 'center' },
  newMatchBorderContainer: { backgroundColor: colors[8], borderRadius: 10, padding: 5 },
  chatNotificationBorderContainer: { backgroundColor: COLOR_CODE.LOGO_COLOR, borderRadius: 10, padding: 5 },
  newMatchText: { fontSize: 10, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE }
});