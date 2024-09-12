import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RESULTS } from 'react-native-permissions';
import { createChatSocketConnection, getChatSocketInstance } from '../sockets/chat.socket';
import MatchedUser from '../components/matched.user';
import TopBar from '../components/top.bar'; 
import ConmectoBotAnimated from '../components/conmecto.animated';
import updateChatsRead from '../api/update.chats.read';
import updateMatchSeen from '../api/update.match.seen';
import getUserMatches from '../api/user.matches';
import getMultipleUsersProfile from '../api/multiple-users.profile';
import Environments from '../utils/environments';
import { checkLocation } from '../utils/update.location';
import { COLOR_CODE } from '../utils/enums';
import { getUserId } from '../utils/user.id';
import { ThemeContext } from '../contexts/theme.context';
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
  country?: string,
  chatNotification?: boolean,
  user1MatchSeenAt: Date,
  user2MatchSeenAt: Date
  profile?: UserProfileRes
}

type MatchObj = {
  matches: UserMatchRes[],
  isLoading: boolean,
  page: number,
  hasMore: boolean,
  isRefreshing: boolean
}

type MatchSeenKey = 'user1MatchSeenAt' | 'user2MatchSeenAt';

Ionicons.loadFont();
MaterialCommunityIcons.loadFont();

const { height, width } = Dimensions.get('window');

const MatchHomeScreen = ({ route, navigation }: any) => {
  const { appTheme } = useContext(ThemeContext);
  const userId = getUserId() as number;
  const perPage = 5;
  const [matchObj, setMatchObj] = useState<MatchObj>({
    matches: [],
    isLoading: true,
    isRefreshing: false,
    page: 1,
    hasMore: true
  });
  const [markChatsRead, setMarkChatsRead] = useState<number>();
  const [markMatchSeen, setMarkMatchSeen] = useState<number>();
  const [locationDenied, setLocationDenied] = useState(false);

  const currentMatches = matchObj.matches.length;

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
    const callMarkMatchSeen = async () => {
      await updateMatchSeen(markMatchSeen as number, userId);
      if (check) {
        setMatchObj(matchObj);
        setMarkMatchSeen(undefined);
      }
    }
    if (markMatchSeen) {
      callMarkMatchSeen();
    }
    return () => {
      check = false;
    }
  }, [markMatchSeen]);

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

  const onPressMatchedUser = (matchIndex: number, newMatch: boolean, matchSeenKey: MatchSeenKey) => {
    if (!isNaN(matchIndex)) {
      const pressedMatch = matchObj.matches[matchIndex];
      const matchedUserId = userId === pressedMatch.userId1 ? pressedMatch.userId2 : pressedMatch.userId1;
      if (pressedMatch?.chatNotification) {
        matchObj.matches[matchIndex].chatNotification = false;
        setMarkChatsRead(pressedMatch.id);
      }
      if (newMatch) {
        matchObj.matches[matchIndex][matchSeenKey] = new Date();
        setMarkMatchSeen(pressedMatch.id);
      }
      navigation.navigate('MatchChatScreen', { 
        matchId: pressedMatch.id, matchedUserId, matchedUserName: pressedMatch.profile?.name 
      });
    }
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

  const themeColor = appTheme === 'dark' ? {
    mainContainerBackgroundColor: COLOR_CODE.BLACK,
    matchesTitleText: COLOR_CODE.OFF_WHITE,
    findingMoreText: COLOR_CODE.OFF_WHITE,
    noMatchText: COLOR_CODE.OFF_WHITE,
    settingButtonColor: COLOR_CODE.BRIGHT_BLUE,
    refreshButtonColor: COLOR_CODE.GREY,
    locationText1: COLOR_CODE.OFF_WHITE,
  } : {
    mainContainerBackgroundColor: COLOR_CODE.OFF_WHITE,
    matchesTitleText: COLOR_CODE.BLACK,
    findingMoreText: COLOR_CODE.BRIGHT_BLUE,
    noMatchText: COLOR_CODE.BRIGHT_BLUE,
    settingButtonColor: COLOR_CODE.BLACK,
    refreshButtonColor: COLOR_CODE.BRIGHT_BLUE,
    locationText1: COLOR_CODE.BRIGHT_BLUE,
  }

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
    const userNumber = userId === item.userId1 ? 1 : 2;
    const matchSeenKey: keyof UserMatchRes = `user${userNumber}MatchSeenAt`;
    const newMatch = !item[matchSeenKey];
    
    return (
      <View style={styles.matchedUserContainer}> 
        { 
          item.profile ? 
          <MatchedUser 
            chatNotification={item.chatNotification}
            newMatch={newMatch}
            matchedUserProfile={item.profile} 
            matchScore={item.score as number} 
            onPressMatchedUser={() => onPressMatchedUser(matchIndex, newMatch, matchSeenKey)}
            onPressCamera={() => onPressCamera(item.id as number, matchedUserId as number)}
          /> : 
          (<Text style={{ alignSelf: 'center'}}>Profile load failed</Text>) 
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
        <Text numberOfLines={2} style={[styles.noMatchText, { color: themeColor.noMatchText }]}>
          Finding matches <Image source={FINDING_GIF} style={styles.noMatchGif}/>
        </Text>
        <Text numberOfLines={2} style={[styles.noMatchText, { color: themeColor.noMatchText }]}>
          Keep adding more Polaroids 😃
        </Text>
      </View>
    );
  } 

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColor.mainContainerBackgroundColor }]}>
      <TopBar />
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}> 
          <View style={styles.matchesTitleContainer}>
            <Text style={[styles.matchesTitleText, { color: themeColor.matchesTitleText }]}>
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
            (currentMatches && currentMatches < 5) ? (
              <View style={styles.findingMoreContainer}>
                <Text numberOfLines={1} style={[styles.findingMoreText, { color: themeColor.findingMoreText }]}>
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
                refreshControl={
                  <RefreshControl
                    refreshing={matchObj.isRefreshing}
                    onRefresh={() => setMatchObj({ page: 1, isLoading: true, isRefreshing: true, matches: [], hasMore: true })}
                    // colors={[COLOR_CODE.BRIGHT_BLUE]} // Android
                    tintColor={COLOR_CODE.BRIGHT_BLUE}  // iOS
                  />
                }
              />
            ) : (
              <FlatList 
                data={[{}]}
                renderItem={({ item }) => <NoMatch />}
                keyExtractor={(item: any, index: number) => ''}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={matchObj.isRefreshing}
                    onRefresh={() => setMatchObj({ page: 1, isLoading: true, isRefreshing: true, matches: [], hasMore: true })}
                    // colors={[COLOR_CODE.BRIGHT_BLUE]} // Android
                    tintColor={COLOR_CODE.BRIGHT_BLUE}  // iOS
                  />
                }
              />
            ))
          }
          {
            locationDenied && (
              <View style={styles.locationContainer}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.locationText1, { color: themeColor.locationText1 }]}>
                  Location access denied!
                </Text>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.locationText2,  { color: themeColor.locationText1 }]}>
                  Conmecto uses your location for Automated
                </Text>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.locationText2,  { color: themeColor.locationText1 }]}>
                  Matches, Please enable
                </Text>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.locationText2,  { color: themeColor.locationText1 }]}>
                  Location📍access from the setting.
                </Text>
                <Text>{'\n'}</Text>
                <View style={{ flex: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Button mode='contained' buttonColor={themeColor.refreshButtonColor} onPress={() => onPressRefresh()}>
                    Refresh
                  </Button>
                  <Button mode='contained' buttonColor={themeColor.settingButtonColor} onPress={() => linkToLocationSetting()}>
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
    flex: 1
  },
  matchedUserContainer: { 
    height: Math.floor(height * 0.15), 
    alignItems: 'center', 
    justifyContent: 'center'
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
  noMatchText: { fontSize: 20, fontWeight: 'bold' },
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
  findingMoreText: { fontSize: 10, fontWeight: 'bold'  },
  locationContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  locationText1: { fontSize: 25, fontWeight: 'bold' },
  locationText2: { fontSize: 15, fontWeight: 'bold' }
});

export default MatchHomeScreen;