import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type Error = {
  status: number,
  error: string,
  errorCode: string,
  path: string
}

type UpdateProfileObj = {
  userName?: string,
  description?: string,
  city?: string,
  school?: string,
  work?: string,
  igId?: string,
  snapId?: string,
  interests?: string,
  name?: string
}

type UpdateProfileRes = {
  message?: string,
  status?: number,
  error?: string,
  errorCode?: string,
  path?: string
}

const updateProfile = async (userId: number, updateObj: UpdateProfileObj, callIfUnauthorized: boolean = true): Promise<UpdateProfileRes | undefined> => {
  try {
    const body = JSON.stringify(updateObj);
    const token = getAccessToken();
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token 
      },
      body
    });
   
    const jsonResponse = await response.json();
    if (response?.status === 404) {
      // HOW TO HANDLE THIS?
      return;
    }
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await updateProfile(userId, updateObj, false);
        return res;
      }
    }
    if (jsonResponse.errorCode === ERROR_CODES.CONLFIC_USER_NAME) {
      return jsonResponse;
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

export default updateProfile;