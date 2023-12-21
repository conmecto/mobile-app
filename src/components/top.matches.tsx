import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLOR_CODE } from '../utils/enums';
import { formatText, fireColorScoreBased } from '../utils/helpers';

MaterialCommunityIcons.loadFont();

const { width, height } = Dimensions.get('window');
  
const TopMatchesFlatList = ({ item, profilePressedObj }: any) => {
  const { onPressProfileHandler } = profilePressedObj;
  return (
    <View>
      <View style={styles.topMatchItemContainer}>
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{item.index + 1}.</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={{ flex: 2 }}>
            <TouchableOpacity 
              style={styles.matchItemUserContainer} 
              onPress={() => onPressProfileHandler(item.userId1)}
              >
              <View style={styles.itemImageContainer}>
                <Image source={{ uri: item.profileUserId1.profilePicture }} style={styles.image}/>
              </View>
              <View style={styles.itemNameContainer}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.nameText}>{formatText(item.profileUserId1.name)}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.matchItemScoreContainer}>
            <MaterialCommunityIcons name='fire' color={fireColorScoreBased(item.score)} size={width * 0.07}/> 
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.scoreText}>{item.score}</Text>
          </View>

          <View style={{ flex: 2 }}>
            <TouchableOpacity 
              style={styles.matchItemUserContainer} 
              onPress={() => onPressProfileHandler(item.userId2)}
              >
              <View style={styles.itemImageContainer}>
                <Image source={{ uri: item.profileUserId2.profilePicture }} style={styles.image}/>
              </View>
              <View style={{ ...styles.itemNameContainer }}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.nameText}>{formatText(item.profileUserId2.name)}</Text>
              </View>
              
            </TouchableOpacity>
          </View> 
        </View>
      </View>
      <View style={styles.horizontalLine}></View>
    </View>
  );
}

export default TopMatchesFlatList;

const styles = StyleSheet.create({
  topMatchItemContainer: {
    height: height * 0.1,
    width: width * 0.9,
    flexDirection: 'row',
  },

  indexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  indexText: {
    fontWeight: '600',
    fontSize: width * 0.04,
    color: COLOR_CODE.OFF_WHITE
  },

  detailsContainer: {
    flex: 10,
    flexDirection: 'row'
  },

  horizontalLine: {
    height: 5,
    width: width,
    alignSelf: 'center',
    backgroundColor: COLOR_CODE.LIGHT_GREY
  }, 
  
  matchItemUserContainer: {
    flex: 1,
  },

  itemImageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: width * 0.1,
    width: width * 0.1,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLOR_CODE.OFF_WHITE
  },

  itemNameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: '600',
    fontSize: width * 0.03,
    color: COLOR_CODE.OFF_WHITE
  },

  matchItemScoreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  scoreText: {
    fontWeight: '500',
    fontSize: width * 0.04,
    color: COLOR_CODE.OFF_WHITE
  }
});
