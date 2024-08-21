import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type Response = {
    error?: string,
    errorCode?: string,
    conmectoScore?: number
}

const getConmectoScore = async (userId: number, callIfUnauthorized: boolean = true): Promise<Response | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/users/${userId}/conmecto-score`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token,
        'X-Country-Code': getUserCountry() 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getConmectoScore(userId, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
        return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Get conmecto score api error', error);
    }
  }
  return;
}

export default getConmectoScore;