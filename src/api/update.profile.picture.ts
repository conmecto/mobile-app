import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type ProfilePictureObj = {
  key: string,
  name: string,
  mimetype: string,
  size: number, 
  height: number,
  width: number
}

type UpdateProfileRes = {
  message?: string,
  status?: number,
  error?: string,
  errorCode?: string,
  path?: string
}

const updateProfilePicture = async (
  userId: number, profilePictureObj: ProfilePictureObj, callIfUnauthorized: boolean = true
): Promise<UpdateProfileRes | undefined> => {
  try {
    const token = getAccessToken();
    const body = JSON.stringify(profilePictureObj);
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}/profile-picture`, {
      method: 'POST',
      body,
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
        const res = await updateProfilePicture(userId, profilePictureObj, false);
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
      console.log('Update profile picture error', error);
    }
  }
}

export default updateProfilePicture;