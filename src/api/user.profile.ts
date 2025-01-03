import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type UserProfileRes = {
  id: number,
  description?: string,
  city?: string,
  country?: string,
  university?: string,
  work?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number,
  preferences?: string,
	traits?: string,
	lookingFor?: string
}

const getUserProfile = async (userId: number, callIfUnauthorized: boolean = true): Promise<UserProfileRes | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token,
        'X-Country-Code': getUserCountry() 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getUserProfile(userId, false);
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
      console.log('Get user profile api error', error);
    }
  }
}

export default getUserProfile;