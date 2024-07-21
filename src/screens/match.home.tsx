import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { RESULTS } from 'react-native-permissions';
import { createChatSocketConnection, getChatSocketInstance } from '../sockets/chat.socket';
import MatchedUser from '../components/matched.user';
import TopBar from '../components/top.bar'; 
import ConmectoBotAnimated from '../components/conmecto.animated';
import updateChatsRead from '../api/update.chats.read';
import getUserMatches from '../api/user.matches';
import getMultipleUsersProfile from '../api/multiple-users.profile';
import Environments from '../utils/environments';
import { checkLocation } from '../utils/update.location';
import { COLOR_CODE } from '../utils/enums';
import { getUserId } from '../utils/user.id'; 
import { FINDING_GIF } from '../files';

type UserProfileRes = {
  id: number,
  profilePicture?: string,
  userId: number,
  name: string,
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

const { height, width } = Dimensions.get('window');

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
  const [locationDenied, setLocationDenied] = useState(false);
  
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

  useEffect(() => {
    let check = true;
    const callCheckLocation = async () => {
      const res = await checkLocation();
      if (check && res && res === RESULTS.BLOCKED) {
        setLocationDenied(true);
      }
    }
    if (!locationDenied) {
      callCheckLocation();
    }
    return () => {
      check = false;
    }
  }, []);

  const linkToLocationSetting = async () => {
    try {
      await Linking.openSettings();
    } catch(error) {
      if (Environments.appEnv !== 'prod') {
        console.log('location linking error', error);
      }
    }
  }
  
  const onPressRefresh = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HomeTabNavigator' }],
      })
    );
  }

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
          <LinearGradient colors={[COLOR_CODE.FIRE_BLUE, COLOR_CODE.OFF_WHITE]} style={styles.gradient}>
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

  const onPressActivity = () => {
    navigation.navigate('MatchSummaryScreen');
  } 

  const NoMatch = () => {
    return (
      <View style={styles.noMatchContainer}>
        <Text numberOfLines={2} style={styles.noMatchText}>
          Finding matches <Image source={FINDING_GIF} style={styles.noMatchGif}/>
        </Text>
        <Text numberOfLines={2} style={styles.noMatchText}>
          Keep adding more Polaroids 😃
        </Text>
      </View>
    );
  } 

  const currentMatches = matchObj.matches.length;

  return (
    <View style={styles.mainContainer}>
      <TopBar />
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}> 
          <View style={styles.matchesTitleContainer}>
            <Text style={styles.matchesTitleText}>
              Matches
            </Text>           
          </View>
          <View style={styles.activityButtonContainer}>
            <TouchableOpacity onPress={() => onPressActivity()} style={styles.activityButtonTouchable}>
              <Text style={styles.activityButtonText}>Activity</Text>
              <MaterialCommunityIcons name='arrow-top-right-thick' color={COLOR_CODE.OFF_WHITE} size={20}/>
            </TouchableOpacity>
          </View>
        </View> 
        {
          !locationDenied && (
            (currentMatches && currentMatches < 10) ? (
              <View style={styles.findingMoreContainer}>
                <Text numberOfLines={1} style={styles.findingMoreText}>
                  Finding more Matches
                <Image source={FINDING_GIF} style={{ height: 20, width: 20 }}/>
                </Text>
              </View>
            ) : (
              <View></View>
            )
          )
        }
        <View style={{ flex: 1 }}>
          {
            !locationDenied && (currentMatches ? 
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
                renderItem={({ item }) => <NoMatch />}
                keyExtractor={(item: any, index: number) => ''}
                showsVerticalScrollIndicator={false}
                refreshing={matchObj.isRefreshing}
                onRefresh={() => setMatchObj({ page: 1, isLoading: true, isRefreshing: true, matches: [], hasMore: true })}
              />
            ))
          }
          {
            locationDenied && (
              <View style={styles.locationContainer}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.locationText1}>
                  Location access denied!
                </Text>
                <Text numberOfLines={2} adjustsFontSizeToFit style={styles.locationText2}>
                  Conmecto use your location for matches,
                </Text>
                <Text numberOfLines={2} adjustsFontSizeToFit style={styles.locationText2}>
                  Please enable Location📍 access from the setting.
                </Text>
                <Text>{'\n'}</Text>
                <View style={{ flex: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={() => onPressRefresh()}>
                    Refresh
                  </Button>
                  <Button mode='contained' buttonColor={COLOR_CODE.BLACK} onPress={() => linkToLocationSetting()}>
                    Setting
                  </Button>
                </View>
              </View>
            )
          }
        </View>
        <View style={styles.conmectoAnimatedContainer}>
          <ConmectoBotAnimated navigate={navigation.navigate} />
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
    height: Math.floor(height * 0.15), 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  gradient: { 
    height: '80%', 
    width: '95%', 
    borderRadius: 20 
  },
  noNotificationContainer: { 
    height: '80%', 
    width: '95%', 
    borderRadius: 20, 
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
  noMatchText: { fontSize: 20, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_BLUE },
  noMatchGif: { height: 40, width: 40 },
  headerContainer: { height: height * 0.05, width, flexDirection: 'row' },
  matchesTitleContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' },
  matchesTitleText: { fontSize: 15, fontWeight: 'bold', paddingLeft: width * 0.05 },
  activityButtonContainer: { flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: width * 0.05 },
  activityButtonTouchable: {
    width: '40%', height: '70%', alignItems: 'center', 
    justifyContent: 'center', flexDirection: 'row', borderRadius: 20, backgroundColor: COLOR_CODE.BRIGHT_RED 
  },
  activityButtonText: { fontSize: 12, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE },
  conmectoAnimatedContainer: { position: 'absolute', right: 0, bottom: 0, width: height * 0.12, height: height * 0.12, backgroundColor: 'transparent' },
  findingMoreContainer: { height: height * 0.03, alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: width * 0.05 },
  findingMoreText: { fontSize: 10, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_BLUE  },
  locationContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  locationText1: { fontSize: 20, color: COLOR_CODE.BRIGHT_BLUE, fontWeight: 'bold' },
  locationText2: { fontSize: 15, color: COLOR_CODE.BRIGHT_BLUE, fontWeight: 'bold' }
});

export default MatchHomeScreen;