import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR_CODE } from '../utils/enums';

FontAwesome.loadFont();

const { width, height } = Dimensions.get('window');

const NoMatchScreen = () => {  
  return (
    <SafeAreaView style={styles.noMatchContainer}> 
      <View style={styles.noMatchMessageContainer}>
        <FontAwesome name='info-circle' color='red' size={25} />
        <Text style={styles.noMatchText}>
          We will notify you as soon as we find the Perfect Match for you.
        </Text>
      </View>
      <View style={styles.tipsContainer}>
        <LinearGradient colors={[COLOR_CODE.BRIGHT_BLUE, COLOR_CODE.BRIGHT_RED]}style={styles.gradient}>
          <View style={styles.tipsTitleContainer}>
            <Text style={styles.tipsTitle}>About the Game</Text>
          </View>

          <View style={styles.settingTipContainer}>
            <View style={styles.settingIconContainer}>
              <FontAwesome name='gear' color={COLOR_CODE.BLACK} size={30}/>
            </View>
            <View style={styles.settingInfoContainer}>
              <Text style={styles.settingInfo}>Try different settings to increase your chances for a match e.g. city or age</Text>
            </View>
          </View>

          <View style={styles.profileTipContainer}>
            <View style={styles.profileIconContainer}>
              <FontAwesome name='user' color={COLOR_CODE.BLACK} size={30}/>
            </View>
            <View style={styles.profileInfoContainer}>
              <Text style={styles.profileInfo}>Upload posts & add other details for that hot profile</Text>
            </View>
          </View>

          <View style={styles.exploreTipContainer}>
            <View style={styles.exploreIconContainer}>
              <FontAwesome name='search' color={COLOR_CODE.BLACK} size={30}/>
            </View>
            <View style={styles.exploreInfoContainer}>
              <Text style={styles.exploreInfo}>Explore other users and top matches</Text>
            </View>
          </View>
          
          <View style={styles.scoreTipContainer}>
            <View style={styles.scoreIconContainer}>
              <FontAwesome name='level-up' color={COLOR_CODE.BLACK} size={30}/>
            </View>
            <View style={styles.scoreInfoContainer}>
              <Text style={styles.scoreInfo}>When matched, keep the chatting game on to increase your match's score</Text>
            </View>
          </View>

        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

export default NoMatchScreen;

const styles = StyleSheet.create({
  noMatchContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  noMatchMessageContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center', 
    justifyContent: 'space-evenly'
  },
  noMatchText: {
    color: COLOR_CODE.BRIGHT_BLUE,
    padding: 5,
    fontSize: 15,
    fontWeight: '800'
  },

  tipsContainer: {
    flex: 6,
    width: '90%',
    borderRadius: 30,
    marginBottom: height * 0.01,
  },
  gradient: {
    flex: 1,
    borderRadius: 30,
    marginBottom: height * 0.01,
  },

  tipsTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tipsTitle: {
    color: COLOR_CODE.OFF_WHITE,
    fontSize: height * 0.03,
    fontWeight: '900',
    textDecorationLine: 'underline'
  },
  
  settingTipContainer: {
    flex: 2,
    flexDirection: 'row'
  },
  settingIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfoContainer: {
    flex: 3,
    padding: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  settingInfo: {
    color: COLOR_CODE.OFF_WHITE,
    fontSize: height * 0.025,
    fontWeight: '900',
  },

  profileTipContainer: {
    flex: 2,
    flexDirection: 'row'
  },
  profileIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfoContainer: {
    flex: 3,
    padding: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  profileInfo: {
    color: COLOR_CODE.OFF_WHITE,
    fontSize: height * 0.025,
    fontWeight: '900',
  },

  exploreTipContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  exploreIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreInfoContainer: {
    flex: 3,
    padding: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  exploreInfo: {
    color: COLOR_CODE.OFF_WHITE,
    fontSize: height * 0.025,
    fontWeight: '900',
  },

  scoreTipContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  scoreIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreInfoContainer: {
    flex: 3,
    padding: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  scoreInfo: {
    color: COLOR_CODE.OFF_WHITE,
    fontSize: height * 0.025,
    fontWeight: '900',
  },
});