import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLOR_CODE } from '../utils/enums';
import { formatText } from '../utils/helpers';

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const CommonProfileDetails = ({ profileDetails, navigation }: any) => {

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={[COLOR_CODE.BRIGHT_BLUE, COLOR_CODE.BRIGHT_RED]} style={styles.gradient}>
        <View style={styles.basicDetailsContainer}>
          <View style={styles.imageContainer}>
            <Image source={{uri: profileDetails?.profilePicture}} style={styles.profileImage} />
          </View>
          <View style={styles.nameContainer}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={styles.name}>{formatText(profileDetails?.name)}</Text>
          </View>
          <View style={styles.userNameContainer}>
            <View style={styles.userNameIconContainer}>
              <FontAwesome name='user' size={width * 0.05} color={COLOR_CODE.OFF_WHITE} />
            </View>
            <View style={styles.userNameTextContainer}>
              <Text numberOfLines={2} adjustsFontSizeToFit style={styles.userName}>{formatText(profileDetails?.userName)}</Text>
            </View>
          </View>
          <View style={styles.locationContainer}>
            <View style={styles.locationIconContainer}>
              <FontAwesome name='map-pin' size={width * 0.05} color={COLOR_CODE.OFF_WHITE} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text numberOfLines={2} adjustsFontSizeToFit style={styles.location}>{formatText(profileDetails?.city)}, {formatText(profileDetails?.country)}</Text>
            </View>
          </View>          
        </View>
        <View style={styles.fullDetailsContainer}>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>About</Text>
            <View style={styles.aboutDetails}>
              <Text numberOfLines={10} adjustsFontSizeToFit style={styles.aboutText}>{profileDetails?.description?.length ? profileDetails?.description : 'Empty'}</Text>
            </View>
          </View>

          <View style={styles.interestsContainer}>
            <Text style={styles.interestsTitle}>Interests</Text>
            <View style={styles.interestsDetails}>
              <Text numberOfLines={10} adjustsFontSizeToFit style={styles.interestText}>{profileDetails?.interests?.length ? profileDetails.interests : 'Empty'}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default CommonProfileDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },

  gradient: {
    height: '95%',
    width: '95%',
    borderRadius: 30,
    flexDirection: 'row'
  },

  basicDetailsContainer: {
    flex: 1
  },
  fullDetailsContainer: {
    flex: 1
  },

  imageContainer: {
    // borderWidth: 1,
     flex: 2,
     justifyContent: 'center',
     alignItems: 'center'
   },
   profileImage: {
     height: width * 0.15,
     width: width * 0.15,
     borderRadius: 100,
     borderWidth: 1,
     borderColor: COLOR_CODE.OFF_WHITE
   },

   nameContainer: {
    //borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: '600',
    fontSize: 20,
  },

  userNameContainer: {
   // borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
  },
  userNameIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  userNameTextContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    //borderWidth: 1
  },
  userName: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: '600',
    fontSize: 15,
  },

  locationContainer: {
    //borderWidth: 1,
    flex: 1,
    flexDirection: 'row'
  },
  locationIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   // borderWidth: 1
  },
  locationTextContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    //borderWidth: 1
  },
  location: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: '600',
    fontSize: width * 0.04,
  },

  aboutContainer: {
    flex: 1,
    padding: 10,
  },
  aboutTitle: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: '600',
    fontSize: width * 0.04,
  },
  aboutDetails: {
    height: '70%',
    width: '100%',
    marginTop: height * 0.01,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    borderRadius: 30,
    padding: 10,
  },
  aboutText: {
    color: COLOR_CODE.BLACK,
    fontWeight: '500',
    fontSize: width * 0.03,
  },

  interestsContainer: {
    flex: 1,
    padding: 10,
  },
  interestsTitle: {
    color: COLOR_CODE.OFF_WHITE,
    fontWeight: '600',
    fontSize: width * 0.04,
  },
  interestsDetails: {
    height: '70%',
    width: '100%',
    marginTop: height * 0.01,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    borderRadius: 30,
    padding: 10,
  },
  interestText: {
    color: COLOR_CODE.BLACK,
    fontWeight: '500',
    fontSize: width * 0.03,
  },
});