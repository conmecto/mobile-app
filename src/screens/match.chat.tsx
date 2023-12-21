import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, 
  KeyboardAvoidingView, FlatList, Modal
} from 'react-native';
import { omit } from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getChatSocketInstance } from '../sockets/chat.socket';
import { COLOR_CODE, ChatSocketEvents } from '../utils/enums';
import { Days } from '../utils/constants';
import { useHeaderHeight } from '@react-navigation/elements';
import getChats from '../api/get.chats';
import endMatch from '../api/end.match';

type Chats = {
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

type Errors = {
  fetchChats: string,
  sendChat: string
}

type EndMatchType = {
  error: string,  
  endMatch: boolean,
  openEndMatchModal: boolean
}

MaterialCommunityIcons.loadFont();
FontAwesome.loadFont();

const { width, height } = Dimensions.get('window');

const MatchChatScreen = ({ navigation, route }: any) => {
  const headerHeight = useHeaderHeight();
  const { userId, matchId, matchedUserId } = route?.params;
  const chatSocket = getChatSocketInstance();
  if (!chatSocket || chatSocket.readyState === 2 || chatSocket.readyState === 3) {
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
  //Convert chats to array with O(1) unshift
  const [chats, setChats] = useState<Chats[]>([]);
  const [isLoading, setIsLoading] = useState({ chats: true });
  const [page, setPage] = useState(1);
  const [loadMoreChats, setLoadMoreChats] = useState(true);
  const [errors, setErrors] = useState<Errors>({ fetchChats: '', sendChat: '' });
  const [endMatchObj, setEndMatchObj] = useState<EndMatchType>({
    error: '',
    endMatch: false,
    openEndMatchModal: false,
  })

  useEffect(() => {
    let check = true;
    const getData = async () => {
      const res = await getChats({ matchId, userId, page });
      if (check) {
        if (res?.length) {
          setChats([...chats, ...res]);
          setErrors({ ...errors, fetchChats: '' });
        } else if (res) {
          setErrors({ ...errors, fetchChats: 'No more chats' });
        } 
        setLoadMoreChats(false);
        setIsLoading({ ...isLoading, chats: false });
      }
    }
    if (!errors.fetchChats?.length && loadMoreChats) {
      getData();
    }
    return () => {
      check = false;
    }
  }, [loadMoreChats]);

  useEffect(() => {
    let check = true;
    const callEndMatch = async () => {
      const res = await endMatch(matchId, userId);
      if (check) {
        if (res) {
          setEndMatchObj({
            error: '',
            endMatch: false,
            openEndMatchModal: false,
          });
          navigation.navigate('NoMatchScreen');
        }
      }
    }
    if (endMatchObj.endMatch) {
      callEndMatch();
    }
    return () => {
      check = false;
    }
  }, [endMatchObj.endMatch]);

  const onPressEndMatch = () => {
    setEndMatchObj({ error: '', endMatch: false, openEndMatchModal: true });
  }

  const onPressConfirmOrCancelEndMatch = (check: boolean) => {
    setEndMatchObj({ error: '', endMatch: check, openEndMatchModal: false });
  }

  const handleLoadMoreChats = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    if (!errors.fetchChats.length && !loadMoreChats) {
      setPage(page + 1);
      setLoadMoreChats(true);
    }
  }

  const onPressSendHandler = () => {
    if (message.length) {
      chatSocket.send(JSON.stringify({ event: ChatSocketEvents.SAVE_MESSAGE, message }));
      const chat = { message, sender: userId, receiver: matchedUserId, type: 'text', seen: false, matchId, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
      setChats([ chat, ...chats]);
      setMessage('');
    }
  }

  chatSocket.onmessage = (wsMessage) => {
    const parsedData = JSON.parse(wsMessage.data);
    if (parsedData?.event === ChatSocketEvents.MESSAGE_RECEIVED) {
      setChats([ omit(parsedData, ['event']) as Chats, ...chats]);
    }
  }

  const handleChangeText = (text: string) => {
    setMessage(text);
  }

  const renderChats = (chat: any) => {
    const { message, sender, createdAt } = chat?.item;
    const chatDate = new Date(createdAt);  
    const isSender = sender === userId;
    const hours = chatDate.getHours();
    const minutes = chatDate.getMinutes(); 
    return (
      <View style={[ styles.chatContainer, ( isSender ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' } )]}>
        <View style={( isSender ? styles.chatMessageSenderContainer : styles.chatMessageContainer )}>
          <Text style={[ styles.messageText, ( isSender ? { color: COLOR_CODE.BLACK } : { color: COLOR_CODE.OFF_WHITE })]}>
            {message}
          </Text>
        </View>
        <View style={styles.chatTimeContainer}>
          <Text style={styles.chatTimeText}>{Days[chatDate.getDay()]}, { hours < 10 ? '0' + hours : hours }:{minutes < 10 ? '0' + minutes : minutes}</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.chatMainContainer} behavior='padding' enabled keyboardVerticalOffset={headerHeight + 100}>
      <View style={styles.headerContainer}>
        <View style={styles.fireModeContainer}>
          <Text style={styles.headerText}>Fire Mode</Text>    
          <MaterialCommunityIcons name='fire' color={COLOR_CODE.BRIGHT_RED} size={height * 0.05} /> 
        </View>
        <View style={styles.endMatchContainer}>
          <TouchableOpacity style={styles.endMatchPressable} onPress={onPressEndMatch}>
            <Text style={styles.endMatchText}>
              End
            </Text>   
            <Text style={styles.endMatchText}>
              Match
            </Text>    
          </TouchableOpacity> 
        </View>     
      </View>
      <View style={styles.noMorechatErrorContainer}>
        <Text style={styles.noMoreText}>{errors.fetchChats.length ? `------------${errors.fetchChats}------------` : ''}</Text>
      </View>
      <View style={styles.bodyContainer}>
      {
        endMatchObj.openEndMatchModal ?
        ( 
          <Modal transparent visible={endMatchObj.openEndMatchModal} animationType='none'>
            <View style={styles.endMatchModalContainer}>
              <View style={styles.endMatchMessageContainer}> 
                <Text style={{ fontSize: 20, fontWeight: '600' }}>Are you sure, you want to end the Match?</Text>
              </View>
              <View style={styles.endMatchModalButtonContainer}> 
                <TouchableOpacity style={styles.cancelButtonPressable} onPress={() => onPressConfirmOrCancelEndMatch(false)}>
                  <Text style={{ fontSize: 20, fontWeight: '600', color: COLOR_CODE.BRIGHT_RED }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButtonPressable} onPress={() => onPressConfirmOrCancelEndMatch(true)}>
                  <Text style={{ fontSize: 20, fontWeight: '600', color: COLOR_CODE.BRIGHT_BLUE }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : (
          <View style={{ flex: 1 }}>     
            <View style={styles.chatsContainer}>     
              <FlatList 
                data={chats}
                renderItem={renderChats}
                keyExtractor={(chat: any, index) => index.toString()}
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
                  placeholder='Type here' 
                  style={styles.textInput}
                  onChangeText={handleChangeText}
                  defaultValue={message}
                />
              </View>
              <View style={styles.sendButtonContainer}>     
                <TouchableOpacity style={styles.sendButtonPressable} onPress={onPressSendHandler}>
                  <FontAwesome name='chevron-circle-right' color={COLOR_CODE.BRIGHT_BLUE} size={width * 0.13}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }
      </View>
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
    flex: 1, 
  },

  headerContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  noMorechatErrorContainer: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreText: {
    fontSize: height * 0.015,
    fontWeight: '500',
    color: COLOR_CODE.BLACK,
  },

  fireModeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerText: {
    fontSize: height * 0.02,
    fontWeight: '900',
    color: COLOR_CODE.BRIGHT_BLUE,
  },

  endMatchContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 10,
  },
  endMatchText: {
    fontSize: height * 0.012,
    fontWeight: '900',
    color: COLOR_CODE.OFF_WHITE,
  },
  endMatchPressable: {
    height: height * 0.05,
    width: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLOR_CODE.BRIGHT_RED
  },
  endMatchModalContainer: {
    position: 'absolute',
    height: height * 0.2,
    width: width * 0.5,
    top: height * 0.3,
    left: width * 0.25,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    borderRadius: 30,
  },
  endMatchMessageContainer: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endMatchModalButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    borderColor: COLOR_CODE.LIGHT_GREY,
    borderTopWidth: 1
  },
  cancelButtonPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLOR_CODE.LIGHT_GREY,
    borderRightWidth: 1
  },
  confirmButtonPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bodyContainer: {
    flex: 10,
  },

  chatsContainer: {
    flex: 9,
    paddingBottom: 10,
  },
  chatContainer: {
    justifyContent: 'center',
    padding: 10
  },
  chatMessageSenderContainer: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },
  chatMessageContainer: {
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: COLOR_CODE.BRIGHT_BLUE
  },
  messageText: {
    fontSize: 15
  },
  chatTimeContainer: {
    justifyContent: 'center',
    padding: 5
  },
  chatTimeText: {
    fontSize: 11,
    fontWeight: 'bold'
  },

  inputContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  textContainer: {
    flex: 4,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textInput: {
    height: height * 0.05,
    width: width * 0.7,
    borderRadius: 30,
    padding: 10,
    backgroundColor: COLOR_CODE.LIGHT_GREY,
    fontSize: 15,
  },
  
  sendButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonPressable: {
    height: width * 0.13,
    width: width * 0.13,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default MatchChatScreen;