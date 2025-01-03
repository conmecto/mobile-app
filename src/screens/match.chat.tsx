import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput,
  KeyboardAvoidingView, FlatList, SafeAreaView
} from 'react-native';
import { omit } from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider, Modal, Portal, Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loading from '../components/loading';
import ChatMessageComponent from '../components/chat.message';
import getChats from '../api/get.chats';
import endMatch from '../api/end.match';
import { getUserId } from '../utils/user.id';
import { COLOR_CODE, ChatSocketEvents } from '../utils/enums';
import { formatText } from '../utils/helpers';
import { getChatSocketInstance, deleteChatSocketInstance } from '../sockets/chat.socket';
import { ThemeContext } from '../contexts/theme.context';

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
  createdAt: Date,
  deletedAt: Date | null
}

type ChatObj = {
  page: number,
  isLoading: boolean,
  hasMoreChats: boolean
}

type EndMatchType = {
  error: string,  
  endMatch: boolean,
  openEndMatchModal: boolean,
  block: boolean,
  isLoading: boolean
}

MaterialCommunityIcons.loadFont();
FontAwesome.loadFont();

const { width, height } = Dimensions.get('window');

const MatchChatScreen = ({ navigation, route }: any) => {
  const { appTheme } = useContext(ThemeContext);
  const userId = getUserId() as number;
  const { matchId, matchedUserId, matchedUserName }: { 
    matchId: number, matchedUserId: number, matchedUserName: string 
  } = route?.params;
  const chatSocket = getChatSocketInstance(matchId, userId);
  if (!chatSocket || chatSocket.readyState !== 1) {
    // Handle this better
    return (
      <View style={styles.mainContainer}> 
        <View style={styles.noSocketErrorContainer}>
          <FontAwesome name='info' color='red' size={height * 0.03} />
          <Text style={styles.noSocketErrorText}>
            Something went wrong
          </Text>
        </View>
      </View>
    );
  }
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  //Convert chats to array with O(1) unshift
  const [chatObj, setChatObj] = useState<ChatObj>({
    page: 1,
    isLoading: true,
    hasMoreChats: true
  });
  const [endMatchObj, setEndMatchObj] = useState<EndMatchType>({
    error: '',
    isLoading: false,
    endMatch: false,
    openEndMatchModal: false,
    block: false
  })

  useEffect(() => {
    let check = true;
    const getData = async () => {
      const skip = chats.length;
      const res = await getChats({ matchId, userId, page: chatObj.page, skip });
      const chatObjUpdated = {
        ...chatObj,
        isLoading: false,
        loadMoreChats: false,
        hasMoreChats: false
      }
      if (check) {
        if (res?.data.length) {
          chatObjUpdated.hasMoreChats = res.hasMoreChats;
          setChats(prevData => {
            prevData.push(...res.data);
            return prevData;
          });
        }
        setChatObj(chatObjUpdated);
      }
    }
    if (chatObj.isLoading && chatObj.hasMoreChats) {
      getData();
    }
    return () => {
      check = false;
    }
  }, [chatObj.page]);

  useEffect(() => {
    let check = true;
    const callEndMatch = async () => {
      const res = await endMatch(matchId, userId, endMatchObj.block);
      const endMatchObjUpdated = {
        error: '',
        endMatch: false,
        openEndMatchModal: false,
        block: false,
        isLoading: false
      }
      if (check) {
        if (res) {
          deleteChatSocketInstance(matchId, userId);
          navigation.replace('MatchHomeScreen');  
        }
        setEndMatchObj(endMatchObjUpdated);
      }
    }
    if (endMatchObj.endMatch && !endMatchObj.error && endMatchObj.isLoading) {
      callEndMatch();
    }
    return () => {
      check = false;
    }
  }, [endMatchObj.endMatch]);

  const onPressViewProfile = () => {
    navigation.navigate('ProfileScreen', { commonScreen: true, matchedUserId });
  }

  const onPressEndMatch = () => {
    setEndMatchObj({ error: '', endMatch: false, openEndMatchModal: true, block: false, isLoading: false });
  }

  const onDismissEndMatchModal = () => {
    setEndMatchObj({ error: '', endMatch: false, openEndMatchModal: false, block: false, isLoading: false });
  }

  const onPressConfirm = (block: boolean) => {
    setEndMatchObj({ error: '', endMatch: true, openEndMatchModal: false, block, isLoading: true });
  }

  const handleLoadMoreChats = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    if (chatObj.hasMoreChats) {
      setChatObj({ ...chatObj, page: chatObj.page + 1, isLoading: true });
    }
  }

  const onPressSendHandler = () => {
    if (message.length) {
      chatSocket.send(JSON.stringify({ event: ChatSocketEvents.SAVE_MESSAGE, message }));
      const chat = {
        message, sender: userId, receiver: matchedUserId, type: 'text', 
        seen: false, matchId, createdAt: new Date(), updatedAt: new Date(), deletedAt: null 
      };
      setChats(prevData => [chat, ...prevData]);
      setMessage('');
    }
  }
  
  chatSocket.onmessage = (wsMessage: any) => {
    const parsedData = JSON.parse(wsMessage.data);
    if (parsedData?.event === ChatSocketEvents.MESSAGE_RECEIVED) {
      setChats(prevData => [omit(parsedData, ['event']) as Chat, ...prevData]);
    }
  }

  const handleChangeText = (text: string) => {
    setMessage(text);
  }

  const onPressViewChatFile = (chat: Chat) => {
    navigation.navigate('ViewChatFile', { chat });
  }

  const themeColor = appTheme === 'dark' ? {
    mainContainerBackgroundColor: COLOR_CODE.BLACK,
    headerText: COLOR_CODE.OFF_WHITE,
    textInput: COLOR_CODE.OFF_WHITE,
    chatDisappearText: COLOR_CODE.OFF_WHITE,
  } : {
    mainContainerBackgroundColor: COLOR_CODE.OFF_WHITE,
    headerText: COLOR_CODE.BLACK,
    textInput: COLOR_CODE.DIM_GREY,
    chatDisappearText: COLOR_CODE.BLACK,
  }

  const ChatView = ({ chat }: { chat: Chat }) => {
    const isSender = chat.sender === userId;
    const chatMessageData = {
      isSender,
      chat,
      onPressViewChatFile
    }
    return (
      <ChatMessageComponent chatMessageData={chatMessageData} />
    )
  }

  return (
    <KeyboardAvoidingView style={[styles.chatMainContainer, { backgroundColor: themeColor.mainContainerBackgroundColor }]} behavior='padding'>
      <Provider>
        {
          endMatchObj.isLoading ? 
          <Loading /> : 
          (
            <SafeAreaView style={{ flex: 1 }}>
              <Portal>
                <Modal visible={endMatchObj.openEndMatchModal} onDismiss={() => onDismissEndMatchModal()} contentContainerStyle={styles.modalStyle}>
                  <View style={styles.modalContainer}>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={styles.deleteTitle}>
                      Are you sure you want to end the match?
                    </Text>
                    <Button onPress={() => onPressConfirm(false)} buttonColor={COLOR_CODE.BRIGHT_RED} textColor={COLOR_CODE.OFF_WHITE} labelStyle={{ fontSize: 12 }}>
                      End Match
                    </Button>
                    <Button onPress={() => onPressConfirm(true)} buttonColor={COLOR_CODE.BLACK} textColor={COLOR_CODE.OFF_WHITE} labelStyle={{ fontSize: 12 }}>
                      End Match and Block User
                    </Button>
                  </View>
                </Modal>
              </Portal>
              <View style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                  <View style={styles.viewProfileContainer}>
                    <TouchableOpacity style={styles.viewProfileTouchable} onPress={onPressViewProfile}>
                      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.headerText, { color: themeColor.headerText }]}>
                        {formatText(matchedUserName) || 'View Profile'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.endMatchContainer}>
                    <TouchableOpacity style={styles.endMatchPressable} onPress={onPressEndMatch}>
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.endMatchText}>
                        End Match
                      </Text>     
                    </TouchableOpacity> 
                  </View>     
                </View>
                <View style={styles.bodyContainer}>
                  {
                    !chats.length && (
                      <View style={styles.chatDisappearContainer}>
                        <Text style={[styles.chatDisappearText, { color: themeColor.chatDisappearText }]}>
                          Chats will disappear after 24 hours
                        </Text>
                      </View>
                    )
                  }
                  <View style={styles.chatsContainer}>     
                    <FlatList 
                      data={chats}
                      renderItem={({ item }) => <ChatView chat={item} />}
                      keyExtractor={(chat: any, index) => index?.toString()}
                      scrollEnabled={true}
                      inverted={true}
                      style={{ flex: 1 }}
                      onEndReached={handleLoadMoreChats}
                      onEndReachedThreshold={0}
                    />
                  </View>
                  <View style={styles.inputContainer}>     
                    <View style={styles.textContainer}>     
                      <TextInput 
                        placeholder='Send message' 
                        style={[styles.textInput, { backgroundColor: themeColor.textInput }]}
                        numberOfLines={1}
                        onChangeText={handleChangeText}
                        defaultValue={message}
                      />
                    </View>
                    <View style={styles.sendButtonContainer}>     
                      <Button onPress={onPressSendHandler} buttonColor={COLOR_CODE.BRIGHT_BLUE} textColor={COLOR_CODE.OFF_WHITE}>
                        Send
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          )
        }
       </Provider>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: COLOR_CODE.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noSocketErrorContainer: {
    height: height * 0.05,
    width: width * 0.7,
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-evenly'
  },
  noSocketErrorText: {
    fontSize: height * 0.02,
    fontWeight: '600',
    color: COLOR_CODE.BRIGHT_BLUE
  },

  chatMainContainer: { 
    flex: 1
  },

  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: COLOR_CODE.LIGHT_GREY
  },

  viewProfileContainer: {
    flex: 1
  },
  viewProfileTouchable: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  endMatchContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
  },
  endMatchText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLOR_CODE.OFF_WHITE,
  },
  endMatchPressable: {
    height: '70%',
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLOR_CODE.BRIGHT_RED
  },
  bodyContainer: {
    flex: 14,
  },
  chatsContainer: {
    flex: 10,
    paddingBottom: 10,
  },
  
  inputContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  textContainer: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: height * 0.05,
    width: width * 0.75,
    borderRadius: 15,
    padding: 5,
    fontSize: 15,
  },
  
  sendButtonContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  modalStyle: { alignSelf: 'center', borderRadius: 30, height: height * 0.25, width: width * 0.6, backgroundColor: COLOR_CODE.OFF_WHITE},
  modalContainer: { flex: 1, padding: 5, alignItems: 'center', justifyContent: 'space-evenly' },
  deleteTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatDisappearContainer: { flex: 0, justifyContent: 'center', alignItems: 'center', padding: 2 },
  chatDisappearText: { fontSize: 10, fontWeight: 'bold' }
});

export default MatchChatScreen;