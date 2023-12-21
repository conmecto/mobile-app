import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
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
  page: number
}

const getChats = async ({ matchId, userId, page }: params, callIfUnauthorized: boolean = true): Promise<Chats[] | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/${matchId}/chats?userId=${userId}&page=${page}&perPage=20`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getChats({ matchId, userId, page }, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
        return jsonResponse;
    }
  } catch(error) {
    console.log('Get user chats api error', error);
  }
  return;
}

export default getChats;