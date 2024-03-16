import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type LogoutRes = {
  error?: string,
  errorCode?: string,
  message?: string
}

const logout = async (userId: number, callIfUnauthorized: boolean = true): Promise<LogoutRes | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.userService.baseUrl + `/users/${userId}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await logout(userId, false);
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
      console.log('Logout api error:', error);
    }
  }
}

export default logout;