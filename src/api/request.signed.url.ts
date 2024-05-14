import Environments from '../utils/environments';
import { Asset } from 'react-native-image-picker';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type requestBody = {
    userId: number, 
    fileName: string, 
    contentType: string
}

type UpdateProfileRes = {
    url?: string,
    fields?: any
    status?: number,
    error?: string,
    errorCode?: string,
    path?: string
}

const requestSignedUrl = async (data: requestBody, callIfUnauthorized: boolean = true): Promise<UpdateProfileRes | undefined> => {
  try {
    const token = getAccessToken();
    const body = JSON.stringify(data);
    console.log('')
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/request/signed-url`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(data.userId);
      if (tokens) {
        const res = await requestSignedUrl(data, false);
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
      console.log('Request signed url error', error);
    }
  }
}

export default requestSignedUrl;