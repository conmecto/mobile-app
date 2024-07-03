import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import { COLOR_CODE } from '../utils/enums';
import Loading from '../components/loading';
import deletePost from '../api/delete.post';
import reportUserPost from '../api/report.post';
import { getUserId } from '../utils/user.id';
import TopBar from '../components/top.bar';
import { getPolaroidDate, getFormatedView } from '../utils/helpers';
import { colors } from '../utils/constants';
import TagItem from '../components/tag';

type UserPost = {
  id: number,
  userId: number,
  location: string,
  type: string,
  createdAt: string,
  caption: string,
  match: boolean,
  reported?: boolean,
  reportedBy?: number,
  reactCount: number,
  tags: string
}

FontAwesome.loadFont();
Entypo.loadFont();
MaterialIcons.loadFont();

const { width, height } = Dimensions.get('window');

const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};
    
const ViewPostScreen = ({ navigation, route }: any) => {
  const loggedInUserId = getUserId();
  const post = route?.params?.post as UserPost;
  const showDeleteIcon = post?.userId === loggedInUserId;
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
    if (modal === 'Delete') {
      setShowDeleteModal(true);
    } else if (modal === 'Report') {
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
  const polaroidDate = getPolaroidDate(post?.createdAt);
  const [views, symbol] = getFormatedView(post.reactCount);

  const tags = post.tags?.split(',') || [];
  const tagsColor = tags.map(t => randomColor())

  return (
    <View style={styles.mainContainer}>
      <TopBar />
      <Provider>
        <Portal>
          <Modal visible={showDeleteModal} onDismiss={() => setShowDeleteModal(false)} contentContainerStyle={styles.modalStyle}>
            <View style={styles.modalContainer}>
              <Text numberOfLines={2} adjustsFontSizeToFit style={styles.deleteTitle}>
                Are you sure you want to delete this post?
              </Text>
              <Button onPress={() => onPressConfirm('delete')} buttonColor={COLOR_CODE.BRIGHT_RED} textColor={COLOR_CODE.OFF_WHITE} labelStyle={{ fontSize: 15 }}>
                Confirm
              </Button>
            </View>
          </Modal>
          <Modal visible={showReportModal} onDismiss={() => setShowReportModal(false)} contentContainerStyle={styles.modalStyle}>
            <View style={styles.modalContainer}>
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
            <View style={{ flex: 1, backgroundColor: COLOR_CODE.BLACK }}>
              <View style={{ flex: 9, padding: 10 }}>
                <View style={styles.polaroidContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: post?.location }} style={styles.imageStyle}/>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.captionContainer}>
                          <Text numberOfLines={2} adjustsFontSizeToFit style={styles.captionText}>{post?.caption}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                          <Text numberOfLines={1} style={styles.dateText}>
                            {polaroidDate}
                          </Text>
                        </View>
                        <View style={styles.viewsContainer}>
                          <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: '200' }}>
                            {views} {symbol} <MaterialIcons name='reviews' color={COLOR_CODE.GOLDEN} size={20} />
                          </Text>
                        </View>
                    </View>
                </View>
              </View>
              {/* <Video source={{ uri: post.location }} style={styles.post} onError={() => navigation.navigate('ProfileScreen')}>
                    <TouchableOpacity>              
                    </TouchableOpacity>
                  </Video> */}
              {
                post.tags &&
                (   
                  <View style={styles.tagsMainContainer}>
                    <View style={styles.tagsContainer}>
                      {
                        tags.map((tag, index) => <TagItem tag={tag} key={index} tagColor={tagsColor[index]}/>)
                      }
                    </View>
                  </View>
                )
              }
              <View style={styles.buttonContainer}>
                <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_RED} onPress={() => {
                  const modal = showDeleteIcon ? 'Delete' : 'Report';
                  return onModalHandler(modal);
                }}>
                  { showDeleteIcon ? 'Delete' : 'Report' }
                </Button>
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
  modalStyle: { alignSelf: 'center', borderRadius: 30, height: height * 0.2, width: width * 0.6, backgroundColor: COLOR_CODE.OFF_WHITE},
  modalContainer: { flex: 1, padding: 5, alignItems: 'center', justifyContent: 'space-evenly' },
  polaroidContainer: { flex: 1, backgroundColor: COLOR_CODE.OFF_WHITE, borderRadius: 30 },
  imageContainer: { flex: 4, alignItems: 'center', justifyContent: 'center' },
  imageStyle: { height: '95%', width: '95%', borderRadius: 30 },
  captionContainer: { flex: 2, alignItems: 'center', justifyContent: 'center' },
  captionText: { fontSize: 30, fontWeight: '900', fontFamily: 'SavoyeLetPlain' },
  dateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dateText: { fontSize: 30, fontWeight: '900', fontFamily: 'SavoyeLetPlain' },
  viewsContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 20 },
  buttonContainer: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },

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
  tagsMainContainer: {  height: width * 0.15, width: width * 0.7, position: 'absolute', bottom: 0 },
  tagsContainer: { flex: 1, paddingLeft: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }
});