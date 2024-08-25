import Environments from '../utils/environments';
import { getUserCountry } from '../utils/user.country';

type response = {
  errorCode?: string,
  message?: string
}

const checkAccount = async (appleAuthUserId: string): Promise<response | undefined> => {
  try {
    const response = await fetch(Environments.api.userService.baseUrl + `/users/check-account?appleAuthUserId=${appleAuthUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'X-Country-Code': getUserCountry()
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 404) {
      // HOW TO HANDLE THIS?
      return;
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Check account api error', error);
    }
  }
}

export default checkAccount;