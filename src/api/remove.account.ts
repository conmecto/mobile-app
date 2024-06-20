import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type LogoutRes = {
  error?: string,
  errorCode?: string,
  message?: string
}

const removeAccount = async (userId: number, callIfUnauthorized: boolean = true): Promise<LogoutRes | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.userService.baseUrl + `/users/${userId}/account/remove`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await removeAccount(userId, false);
        return res;
      }
    }
    if (response?.status === 404) {
      // Hanlde response
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Remove Account api error:', error);
    }
  }
}

export default removeAccount;