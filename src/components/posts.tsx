import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import Video from 'react-native-video';
import { COLOR_CODE } from '../utils/enums';
import { postOptions, maxFileSizeBytes, allowedFileTypes } from '../utils/constants';
import addPost from '../api/add.post';

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

const Posts = ({ navigation, posts, userId, setPostPagination, setIsPostLoading, setPosts, postPagination }: any) => {
  const [postFields, setPostFields] = useState<{
    postError: string,
    addPost: boolean,
    newPost: Asset | null
  }>({
    postError: '',
    addPost: false,
    newPost: null
  });
  
  useEffect(() => {
    const uploadPost = async () => {
      const res = await addPost(userId, postFields.newPost as Asset);
      let postError = '';
      if (res?.error) {
        //handle this
        postError = '';
      } else if (res) {
        setPosts([[]]);
        setPostPagination({ 
          isPostFetchComplete: false,
          isPostScrollAtEnd: true,
          page: 1
        });
      }
      setPostFields({
        postError,
        addPost: false,
        newPost: null
      });
      setIsPostLoading(false);
    }
    if (postFields.addPost) {
      setIsPostLoading(true);
      uploadPost();
    }
  }, [postFields.addPost]);

  useEffect(() => {
    if (postFields.postError.length) {
      let timerId = setTimeout(() => {
        setPostFields({ ...postFields, postError: '' });
      }, 5000);
      return () => {
        clearTimeout(timerId);
      }
    }
  }, [postFields.postError]);

  const handleFileImport = () => {
    if (posts.length === 3 && posts[2].length === 2) {
      setPostFields({ newPost: null, addPost: false, postError:  'Great, you have reached the max limit for adding posts' });
      return;
    }
    launchImageLibrary(postOptions as ImageLibraryOptions, res => {
      if (res.errorMessage) {
        setPostFields({ newPost: null, addPost: false, postError: res.errorMessage });
      } else if (res.assets?.length) {
        const asset = res.assets[0];
        if (!asset.fileSize || !asset.type) {
          setPostFields({ newPost: null, addPost: false, postError:  'Corrupt file' });
        } else if (asset.fileSize > maxFileSizeBytes) {
          setPostFields({ newPost: null, addPost: false, postError: 'File size exceed 100mb' });
        } else if (!allowedFileTypes.includes(asset.type)) {
          setPostFields({ newPost: null, addPost: false, postError: 'File type not supported' });
        } else {
          setPostFields({ newPost: asset, addPost: true, postError: '' });
        }
      }
    });
  }

  const onAddPostHandler = () => {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
      switch(result) {
        case RESULTS.UNAVAILABLE:
          break;
        case RESULTS.DENIED:
          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
            console.log('request result', result)
          }).catch(error => console.log('request error', error));
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          handleFileImport();
          break;
        case RESULTS.BLOCKED:
          setPostFields({ newPost: null, addPost: false, postError: 'Please update your settings to allow photos access' });
          break;
        default: 
          break;
      }
    }).catch(error => console.log('upload post error', error));
  }

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
      <View style={styles.addPostContainer}>
        <View style={styles.addPostErrorContainer}>
          <Text numberOfLines={2} adjustsFontSizeToFit style={styles.postErrorText}>{postFields.postError}</Text> 
        </View>
        <View style={styles.addPostPressableContainer}>
          <TouchableOpacity style={styles.pressableAddPost} onPress={onAddPostHandler}>
            <FontAwesome name='plus-circle' color={COLOR_CODE.BRIGHT_BLUE} size={height * 0.04} />        
          </TouchableOpacity>
        </View>
      </View>
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

export default Posts;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 4
  },

  addPostContainer: {
    height: height * 0.05,
    width: width,
    flexDirection: 'row',
  },
  addPostErrorContainer: {
    flex: 4,
    paddingLeft: 10,
    alignItems: 'flex-end',
  },
  addPostPressableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postErrorText: {
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: 20,
    color: COLOR_CODE.BRIGHT_RED,
  },
  pressableAddPost: {
    height: height * 0.05,
    width: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center'
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

  deleteIcon: {
    position: 'absolute', 
    alignSelf: 'flex-end', 
    paddingBottom: height * 0.25, 
    paddingRight: 15
  },

  fileTypeIcon: { 
    position: 'absolute', 
    alignSelf: 'flex-end', 
    paddingTop: height * 0.2, 
    paddingRight: 10 
  }
});