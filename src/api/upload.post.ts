import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type PostObj = {
  key: string,
  name: string,
  mimetype: string,
  size: number, 
  height: number,
  width: number,
  match: boolean
}

type AddPinnedPostRes = {
  message?: number,
  status?: number,
  error?: string,
  errorCode?: string,
  path?: string
}

const uploadPost = async (userId: number, pinnedPostObj: PostObj, callIfUnauthorized: boolean = true): Promise<AddPinnedPostRes | undefined> => {
  try {
    const token = getAccessToken();
    const body = JSON.stringify(pinnedPostObj);
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}/post`, {
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
        const res = await uploadPost(userId, pinnedPostObj, false);
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
      console.log('Add pinned post error', error);
    }
  }
}

export default uploadPost;