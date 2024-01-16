import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { COLOR_CODE } from '../utils/enums';
import Loading from '../components/loading';
import deletePost from '../api/delete.post';
import reportUserPost from '../api/report.post';
import { getUserId } from '../utils/user.id';

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const ViewPostScreen = ({ navigation, route }: any) => {
  const loggedInUserId = getUserId();
  const post = route?.params?.post;
  const showDeleteIcon = post?.userId === loggedInUserId;
  const showReportIcon = post?.userId !== loggedInUserId;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPost, setReportPost] = useState(false);
  const [removePost, setRemovePost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let check = true;
    const callReportPostApi = async () => {
      const res = await reportUserPost(post.id, post.userId);
      if (check) {
        setIsLoading(false);
        setReportPost(false);
        if (res) {
          navigation.goBack();
        }
      }
    }
    if (reportPost && !isLoading) { 
      setIsLoading(true);
      setShowReportModal(false);
      callReportPostApi();
    }
    return () => {
      check = false;
    }
  }, [reportPost]);

  useEffect(() => {
    let check = true;
    const callDeletePostApi = async () => {
      const res = await deletePost(post.id, post.userId);
      if (check) {
        setIsLoading(false);
        setRemovePost(false);
        if (res) {
          navigation.goBack();
        }
      }
    }
    if (removePost && !isLoading) { 
      setIsLoading(true);
      setShowDeleteModal(false);
      callDeletePostApi();
    }
    return () => {
      check = false;
    }
  }, [removePost]);

  const onModalHandler = (modal: string) => {
    if (modal === 'delete') {
      setShowDeleteModal(true);
    } else if (modal === 'report') {
      setShowReportModal(true);
    }
  }

  const onPressConfirm = (modal: string) => {
    if (modal === 'delete') {
      setRemovePost(true);
    } else if (modal === 'report') {
      setReportPost(true);
    }
    
  }

  const onPressCancel = (modal: string) => {
    if (modal === 'delete') {
      setShowDeleteModal(false);
    } else if (modal === 'report') {
      setShowReportModal(false);
    }
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
            { 
              showReportIcon &&
              <TouchableOpacity style={styles.pressableReportPost} onPress={() => onModalHandler('report')}>
                <FontAwesome name='exclamation-circle' color={COLOR_CODE.OFF_WHITE} size={height * 0.03} />        
              </TouchableOpacity>
            }
            { 
              showDeleteIcon &&
              <TouchableOpacity style={styles.pressableDeletePost} onPress={() => onModalHandler('delete')}>
                <FontAwesome name='trash-o' color={COLOR_CODE.OFF_WHITE} size={height * 0.03} />        
              </TouchableOpacity>
            } 
            {
              showDeleteModal && 
              <Modal transparent visible={showDeleteModal} animationType='none'>
                <View style={styles.reportModal}>
                  <View style={styles.deleteTitleContainer}>
                    <Text numberOfLines={3} adjustsFontSizeToFit style={styles.deleteTitle}>Are you sure you want to delete this post?</Text>
                  </View>
                  <View style={styles.reportActionContainer}>
                    <View style={styles.reportCancelContainer}>
                      <TouchableOpacity style={styles.cancelPressable} onPress={() => onPressCancel('delete')}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.reportConfirmContainer}>
                      <TouchableOpacity style={styles.confirmPressable} onPress={() => onPressConfirm('delete')}>
                        <Text style={styles.confirmText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            }
            {
              showReportModal && 
              <Modal transparent visible={showReportModal} animationType='none'>
                <View style={styles.reportModal}>
                  <View style={styles.reportTitleContainer}>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={styles.reportTitle}>Report if you find this content to be</Text>
                    <Text style={styles.reportTitleOptions}>Hateful or Violent or Abusive or Sexual or Explicit or Harmful or Dangerous or Spam or Misleading or Child abuse</Text>
                  </View>
                  <View style={styles.reportActionContainer}>
                    <View style={styles.reportCancelContainer}>
                      <TouchableOpacity style={styles.cancelPressable} onPress={() => onPressCancel('report')}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.reportConfirmContainer}>
                      <TouchableOpacity style={styles.confirmPressable} onPress={() => onPressConfirm('report')}>
                        <Text style={styles.confirmText}>Report</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
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

  pressableReportPost: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: height * 0.7,
    right: width * 0.01,
    height: height * 0.05,
    width: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: COLOR_CODE.BRIGHT_RED
  },

  pressableDeletePost: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: height * 0.8,
    height: height * 0.05,
    right: width * 0.01,
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
    height: width * 0.15,
    width: width * 0.5,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    borderRadius: 20,
    flexDirection: 'row'
  },
  cancelPressable: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center'
  },
  confirmPressable: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 20,
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
    color: COLOR_CODE.BRIGHT_RED
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

  reportModal: {
    position: 'absolute',
    alignSelf: 'center',
    top: height * 0.3,
    height: width * 0.4,
    width: width * 0.5,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    borderRadius: 20
  },
  reportTitleContainer: {
    flex: 3,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: COLOR_CODE.GREY
  },
  deleteTitleContainer: {
    flex: 3,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: COLOR_CODE.GREY
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  reportTitleOptions: {
    fontSize: 10,
    fontWeight: '600',
    color: COLOR_CODE.GREY
  },
  reportActionContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  reportCancelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: COLOR_CODE.GREY
  },
  reportConfirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});