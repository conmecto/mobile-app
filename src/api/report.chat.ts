import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

const reportChat = async (matchId: number, chatId: number, userId: number, callIfUnauthorized: boolean = true): Promise<undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/${matchId}/chats/${chatId}/report`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token 
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await reportChat(matchId, chatId, userId, false);
        return res;
      }
    }
    if (response?.status === 404) {
      // HOW TO HANDLE THIS?
      return;
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Report chat api error', error);
    }
  }
}

export default reportChat;