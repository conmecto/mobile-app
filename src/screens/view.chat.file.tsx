import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import { COLOR_CODE } from '../utils/enums';
import Loading from '../components/loading';
import reportChatApi from '../api/report.chat';
import { getUserId } from '../utils/user.id';
import TopBar from '../components/top.bar';

type Chat = {
  id?: number,
  sender: number,
  receiver: number,
  matchId: number,
  type: string,
  message: string,
  location?: string,
  fileMetadataId?: number,
  seen: boolean,
  seenAt?: Date,
  createdAt: string,
  deletedAt: Date | null
}

FontAwesome.loadFont();
Entypo.loadFont();
const { width, height } = Dimensions.get('window');
    
const ViewChatFile = ({ route, navigation }: any) => {
  const loggedInUserId = getUserId() as number;
  const { chat }: { chat: Chat } = route?.params;
  const showReportIcon = chat.receiver === loggedInUserId;
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportChat, setReportChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    let check = true;
    const callReportChatApi = async () => {
      const res = await reportChatApi(chat.matchId, chat.id as number, loggedInUserId);
      if (check) {
        setIsLoading(false);
        setReportChat(false);
        navigation.navigate('MatchHomeScreen');
      }
    }
    if (reportChat && isLoading) { 
      callReportChatApi();
    }
    return () => {
      check = false;
    }
  }, [reportChat]);

  const onModalHandler = () => {
    setShowReportModal(true);
  }

  const onPressConfirm = (modal: string) => {
    setIsLoading(true);
    setShowReportModal(false);
    setReportChat(true);
  }

  return (
    <View style={styles.mainContainer}>
      <TopBar />
      <Provider>
        <Portal>
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
              <View style={{ flex: 10, padding: 10 }}>
                <View style={styles.polaroidContainer}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: chat?.location }} style={styles.imageStyle}/>
                  </View>
                  <View style={styles.captionContainer}>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={styles.captionText}>
                      {chat?.message}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                {
                  showReportIcon && 
                  (
                    <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_RED} onPress={() => onModalHandler()}>
                      Report
                    </Button>
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

export default ViewChatFile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  modalStyle: { alignSelf: 'center', borderRadius: 30, height: height * 0.2, width: width * 0.6, backgroundColor: COLOR_CODE.OFF_WHITE},
  modalContainer: { flex: 1, padding: 5, alignItems: 'center', justifyContent: 'space-evenly' },
  polaroidContainer: { flex: 1, backgroundColor: COLOR_CODE.OFF_WHITE, borderRadius: 30 },
  imageContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageStyle: { height: '95%', width: '95%', borderRadius: 30 },
  captionContainer: { flex: 0, alignItems: 'center', justifyContent: 'center' },
  captionText: { fontSize: 30, fontWeight: '900', fontFamily: 'SavoyeLetPlain' },
  buttonContainer: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },

  reportTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  reportTitleOptions: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLOR_CODE.GREY
  },
});