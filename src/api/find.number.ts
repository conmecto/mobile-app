import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type FindNumberRes = {
  userId?: number,
  error?: string,
  errorCode?: string
}

const findNumber = async (extension: string, number: string): Promise<FindNumberRes | undefined> => {
  try {
    const response = await fetch(Environments.api.userService.baseUrl + `/users/check?extension=${extension}&number=${number}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 404) {
      return jsonResponse;
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    console.log('Find number api error:', error);
  }
}

export default findNumber;