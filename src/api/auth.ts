import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';

type AuthenticateRefreshToken = {
  userId: number,
  access: string,
  refresh: string
}

const authenticateRefreshToken = async (refreshToken: string): Promise<AuthenticateRefreshToken | undefined> => {
  if (!refreshToken) {
    return;
  }
  try {
    const body = JSON.stringify({
      'grant_type': 'refresh_token',
      'refresh_token': `Bearer ${refreshToken}`
    })
    const response = await fetch(Environments.api.userService.baseUrl + '/users/auth/silent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body
    });
    if (response.status === 200) {
      const jsonResponse = await response.json();
      return jsonResponse.data[0];
    } 
  } catch(error) {
    console.log('Refresh token authenticate error:', error);
  }
}

export default authenticateRefreshToken;