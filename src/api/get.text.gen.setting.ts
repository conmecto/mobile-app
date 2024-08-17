import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type TextGenSetting = {
    current: number,
    max: number,
    lastResetAt: Date,
    isWaitingPeriod: boolean
}

const getTextGenSetting = async (userId: number, callIfUnauthorized: boolean = true): Promise<TextGenSetting | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/users/${userId}/gen-message/setting`, {
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
        const res = await getTextGenSetting(userId, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
        return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Get Text Gen Setting api error', error);
    }
  }
  return;
}

export default getTextGenSetting;