import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { COLOR_CODE } from '../utils/enums';
import { postOptions, maxFileSizeBytes, allowedFileTypes } from '../utils/constants';
import addPost from '../api/add.post';
import Environments from '../utils/environments';
import { getUserId } from '../utils/user.id';

type UserPost = {
  id: number,
  userId: number,
  location: string,
  type: string,
  fileMetadataId: number,
  createdAt: Date,
  updatedAt: Date,
  deletedAt?: Date | null
}

type PostObj = {
  posts: UserPost[],
  isLoading: boolean,
  page: number,
  hasMore: boolean,
  isRefreshing: boolean
}

type params = { postObj: PostObj, setPostObj: React.Dispatch<React.SetStateAction<PostObj>>, navigation: any }

FontAwesome.loadFont();
Entypo.loadFont();

const { width, height } = Dimensions.get('window');
const polaroidHeight = height * 0.25;
  
const Posts = ({ navigation, postObj, setPostObj }: params) => {
  const onPressPolaroid = (post: UserPost) => {
    navigation.navigate('ViewPostScreen', { post });
  }

  const Polaroid =  ({ item }: { item: UserPost}) => {
    return (
      <View style={styles.polaroidContainer}>
        <TouchableOpacity style={styles.polaroidTouchable} onPress={() => onPressPolaroid(item)}>
          <Image source={{ uri: item.location }} style={styles.polaroidImage}/>
        </TouchableOpacity>
      </View>
    );
  }

  const onLoadMorePost = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    if (postObj.hasMore) {
      setPostObj({ ...postObj, isLoading: true, page: postObj.page + 1 });
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Polaroids</Text> 
      </View>
      <View style={{ flex: 1 }}>
        <FlatList 
          data={postObj?.posts || []}
          renderItem={({ item }) => <Polaroid item={item} />}
          keyExtractor={(item: any, index: number) => item.id?.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoadMorePost}
          onEndReachedThreshold={0}
          refreshing={postObj.isRefreshing}
          onRefresh={() => setPostObj({ page: 1, isLoading: true, isRefreshing: true, posts: [], hasMore: true })}
        />
      </View>
    </View>
  );
}

export default Posts;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 4,
    // borderWidth: 1
  },

  headerContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'SavoyeLetPlain'
  },

  polaroidContainer: { flex: 0.5, height: polaroidHeight, alignItems: 'center', justifyContent: 'center' },
  polaroidTouchable: { height: '90%', width: '90%', alignItems: 'center', justifyContent: 'center' },
  polaroidImage: { height: '100%', width: '100%', borderRadius: 30 }
});