import Environments from '../utils/environments';

let chatSocket: WebSocket | null = null;

const createChatSocketConnection = (userId: number) => {
  try {
    chatSocket = new WebSocket(Environments.socket.matchService.baseUrl + `?userId=${userId}`);
    chatSocket.onerror = (error) => {
      console.log(`Chat socket connection error`, error.message);
    }
    
    chatSocket.onopen = () => {
      console.log(`Chat socket connection established`);
    }

    return chatSocket;
  } catch(error) {
    console.log(`Socket error`, error);
  }
}

const getChatSocketInstance = () => {
  return chatSocket;
}

const deleteChatSocketInstance = () => {
  chatSocket = null;
}

export { createChatSocketConnection, getChatSocketInstance, deleteChatSocketInstance }
