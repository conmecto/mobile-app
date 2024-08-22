import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type response = {
  errorCode?: string,
  message?: string
}

const blockProfile = async (userId: number, blockedUserId: number, callIfUnauthorized: boolean = true): Promise<response | undefined> => {
  try {
    const token = getAccessToken();
    const body = JSON.stringify({ blockedUserId });
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token,
        'X-Country-Code': getUserCountry()
      },
      body
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await blockProfile(userId, blockedUserId, false);
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
      console.log('Block profile api error', error);
    }
  }
}

export default blockProfile;