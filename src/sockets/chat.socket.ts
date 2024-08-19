import Environments from '../utils/environments';
import { getAccessToken } from '../utils/token';
import { getChatSocketKey } from '../utils/helpers';
import { ChatSocketEvents } from '../utils/enums';

type SendFileData = {
  key: string,
  name: string,
  mimetype: string,
  size: number, 
  height: number,
  width: number,
  message: string,
  event: ChatSocketEvents,
  matchId: number,
  matchedUserId: number,
  userId: number
}

let chatSockets: {
  [key: string]: WebSocket | null
} = {}

const createChatSocketConnection = async (matchId: number, userId: number) => {
  try {
    const token = getAccessToken();
    const ws = new WebSocket(Environments.socket.matchService.baseUrl + `?userId=${userId}&matchId=${matchId}&accessToken=${token}`);
    
    const timeout = setTimeout(() => {
      ws?.close();
    }, 5000);

    ws.onopen = () => {
      clearTimeout(timeout);
    };
    
    ws.onerror = (error) => {
      clearTimeout(timeout);
      if (Environments.appEnv !== 'prod') {
        console.log(`Chat socket connection error`, error.message);
      }
    }
    
    ws.onclose = () => {
      if (Environments.appEnv !== 'prod') {
        console.log(`Chat socket connection closed`, getChatSocketKey(matchId, userId));
      }
    }
    chatSockets[getChatSocketKey(matchId, userId)] = ws;
    return ws;
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log(`Socket error`, error);
    }
  }
}

const getChatSocketInstance = (matchId: number, userId: number) => {
  return chatSockets[getChatSocketKey(matchId, userId)];
}

const deleteChatSocketInstance = (matchId: number, userId: number) => {
  const socket = chatSockets[getChatSocketKey(matchId, userId)];
  if (socket) {
    socket.close();
  }
  chatSockets[getChatSocketKey(matchId, userId)] = null;
}

const deleteAllChatSocketInstance = () => {
  for(const key in chatSockets) {
    const socket = chatSockets[key];
    if (socket) {
      socket.close();
    }
  }
  chatSockets = {};
}

const sendFileAsMessage = (data: SendFileData) => {
  const chatSocket = getChatSocketInstance(data.matchId, data.userId);
  if (chatSocket && chatSocket.readyState === 1) {
    chatSocket.send(JSON.stringify(data));
  }
}

export { 
  createChatSocketConnection, getChatSocketInstance, deleteChatSocketInstance, sendFileAsMessage,
  deleteAllChatSocketInstance
}
