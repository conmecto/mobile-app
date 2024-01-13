import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type endMatchRes = {
  error?: string,
  errorCode?: string,
  message?: string
}

const endMatch = async (matchId: number, userId: number, block: boolean, callIfUnauthorized: boolean = true): Promise<endMatchRes | undefined> => {
  try {
    const body = JSON.stringify({
      userId,
      block
    });
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/${matchId}/end`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token 
      },
      body
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await endMatch(matchId, userId, block, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
        return jsonResponse;
    }
  } catch(error) {
    console.log('End match api error', error);
  }
  return;
}

export default endMatch;