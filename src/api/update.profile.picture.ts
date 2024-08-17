import Environments from '../utils/environments';
import { Asset } from 'react-native-image-picker';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type UpdateProfileRes = {
  message?: string,
  status?: number,
  error?: string,
  errorCode?: string,
  path?: string
}

const updateProfilePicture = async (userId: number, profilePictureObj: Asset, callIfUnauthorized: boolean = true): Promise<UpdateProfileRes | undefined> => {
  try {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append('profilePicture', {
      name: profilePictureObj.fileName,
      fileName: profilePictureObj.fileName,
      uri: profilePictureObj.uri,
      type: profilePictureObj.type,
      height: profilePictureObj.height,
    });
    formData.append('metadata', JSON.stringify({
      height: profilePictureObj.height,
      width: profilePictureObj.width,
      name: profilePictureObj.fileName,
      fileName: profilePictureObj.fileName,
      type: profilePictureObj.type,
      fileSize: profilePictureObj.fileSize,
      timestamp: profilePictureObj.timestamp
    }));
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}/profile-picture`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data', 
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