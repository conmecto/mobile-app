import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import getConmectoScore from '../api/get.conmecto.score';
import { fireColorScoreBased, formatText } from '../utils/helpers';
import { COLOR_CODE } from '../utils/enums';
import { DEFAULT_PROFILE_PIC } from '../files';

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
  profileDetails: UserProfileRes,
  navigate: any,
  commonScreen: boolean
}

const ProfileDetails = ({ profileDetails, navigate, commonScreen }: props) => {
  const defaultScore = 5;
  const [conmectoStreak, setConmectoStreak] = useState(defaultScore);

  useEffect(() => {
    let check = true;
    const callGetData = async () => {
      const res = await getConmectoScore(profileDetails.userId);
      if (check && res?.conmectoScore) {
        setConmectoStreak(res.conmectoScore);
      }
    }
    callGetData();
    return () => {
      check = false;
    }
  }, []);

  const onPressEditProfile = () => {
    navigate('EditProfileScreen', { profileDetails });
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.streakContainer}>
          <View style={styles.scoreHeaderContainer}>
            <Text style={styles.headerText}>Conmecto Streak</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>
              {conmectoStreak}<MaterialCommunityIcons name='fire' color={fireColorScoreBased(conmectoStreak)}/>
            </Text>
          </View>
        </View>
        <View style={styles.editButtonContainer}>
          {
            !commonScreen && 
            <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={onPressEditProfile}>
              Edit
            </Button>
          }
        </View>
      </View>
      <View style={styles.userInfoContainer}>
        <View style={styles.profilePicContainer}>
          <Image source={profileDetails?.profilePicture ? { uri: profileDetails?.profilePicture} : DEFAULT_PROFILE_PIC} style={styles.profilePic}/>
        </View>
        <View style={styles.detailsContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>
            {formatText(profileDetails?.name)}
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>
            {profileDetails?.age}
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>
            <FontAwesome name='map-pin' color={COLOR_CODE.BRIGHT_RED} /> {
              profileDetails?.city?.toLowerCase() === 'others' ? 
              '' : formatText(profileDetails?.city)
            }
          </Text>
        </View>
      </View>
      <View style={styles.aboutContainer}>
        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>About</Text>
        <Text numberOfLines={4} adjustsFontSizeToFit style={{ fontSize: 12 }}>{profileDetails?.description ? profileDetails?.description?.substring(0, Math.min(profileDetails.description?.length, 180)) : '-'}</Text>
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
    flex: 1, 
    //borderWidth: 1,
    flexDirection: 'row'
  },
  userInfoContainer: { 
    flex: 3, 
    flexDirection: 'row',
    //borderWidth: 1
  },
  streakContainer: { 
    flex: 3, 
    // alignItems: 'center', 
    // justifyContent: 'center',
    //borderWidth: 1
  },
  editButtonContainer: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'flex-start',
  },
  aboutContainer: { 
    flex: 1, 
    paddingLeft: 10,
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    //borderWidth: 1
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
    justifyContent: 'flex-start',
    paddingLeft: 10
  },
  scoreHeaderContainer: { 
    flex: 1, 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    paddingLeft: 10
    //borderWidth: 1
  },
  headerText: { 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
});