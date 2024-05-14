import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR_CODE } from '../utils/enums';
import getUserProfile from '../api/user.profile';
import { createChatSocketConnection, getChatSocketInstance } from '../sockets/chat.socket';
import updateChatsRead from '../api/update.chats.read';
import { getUserId } from '../utils/user.id'; 
import ScoreProgressBar from '../components/score.progress';
import MatchedUser from '../components/matched.user';

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
  age: number
}

type UserMatchRes = {
  matchId?: number,
  score?: number,
  createdAt?: Date,
  matchedUserId?: number
  city?: string,
  country?: string,
  settingId: number,
  userId: number,
  totalMatchScore: number,
  pinnedPostId?: number,
  chatNotification?: boolean
}

Ionicons.loadFont();
MaterialCommunityIcons.loadFont();

const MatchHomeScreen = ({ route, navigation }: any) => {
  const setting: UserMatchRes = route?.params?.userMatchRes;
  const userId = getUserId() as number;
  const matchedUserId = setting?.matchedUserId || 46;
  const matchId = setting?.matchId;
  const [matchedUserProfile, setMatchedUserProfile] = useState<UserProfileRes>();
  const [markChatsRead, setMarkChatsRead] = useState(false);
  
  const socket = getChatSocketInstance();
  if (!socket || socket.readyState !== 1) {
    createChatSocketConnection(userId);
  }

  useEffect(() => {
    let check = true;
    const fetchData = async () => {
      const matchedUserProfileRes = await getUserProfile(matchedUserId as number);
      if (check) {
        if (matchedUserProfileRes) {
          setMatchedUserProfile(matchedUserProfileRes);
        }
      }
    }
    if (!matchedUserProfile) {
      fetchData();
    }
    return () => {
      check = false;
    }
  }, []);

  useEffect(() => {
    let check = true;
    const callMarkChatsRead = async () => {
      await updateChatsRead(matchId as number, userId);
      if (check) {
        setMarkChatsRead(false);
      }
    }
    if (markChatsRead) {
      callMarkChatsRead();
    }
    return () => {
      check = false;
    }
  }, [markChatsRead]);

  const onPressMatchedUser = () => {
    if (setting?.chatNotification) {
      setMarkChatsRead(true);
    }
    navigation.navigate('MatchChatScreen', { matchId, matchedUserId });
  }

  const onPressCamera = () => {
    navigation.navigate('CameraScreen');
  }
 
  return (
    <View style={styles.mainContainer}>
      <View style={styles.scoreContainer}>
        <ScoreProgressBar totalMatchScore={(setting?.totalMatchScore || 5)} />
      </View>
      <View style={{ flex: 2 }}>
        <View style={styles.matchedUserContainer}> 
        {
          setting?.chatNotification ?
          (  
            <LinearGradient colors={[COLOR_CODE.BRIGHT_RED, COLOR_CODE.OFF_WHITE]} style={styles.gradient}>
              { 
                matchedUserProfile ? 
                <MatchedUser matchedUserProfile={matchedUserProfile} matchScore={setting.score as number} onPressMatchedUser={onPressMatchedUser}/> : 
                (<Text style={{ alignSelf: 'center'}}>Profile load failed</Text>) 
              }
            </LinearGradient>       
          ) : (
            <View style={styles.noNotificationContainer}>
              { 
                matchedUserProfile ? 
                <MatchedUser matchedUserProfile={matchedUserProfile} matchScore={setting.score as number} onPressMatchedUser={onPressMatchedUser}/> : 
                (<Text style={{ alignSelf: 'center'}}>Profile load failed</Text>) 
              }
            </View>
          )
        }
        </View>    
        <View style={styles.cameraContainer}>
          <TouchableOpacity onPress={onPressCamera} style={styles.cameraTouchable}>
            <Ionicons name='camera' size={40} color={COLOR_CODE.OFF_WHITE}/> 
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: COLOR_CODE.OFF_WHITE 
  },
  matchedUserContainer: { 
    flex: 3, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  gradient: { 
    height: '70%', 
    width: '90%', 
    borderRadius: 30 
  },
  noNotificationContainer: { 
    height: '70%', 
    width: '90%', 
    borderRadius: 30, 
    shadowRadius: 3, 
    shadowOffset: {
      width: 0,
      height: 0
    }, 
    shadowOpacity: 0.5, 
    backgroundColor: COLOR_CODE.OFF_WHITE 
  },
  scoreContainer: {
    flex: 1,
    //borderWidth: 1
  },
  cameraContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  cameraTouchable: { 
    height: 60, 
    width: 60, 
    borderRadius: 60, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLOR_CODE.BLACK, 
    shadowOffset: { 
      width: 0, 
      height: 0 
    }, 
    shadowOpacity: 0.5, 
    shadowRadius: 2 
  }
});

export default MatchHomeScreen;