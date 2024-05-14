import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Asset } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import { COLOR_CODE } from '../utils/enums';
import Loading from '../components/loading';
import deletePost from '../api/delete.post';
import reportUserPost from '../api/report.post';
import { getUserId } from '../utils/user.id';
import TopBar from '../components/top.bar';
// import updatePinnedPost from '../api/update.pinned.post';
import { onUploadImageHandler } from '../utils/helpers';

FontAwesome.loadFont();
Entypo.loadFont();
const { width, height } = Dimensions.get('window');

const ViewPostScreen = ({ navigation, route }: any) => {
  const loggedInUserId = getUserId();
  const post = route?.params?.post;
  const showDeleteIcon = post?.userId === loggedInUserId;
  const showReportIcon = post?.userId !== loggedInUserId;
  const showUpdatePinnedPost = showDeleteIcon && post?.pinned;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [error, setError] = useState('');
  const [reportPost, setReportPost] = useState(false);
  const [removePost, setRemovePost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pinnedPost, setPinnedPost] = useState<Asset>();

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

  useEffect(() => {
    let check = true;
    const callUpdatePinnedImage = async () => {
      // const res = await updatePinnedPost(loggedInUserId as number, pinnedPost as Asset);
      // if (check) {
      //   setIsLoading(false);
      //   setPinnedPost(undefined);
      //   if (res) {
      //     navigation.goBack();
      //   }
      // }
    }
    if (pinnedPost && !isLoading) {
      setIsLoading(true);
      callUpdatePinnedImage();
    }
    return () => {
      check = false;
    }
  }, [pinnedPost])

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

  return (
    <View style={styles.mainContainer}>
      <TopBar />
      <Provider>
        <Portal>
          <Modal visible={showDeleteModal} onDismiss={() => setShowDeleteModal(false)} contentContainerStyle={{ alignSelf: 'center', borderRadius: 30, height: height * 0.2, width: width * 0.6, backgroundColor: COLOR_CODE.OFF_WHITE}}>
            <View style={{ flex: 2, padding: 5, alignItems: 'center', justifyContent: 'space-evenly' }}>
              <Text numberOfLines={2} adjustsFontSizeToFit style={styles.deleteTitle}>
                Are you sure you want to delete this post?
              </Text>
              <Button onPress={() => onPressConfirm('delete')} buttonColor={COLOR_CODE.BRIGHT_RED} textColor={COLOR_CODE.OFF_WHITE} labelStyle={{ fontSize: 15 }}>
                Confirm
              </Button>
            </View>
          </Modal>
          <Modal visible={showReportModal} onDismiss={() => setShowReportModal(false)} contentContainerStyle={{ alignSelf: 'center', borderRadius: 30, height: height * 0.2, width: width * 0.6, backgroundColor: COLOR_CODE.OFF_WHITE}}>
            <View style={{ flex: 2, padding: 5, alignItems: 'center', justifyContent: 'space-evenly' }}>
              <Text numberOfLines={2} adjustsFontSizeToFit style={styles.reportTitle}>
                Report if you find this content to be
              </Text>
              <Text style={styles.reportTitleOptions}>
                Hateful or Violent or Abusive or Sexual or Explicit or Harmful or Dangerous or Spam or Misleading or Child abuse
              </Text>
              <Button onPress={() => onPressConfirm('report')} buttonColor={COLOR_CODE.BRIGHT_RED} textColor={COLOR_CODE.OFF_WHITE} labelStyle={{ fontSize: 10 }}>
                Confirm
              </Button>
            </View>
          </Modal>
        </Portal>
        { 
          isLoading ?
          <Loading /> : 
          (
            <View style={{ flex: 1, backgroundColor: COLOR_CODE.OFF_WHITE }}>
              <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={{ uri: post.location }} style={styles.post} />
                {
                  post.pinned && <Entypo name='pin' color={COLOR_CODE.OFF_WHITE} size={50} style={styles.pinIcon}/>
                }
              </View>
              {/* {
                post.type === 'image' ? 
                (
                  <Image source={{ uri: post.location }} style={styles.post} /> 
                ) : (
                  <Video source={{ uri: post.location }} style={styles.post} onError={() => navigation.navigate('ProfileScreen')}>
                    <TouchableOpacity>              
                    </TouchableOpacity>
                  </Video>
                )
              } */}
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: COLOR_CODE.BRIGHT_RED }}>{error}{'\n'}</Text>
                { 
                  showReportIcon &&
                  <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_RED} onPress={() => onModalHandler('report')}>
                    Report Post
                  </Button>
                }
                { 
                  showUpdatePinnedPost ? (
                    <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={() => onUploadImageHandler(setError, setPinnedPost)}>
                      Update Pinned Post
                    </Button>
                  ) : (
                    showDeleteIcon && (
                      <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_RED} onPress={() => onModalHandler('delete')}>
                        Delete
                      </Button>
                    )
                  )
                }
              </View> 
            </View>   
          )
        }
      </Provider> 
    </View>
  );
}

export default ViewPostScreen;


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  pressableReportPost: {
    //position: 'absolute',
    //alignSelf: 'flex-end',
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
    //position: 'absolute',
    //alignSelf: 'flex-end',
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
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    borderRightWidth: 1
  },
  confirmPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 20,
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
    height: '90%',
    width: '90%',
    borderRadius: 30
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  reportTitleOptions: {
    fontSize: 10,
    fontWeight: 'bold',
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
  },
  cameraTouchable: { 
    height: 60, 
    width: 60, 
    borderRadius: 60, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLOR_CODE.BRIGHT_RED, 
    shadowOffset: { 
      width: 0, 
      height: 0 
    }, 
    shadowOpacity: 0.5, 
    shadowRadius: 2 
  },
  pinIcon: { 
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: '10%',
    paddingBottom: '90%'
  },
});