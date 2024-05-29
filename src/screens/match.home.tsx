import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR_CODE } from '../utils/enums';
import { createChatSocketConnection, getChatSocketInstance } from '../sockets/chat.socket';
import updateChatsRead from '../api/update.chats.read';
import { getUserId } from '../utils/user.id'; 
import MatchedUser from '../components/matched.user';
import TopBar from '../components/top.bar'; 
import getUserMatches from '../api/user.matches';
import { NO_MATCH_GIF } from '../files';
import getMultipleUsersProfile from '../api/multiple-users.profile';

type UserProfileRes = {
  id: number,
  city?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number
}

type UserMatchRes = {
  id?: number,
  userId1?: number,
  userId2?: number,
  score?: number,
  createdAt?: Date,
  city?: string,
  country?: string,
  chatNotification?: boolean
  profile?: UserProfileRes
}

type MatchObj = {
  matches: UserMatchRes[],
  isLoading: boolean,
  page: number,
  hasMore: boolean,
  isRefreshing: boolean
}

Ionicons.loadFont();
MaterialCommunityIcons.loadFont();

const { height } = Dimensions.get('window');

const MatchHomeScreen = ({ route, navigation }: any) => {
  const [markChatsRead, setMarkChatsRead] = useState<number>();
  const userId = getUserId() as number;
  const perPage = 2;
  const [matchObj, setMatchObj] = useState<MatchObj>({
    matches: [],
    isLoading: true,
    isRefreshing: false,
    page: 1,
    hasMore: true
  });
  
  useEffect(() => {
    let check = true;
    const callMarkChatsRead = async () => {
      await updateChatsRead(markChatsRead as number, userId);
      if (check) {
        setMatchObj(matchObj);
        setMarkChatsRead(undefined);
      }
    }
    if (markChatsRead) {
      callMarkChatsRead();
    }
    return () => {
      check = false;
    }
  }, [markChatsRead]);

  const onPressMatchedUser = (pressedMatch: UserMatchRes, matchIndex: number) => {
    const matchedUserId = userId === pressedMatch.userId1 ? pressedMatch.userId2 : pressedMatch.userId1;
    if (pressedMatch?.chatNotification) {
      if (!isNaN(Number(matchIndex))) {
        matchObj.matches[matchIndex].chatNotification = false;
      }
      setMarkChatsRead(pressedMatch.id);
    }
    navigation.navigate('MatchChatScreen', { 
      matchId: pressedMatch.id, matchedUserId, matchedUserName: pressedMatch.profile?.name 
    });
  }

  const onPressCamera = (matchId: number, matchedUserId: number) => {
    navigation.navigate('CameraScreen', { commonScreen: true, matchId, matchedUserId });
  }

  const getMatchObject = async () => {
    const res = await getUserMatches(userId, { page: matchObj.page, perPage });
    const matchObjUpdated = {
      ...matchObj,
      isLoading: false,
      isRefreshing: false,
      hasMore: false
    } 
    if (res?.data?.length) {
      const userIds = res.data.map(match => {
        if (match.userId1 === userId) {
          return match.userId2;
        } else {
          return match.userId1;
        }
      });
      const profileRes = await getMultipleUsersProfile(userIds as number[], userId);
      if (profileRes?.data) {
        for(let i = 0; i < userIds.length; i++) {
          const key = userIds[i] as number;
          res.data[i].profile = profileRes.data[key];
        }
      }
      matchObjUpdated.matches.push(...res.data);
      matchObjUpdated.hasMore = res.hasMore;
    }
    return matchObjUpdated;
  }

  useEffect(() => {
    let check = true;
    const fetchMatches = async () => {
      const matchObjUpdated = await getMatchObject();
      if (check) {
        setMatchObj(matchObjUpdated); 
      }
    }
    if (matchObj.isRefreshing && matchObj.isLoading && matchObj.hasMore) {
      fetchMatches();
    }
    return () => {
      check = false;
    }
  }, [matchObj.isRefreshing]);
  
  useEffect(() => {
    let check = true;
    const fetchMatches = async () => {
      const matchObjUpdated = await getMatchObject();
      if (check) {
        setMatchObj(matchObjUpdated); 
      }
    }
    if (matchObj.hasMore && matchObj.isLoading && !matchObj.isRefreshing) {
      fetchMatches();
    }
    return () => {
      check = false;
    }
  }, [matchObj.page]);

  const onLoadMoreMatches = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    if (matchObj.hasMore) {
      setMatchObj({ ...matchObj, isLoading: true, page: matchObj.page + 1 });
    }
  }

  const NoMatch = ({ item }: any) => {
    return (
      <View style={styles.noMatchContainer}>
        <Text numberOfLines={2} style={styles.noMatchText}>
          Finding matches, keep adding more Polaroids 😃
          {'\n'}
        </Text>
        <Image source={NO_MATCH_GIF} style={{ height: 300, width: 300 }}/>
      </View>
    );
  } 
  const MatchItem = ({ item, matchIndex }: { item: UserMatchRes, matchIndex: number }) => {
    const socket = getChatSocketInstance(item.id as number, userId);
    if (!socket || socket.readyState !== 1) {
      createChatSocketConnection(item.id as number, userId);
    }
    const matchedUserId = item.userId1 === userId ? item.userId2 : item.userId1;
    return (
      <View style={styles.matchedUserContainer}> 
      {
        item?.chatNotification ?
        (  
          <LinearGradient colors={[COLOR_CODE.BRIGHT_RED, COLOR_CODE.OFF_WHITE]} style={styles.gradient}>
            { 
              item.profile ? 
              <MatchedUser 
                matchedUserProfile={item.profile} matchScore={item.score as number} 
                onPressMatchedUser={() => onPressMatchedUser(item, matchIndex)}
                onPressCamera={() => onPressCamera(item.id as number, matchedUserId as number)}
              /> : 
              (<Text style={{ alignSelf: 'center'}}>Profile load failed</Text>) 
            }
          </LinearGradient>       
        ) : (
          <View style={styles.noNotificationContainer}>
            { 
              item.profile ? 
              <MatchedUser 
                matchedUserProfile={item.profile} 
                matchScore={item.score as number} 
                onPressMatchedUser={() => onPressMatchedUser(item, matchIndex)}
                onPressCamera={() => onPressCamera(item.id as number, matchedUserId as number)}
              /> : 
              (<Text style={{ alignSelf: 'center'}}>Profile load failed</Text>) 
            }
          </View>
        )
      }
      </View> 
    );
  }

  return (
    <View style={styles.mainContainer}>
      <TopBar />
      <View style={{ flex: 1 }}>
        {
          matchObj.matches.length ? 
          (
            <FlatList 
              data={matchObj.matches}
              renderItem={({ item, index }) => <MatchItem item={item} matchIndex={index} />}
              keyExtractor={(item: any, index: number) => item.id?.toString()}
              showsVerticalScrollIndicator={false}
              onEndReached={onLoadMoreMatches}
              onEndReachedThreshold={0}
              refreshing={matchObj.isRefreshing}
              onRefresh={() => setMatchObj({ page: 1, isLoading: true, isRefreshing: true, matches: [], hasMore: true })}
              
            />
          ) : (
            <FlatList 
              data={[{}]}
              renderItem={({ item }) => <NoMatch item={item}/>}
              keyExtractor={(item: any, index: number) => ''}
              showsVerticalScrollIndicator={false}
              refreshing={matchObj.isRefreshing}
              onRefresh={() => setMatchObj({ page: 1, isLoading: true, isRefreshing: true, matches: [], hasMore: true })}
            />
          )
        }
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
    height: Math.floor(height * 0.35), 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  gradient: { 
    height: '80%', 
    width: '90%', 
    borderRadius: 30 
  },
  noNotificationContainer: { 
    height: '80%', 
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
  },
  noMatchContainer: { height: 500, alignItems: 'center', justifyContent: 'center' },
  noMatchText: { fontSize: 20, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_BLUE }
});

export default MatchHomeScreen;