import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR_CODE } from '../utils/enums';
import getUserProfile from '../api/user.profile';
import Loading from '../components/loading';
import { createChatSocketConnection, getChatSocketInstance } from '../sockets/chat.socket';
import { formatText, fireColorScoreBased } from '../utils/helpers';
import updateChatsRead from '../api/update.chats.read';

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

Ionicons.loadFont();
MaterialCommunityIcons.loadFont();

const { width, height } = Dimensions.get('window');

const MatchHomeScreen = ({ route, navigation }: any) => {
  const params = route?.params;
  const userId = params?.userId;
  const matchedUserId = params?.userMatchRes?.matchedUserId;
  const matchId = params?.userMatchRes?.id;
  const [profileDataFetchError, setIsProfileDataFetchError] = useState(false);
  const [matchedUserProfile, setMatchedUserProfile] = useState<UserProfileRes>();
  const [isLoading, setIsLoading] = useState(true);
  const [markChatsRead, setMarkChatsRead] = useState(false);
  if (!getChatSocketInstance()) {
    createChatSocketConnection(userId);
  }
  
  useEffect(() => {
    let check = true;
    const fetchData = async () => {
      const matchedUserProfileRes = await getUserProfile(matchedUserId);
      if (check) {
        if (matchedUserProfileRes) {
          setMatchedUserProfile(matchedUserProfileRes);
          setIsProfileDataFetchError(false);
        } else {
          setIsProfileDataFetchError(true);
        }
        setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      check = false;
    }
  }, []);

  useEffect(() => {
    let check = true;
    const callMarkChatsRead = async () => {
      await updateChatsRead(matchId, userId);
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

  const onImagePressHandler = () => {
    navigation.navigate('CommonProfileScreen', { ...params, routedUserId: matchedUserProfile?.userId });
  }

  const onChatPressHandler = () => {
    setMarkChatsRead(true);
    navigation.navigate('MatchChatScreen', { matchId, matchedUserId });
  }

  return (
      <SafeAreaView style={styles.matchContainerMain}> 
      { 
        isLoading ? 
        (<Loading />) :
        (
          profileDataFetchError ? 
          (<Text>Error</Text>) :
          (
            <View style={styles.matchContainerBody}>
              <View style={styles.matchContainerBodyTop}>
                <View style={styles.congratsTitleContainer}>
                  <Text style={styles.congratsTitle}>You have a Match!</Text>
                </View>
              </View>

              <View style={styles.matchContainerBodyBottom}>
                <LinearGradient colors={[COLOR_CODE.BRIGHT_RED, COLOR_CODE.BRIGHT_BLUE]} style={styles.gradient}>
        
                  <View style={styles.introContainer}>
                    <View style={styles.imageContainer}>
                      <TouchableOpacity style={styles.profileImagePressable} onPress={onImagePressHandler}>
                        <Image source={{uri: matchedUserProfile?.profilePicture}} style={styles.profileImage}/>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.detailsContainer}>
                      <View style={styles.nameContainer}>
                        <Text numberOfLines={3} adjustsFontSizeToFit style={styles.name}>{formatText(matchedUserProfile?.name)}</Text>
                      </View>
                      <View style={styles.ageContainer}>
                        <Text style={styles.age}>{matchedUserProfile?.age}</Text>
                      </View>
                      <View style={styles.locationContainer}>
                        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.location}>{formatText(matchedUserProfile?.city)}, {formatText(matchedUserProfile?.country)}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.horizontalLine}></View>

                  <View style={styles.aboutContainer}>
                    <Text style={styles.aboutTitle}>About</Text>
                    <View style={styles.aboutDetails}>
                      <Text numberOfLines={10} adjustsFontSizeToFit style={styles.aboutText}>{matchedUserProfile?.description?.length ? matchedUserProfile?.description : 'Empty'}</Text>
                    </View>
                  </View>
      
                  <View style={styles.interestsContainer}>
                    <Text style={styles.interestsTitle}>Interests</Text>
                    <View style={styles.interestsDetails}>
                      <Text numberOfLines={10} adjustsFontSizeToFit style={styles.interestText}>{matchedUserProfile?.interests?.length ? matchedUserProfile.interests : 'Empty'}</Text>
                    </View>
                  </View>
      
                  <View style={styles.scoreContainer}>
                    <MaterialCommunityIcons name='fire' color={fireColorScoreBased(params.userMatchRes.score)} size={height * 0.07}/> 
                    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.scoreText}>{params.userMatchRes.score}</Text>
                  </View>
      
                  <View style={styles.chatContainer}>
                    <TouchableOpacity style={styles.chatIconPressable} onPress={onChatPressHandler}>
                      <Ionicons name='chatbubble-ellipses-outline' color={COLOR_CODE.OFF_WHITE} size={width * 0.12} />
                    </TouchableOpacity> 
                  </View>

                </LinearGradient>
              </View> 
            </View>
          )
        )
      }
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  matchContainerMain: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },


  matchContainerBody: {
    width: '95%',
    height: '95%',
    borderRadius: 30,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },


  matchContainerBodyTop: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: COLOR_CODE.OFF_WHITE
  }, 
  congratsTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  congratsTitle: {
    fontStyle: 'italic',
    color: COLOR_CODE.GREEN,
    fontWeight: '900',
    fontSize: height * 0.03,
  },


  matchContainerBodyBottom: {
    flex: 10,
    borderRadius: 30,
  },
  gradient: {
    flex: 5,
    borderRadius: 30,
  },
  
  introContainer: {
    flex: 2,
    flexDirection: 'row',
  },

  imageContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  profileImagePressable: {
    height: width * 0.22,
    width: width * 0.22,
    alignItems: 'center',
  },
  profileImage: {
    height: '100%',
    width: '100%',
    borderColor: COLOR_CODE.OFF_WHITE,
    borderWidth: 2,
    borderRadius: 200
  },

  detailsContainer: {
    flex: 2,
  },
  nameContainer: {
    flex: 2,
    paddingLeft: width * 0.08,
    alignItems: 'flex-start',
    justifyContent: 'center',
//    borderWidth: 1
  },
  ageContainer: {
    flex: 1,
    paddingLeft: width * 0.08,
    alignItems: 'flex-start',
    justifyContent: 'center',
//    borderWidth: 1
  },
  locationContainer: {
    flex: 1,
    paddingLeft: width * 0.08,
    alignItems: 'flex-start',
    justifyContent: 'center',
//    borderWidth: 1
  },
  age: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: 'bold',
    fontSize: 25
  },
  location: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: 'bold',
    fontSize: 25
  },
  name: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: 'bold',
    fontSize: 35
  },

  aboutContainer: {
    flex: 1,
    padding: width * 0.03,
  },
  aboutTitle: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: '600',
    fontSize: width * 0.05
  },
  aboutDetails: {
    height: '65%',
    width: '100%',
    marginTop: height * 0.01,
    backgroundColor: COLOR_CODE.LIGHT_SILVER,
    borderRadius: 20,
    padding: 10,
  },
  aboutText: {
    color: COLOR_CODE.BLACK,
    fontWeight: '500',
    fontSize: width * 0.03,
  },

  interestsContainer: {
    flex: 1,
    padding: width * 0.03,
  },
  interestsTitle: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: '600',
    fontSize: width * 0.05,
  },
  interestsDetails: {
    height: '65%',
    width: '100%',
    marginTop: height * 0.01,
    backgroundColor: COLOR_CODE.LIGHT_SILVER,
    borderRadius: 20,
    padding: 10,
  },
  interestText: {
    color: COLOR_CODE.BLACK,
    fontWeight: '500',
    fontSize: width * 0.03,
  },

  scoreContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: 'bold',
    fontSize: width * 0.1,
  },

  chatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIconPressable: {
    height: '90%',
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  }, 

  horizontalLine: {
    height: 4,
    width: '100%',
    backgroundColor: COLOR_CODE.OFF_WHITE
  }, 
});

export default MatchHomeScreen;