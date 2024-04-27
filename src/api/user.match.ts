import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UserMatchRes = {
  id?: number,
  userId1?: number,
  userId2?: number,
  score?: number,
  createdAt?: Date,
  city?: string,
  country?: string,
  settingId: number,
  userId: number,
  totalMatchScore: number,
  pinnedPostId?: number,
  chatNotification?: boolean
}
const getUserMatch = async (userId: number, callIfUnauthorized: boolean = true): Promise<UserMatchRes | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/users/${userId}`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getUserMatch(userId, false);
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
      console.log('Get user match api error', error);
    }
  }
}

export default getUserMatch;