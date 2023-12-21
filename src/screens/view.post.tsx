import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, SafeAreaView, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { COLOR_CODE } from '../utils/enums';
import Loading from '../components/loading';
import deletePost from '../api/delete.post';

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const ViewPostScreen = ({ navigation, route }: any) => {
  const post = route?.params?.post;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [removePost, setRemovePost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let check = true;
    const callDeletePostApi = async () => {
      const res = await deletePost(post.id, post.userId);
      if (check) {
        setIsLoading(false);
        setRemovePost(false);
        if (res) {
          navigation.navigate('ProfileScreen');
        }
      }
    }
    if (removePost) { 
      setIsLoading(true);
      setShowDeleteModal(false);
      callDeletePostApi();
    }
    return () => {
      check = false;
    }
  }, [removePost]);

  const onDeletePostHandler = () => {
    setShowDeleteModal(true);
  }

  const onPressCancel = () => {
    setShowDeleteModal(false);
  }

  const onPressConfirm = () => {
    setRemovePost(true);
  }

  return (
    <View style={styles.mainContainer}>
      { 
        isLoading ?
        <Loading /> : 
        (
          <View>
            {
              post.type === 'image' ? 
              (
                <Image source={{ uri: post.location }} style={styles.post} /> 
              ) : (
                <Video source={{ uri: post.location }} style={styles.post} onError={() => navigation.navigate('ProfileScreen')}>
                  <TouchableOpacity>              
                  </TouchableOpacity>
                </Video>
              )
            }
            <TouchableOpacity style={styles.pressableDeletePost} onPress={onDeletePostHandler}>
              <FontAwesome name='trash-o' color={COLOR_CODE.OFF_WHITE} size={height * 0.03} />        
            </TouchableOpacity>
            {
              showDeleteModal && 
              <Modal transparent visible={showDeleteModal} animationType='none'>
                <View style={styles.deleteModal}>
                  <TouchableOpacity style={styles.cancelPressable} onPress={onPressCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <View style={styles.verticalLine}></View>
                  <TouchableOpacity style={styles.confirmPressable} onPress={onPressConfirm}>
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            }
          </View>   
        )
      }
    </View>
  );
}

export default ViewPostScreen;


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  pressableDeletePost: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: height * 0.8,
    height: height * 0.05,
    width: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: COLOR_CODE.BRIGHT_RED
  },

  deleteModal: {
    position: 'absolute',
    alignSelf: 'center',
    top: height * 0.3,
    height: width * 0.2,
    width: width * 0.5,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    borderRadius: 30,
    flexDirection: 'row'
  },
  cancelPressable: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center'
  },
  confirmPressable: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center'
  },
  cancelText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLOR_CODE.GREY
  },
  confirmText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLOR_CODE.BRIGHT_BLUE
  },

  post: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black'
  },

  deleteContainer: {
    position: 'absolute',
    marginTop: height * 0.7,
    marginLeft: width * 0.7,
    height: height * 0.05,
    width: height * 0.05,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  verticalLine: {
    height: '100%',
    width: 1,  
    backgroundColor: COLOR_CODE.GREY
  },
});