import Environments from '../utils/environments';
import { Asset } from 'react-native-image-picker';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UpdateProfileRes = {
  postId?: number,
  status?: number,
  error?: string,
  errorCode?: string,
  path?: string
}

const updatePinnedPost = async (userId: number, pinnedPostObj: Asset, callIfUnauthorized: boolean = true): Promise<UpdateProfileRes | undefined> => {
  try {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append('post', {
      name: pinnedPostObj.fileName,
      fileName: pinnedPostObj.fileName,
      uri: pinnedPostObj.uri,
      type: pinnedPostObj.type,
      height: pinnedPostObj.height,
    });
    formData.append('metadata', JSON.stringify({
      height: pinnedPostObj.height,
      width: pinnedPostObj.width,
      name: pinnedPostObj.fileName,
      fileName: pinnedPostObj.fileName,
      type: pinnedPostObj.type,
      fileSize: pinnedPostObj.fileSize,
      timestamp: pinnedPostObj.timestamp
    }));
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}/pinned/post`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data', 
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await updatePinnedPost(userId, pinnedPostObj, false);
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

export default updatePinnedPost;