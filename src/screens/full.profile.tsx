import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import getConmectoScore from '../api/get.conmecto.score';
import TopBar from '../components/top.bar';
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
  university?: string,
  work?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number
}

type params = {
  profileDetails: UserProfileRes,
  commonScreen: boolean
}

type props = {
  route: any
}

const { height, width } = Dimensions.get('window');

const FullProfileScreen = ({ route }: props) => {
  const { profileDetails }: params = route?.params;
  const { age, name, profilePicture, city, work, university, userId, description } = profileDetails;
  const [conmectoStreak, setConmectoStreak] = useState(5);

  useEffect(() => {
    let check = true;
    const callGetData = async () => {
      const res = await getConmectoScore(userId);
      if (check && res?.conmectoScore) {
        setConmectoStreak(res.conmectoScore);
      }
    }
    callGetData();
    return () => {
      check = false;
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <ScrollView style={styles.mainContainer}>
        <View style={styles.profilePicContainer}>
          <Image source={profilePicture ? { uri: profilePicture } : DEFAULT_PROFILE_PIC} style={styles.profilePic} />
        </View>
        <View style={styles.nameContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.nameText}>
            {formatText(name)} {age ? `| ${age}` : ''}
          </Text>
        </View>
        <View style={styles.commonContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.headerText}>
            Conmecto Streak
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>
            {conmectoStreak} <MaterialCommunityIcons name='fire' color={fireColorScoreBased(conmectoStreak)}/>
          </Text>
        </View>
        <View style={styles.commonContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.headerText}>
            From
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>
            <FontAwesome name='map-pin' color={COLOR_CODE.BRIGHT_RED} /> {formatText(city)}
          </Text>
        </View>
        <View style={[styles.commonContainer, description?.length ? { height: height * 0.2 } : { height: height * 0.1 }]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.headerText}>
            About
          </Text>
          <Text numberOfLines={5} adjustsFontSizeToFit style={styles.commonText}>
            {description ? description.substring(0, 250) : '-'}  
          </Text>
        </View>
        <View style={styles.commonContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.headerText}>
            Work 💼
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>
            {formatText(work) || '-'}
          </Text>
        </View>
        <View style={styles.commonContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.headerText}>
            University 📚
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.commonText}>
            {formatText(university) || '-'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default FullProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  profilePicContainer: { height: height * 0.3, width },
  profilePic: { 
    height: '100%', 
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  nameContainer: { height: height * 0.1, width, justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: COLOR_CODE.LIGHT_GREY },
  nameText: { 
    paddingLeft: 15,
    fontSize: 25, 
    fontWeight: 'bold'
  },

  commonContainer: { height: height * 0.1, width, justifyContent: 'space-evenly' },
  commonText: { 
    paddingLeft: 15,
    fontSize: 20, 
    fontWeight: 'bold',
    color: COLOR_CODE.GREY
  },
  headerText: { 
    paddingLeft: 15,
    fontSize: 15, 
    fontWeight: '900',
    color: COLOR_CODE.BRIGHT_BLUE
  }
});