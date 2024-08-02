import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type PastGenMessage = {
  id: number,
  context: string, 
  response: string,
  hasMore: boolean
}

const getPastGenMessages = async (userId: number, page: number, callIfUnauthorized: boolean = true): Promise<PastGenMessage[] | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/users/${userId}/gen-message/all?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getPastGenMessages(userId, page, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
        return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Get Past Gen Messages api error', error);
    }
  }
  return;
}

export default getPastGenMessages;