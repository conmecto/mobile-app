import React, { useContext } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLOR_CODE } from '../utils/enums';
import { Days } from '../utils/constants';
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

MaterialCommunityIcons.loadFont();
FontAwesome.loadFont();

const ChatMessageComponent = ({ chatMessageData }: any) => {
  const { appTheme } = useContext(ThemeContext);
  const { isSender, chat, onPressViewChatFile }: { chat: Chat, isSender: boolean, onPressViewChatFile: any } = chatMessageData;
  const { message, createdAt } = chat;
  const chatDate = new Date(createdAt);  
  const hours = chatDate.getHours();
  const minutes = chatDate.getMinutes(); 
  const type = chat.type;
  
  const themeColor = appTheme === 'dark' ? {
    chatTimeText: COLOR_CODE.OFF_WHITE
  } : {
    chatTimeText: COLOR_CODE.BLACK
  }

  if (type === 'text') {
    return (
      <View style={[ styles.chatContainer, ( isSender ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' } )]}>
        <View style={( isSender ? styles.chatMessageSenderContainer : styles.chatMessageContainer )}>
          <Text style={[ styles.messageText, { color: COLOR_CODE.OFF_WHITE }]}>
            {message}
          </Text>
        </View>
        <View style={styles.chatTimeContainer}>
          <Text style={[styles.chatTimeText, { color: themeColor.chatTimeText }]}>
            {Days[chatDate.getDay()]}, { hours < 10 ? '0' + hours : hours }:{minutes < 10 ? '0' + minutes : minutes}
          </Text>
        </View>
      </View>
    );
  } 
  return (
    <TouchableOpacity onPress={() => onPressViewChatFile(chat)} style={[ styles.chatContainer, ( isSender ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' } )]}>
      <View style={[( isSender ? styles.chatMessageSenderContainer : styles.chatMessageContainer ), { backgroundColor: COLOR_CODE.BRIGHT_BLUE }]}>
        <Text style={[ styles.messageText, { color: COLOR_CODE.OFF_WHITE, fontWeight: 'bold' }]}>
          View 📸
        </Text>
      </View>
      <View style={styles.chatTimeContainer}>
        <Text style={[styles.chatTimeText, { color: themeColor.chatTimeText }]}>
          {Days[chatDate.getDay()]}, { hours < 10 ? '0' + hours : hours }:{minutes < 10 ? '0' + minutes : minutes}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({  
  chatContainer: {
    justifyContent: 'center',
    padding: 10,
  },
  chatMessageSenderContainer: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: COLOR_CODE.LOGO_COLOR
  },
  chatMessageContainer: {
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: COLOR_CODE.LOGO_BLUE
  },
  messageText: {
    fontSize: 15,
  },
  chatTimeContainer: {
    justifyContent: 'center',
    padding: 5
  },
  chatTimeText: {
    fontSize: 11,
    fontWeight: 'bold'
  }
});

export default ChatMessageComponent;
