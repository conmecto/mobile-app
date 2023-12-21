import React, { useState } from 'react';
import { Dimensions, View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { COLOR_CODE } from '../utils/enums';
import { formatText } from '../utils/helpers';

const { width, height } = Dimensions.get('window');

const SearchedProfilesList = ({ searchResult, onPressProfileHandler, onCancelPressHandler }: any) => {  
  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity 
        style={styles.itemContainer} 
        onPress={() => { 
          onPressProfileHandler(Number(item.userId)); onCancelPressHandler(); 
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.profilePicture }} style={styles.image}/>
        </View>
        <View style={styles.nameContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.nameText}>{formatText(item.name)}</Text>
        </View>
      </TouchableOpacity> 
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={searchResult}
        renderItem={renderItem}
        keyExtractor={(item: any, index: number) => item.userId?.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },

  itemContainer: {
    height: height * 0.07,
    flexDirection: 'row',
  },

  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: height * 0.05,
    width: height * 0.05,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLOR_CODE.OFF_WHITE
  },

  nameContainer: {
    flex: 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  nameText: {
    marginLeft: 10,
    fontSize: height * 0.02,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },

  horizontalLine: {
    height: 1,
    width: '90%',
    backgroundColor: COLOR_CODE.OFF_WHITE
  }, 
});

export default SearchedProfilesList;