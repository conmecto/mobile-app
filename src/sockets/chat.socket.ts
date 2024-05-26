import Environments from '../utils/environments';
import { getAccessToken } from '../utils/token';
import { getChatSocketKey } from '../utils/helpers';

let chatSockets: {
  [key: string]: WebSocket | null
} = {}

const createChatSocketConnection = (matchId: number, userId: number) => {
  try {
    const token = getAccessToken();
    const ws = new WebSocket(Environments.socket.matchService.baseUrl + `?userId=${userId}&matchId=${matchId}&accessToken=${token}`);
    ws.onerror = (error) => {
      if (Environments.appEnv !== 'prod') {
        console.log(`Chat socket connection error`, error.message);
      }
    }
    ws.onopen = () => {
      if (Environments.appEnv !== 'prod') {
        console.log(`Chat socket connection established`, getChatSocketKey(matchId, userId));
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
  chatSockets[getChatSocketKey(matchId, userId)] = null;
}

export { createChatSocketConnection, getChatSocketInstance, deleteChatSocketInstance }
