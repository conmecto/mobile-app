import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { COLOR_CODE } from '../utils/enums';

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

FontAwesome.loadFont();

const { width, height } = Dimensions.get('window');

const CommonPosts = ({ navigation, posts, setPostPagination, setIsPostLoading, postPagination }: any) => {

  const onPressPostHandler = (post: UserPost) => {
    navigation.navigate('ViewPostScreen', { post })
  }

  const onLoadMorePostHandler = () => {
    if (!postPagination.isPostFetchComplete) {
      setIsPostLoading(true);
      setPostPagination({
        isPostFetchComplete: false,
        isPostScrollAtEnd: true,
        page: postPagination.page
      });
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{ flex: 1 }}>
        {
          posts.map((post: any, index: number) => {
            if (!post.length) {
              return;
            }
            return (
              <View style={styles.postMainContainer} key={index+1}>
                <View style={styles.postContainer}>
                  <TouchableOpacity style={styles.pressableThumbnail} onPress={() => onPressPostHandler(post[0])}>
                    { 
                      post[0].type === 'image' ? 
                      (
                        <Image source={{ uri: post[0].location }} style={styles.postThumbnail} />    
                      ) : (
                        <Video source={{ uri: post[0].location }} style={styles.postThumbnail} paused={true} />
                      )
                    }
                    <FontAwesome name={post[0].type === 'image' ? 'camera' : 'video-camera'} color={COLOR_CODE.OFF_WHITE} size={height * 0.03} style={styles.fileTypeIcon} />        
                  </TouchableOpacity>
                </View>
                <View style={styles.postContainer}>
                  {
                    post.length === 2 ?
                    (
                      <TouchableOpacity style={styles.pressableThumbnail} onPress={() => onPressPostHandler(post[1])}>
                        { 
                          post[1].type === 'image' ? 
                          (
                            <Image source={{ uri: post[1].location }} style={styles.postThumbnail} />
                          ) : (
                            <Video source={{ uri: post[1].location }} style={styles.postThumbnail} paused={true} />
                          )
                        }
                        <FontAwesome name={post[1].type === 'image' ? 'camera' : 'video-camera'} color={COLOR_CODE.OFF_WHITE} size={height * 0.03} style={styles.fileTypeIcon}/>        
                      </TouchableOpacity>
                    ) : (<Text></Text>)
                  }
                </View>
              </View>
            );
          })
        }
        {
          posts.length && posts[0].length ? 
          ( 
            <View style={styles.loadMorePostContainer}>
              <TouchableOpacity style={styles.loadMorePostPressable} onPress={onLoadMorePostHandler}>
                <FontAwesome name='refresh' color={COLOR_CODE.BRIGHT_BLUE} size={height * 0.04} />        
              </TouchableOpacity>
            </View>
          ) : (
            <View></View>
          )
        }
      </ScrollView>
    </View>
  );
}

export default CommonPosts;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 4
  },

  postMainContainer: {
    height: height * 0.3,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  postContainer: {
    height: '95%',
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableThumbnail: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postThumbnail: {
    height: '100%',
    width: '100%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLOR_CODE.OFF_WHITE,
    backgroundColor: 'black'
  },

  loadMorePostContainer: {
    height: height * 0.05,
    width: width,
    alignItems: 'center'
  },
  loadMorePostPressable: {
    height: height * 0.04,
    width: height * 0.04,
    alignItems: 'center',
    justifyContent: 'center'
  },

  fileTypeIcon: { 
    position: 'absolute', 
    alignSelf: 'flex-end', 
    paddingTop: height * 0.2, 
    paddingRight: 10 
  }
});