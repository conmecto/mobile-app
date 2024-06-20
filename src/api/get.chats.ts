import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type Chats = {
  id: number,
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
  deletedAt: Date
}

type params = {
  matchId: number,
  userId: number,
  page: number,
  skip: number
}

const getChats = async ({ matchId, userId, page, skip }: params, callIfUnauthorized: boolean = true): Promise<{ data: Chats[], hasMoreChats: boolean } | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/${matchId}/chats?userId=${userId}&page=${page}&skip=${skip}&perPage=10`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getChats({ matchId, userId, page, skip }, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
        return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Get user chats api error', error);
    }
  }
  return;
}

export default getChats;