import Environments from '../utils/environments';
import { Asset } from 'react-native-image-picker';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type UserPost = {
  id: number,
  userId: number,
  location: string,
  type: string,
  fileMetadataId: number,
  createdAt: Date,
  updatedAt: Date,
  deletedAt?: Date | null
}

type addPostRes = UserPost & {
  status?: number,
  error?: string,
  errorCode?: string,
  path?: string
}

const addPost = async (userId: number, post: Asset, callIfUnauthorized: boolean = true): Promise<addPostRes | undefined> => {
  try {
    const formData = new FormData();
    formData.append('post', {
      name: post.fileName,
      fileName: post.fileName,
      uri: post.uri,
      type: post.type,
      height: post.height,
      width: post.width
    });
    formData.append('metadata', JSON.stringify({
      height: post.height,
      width: post.width,
      name: post.fileName,
      fileName: post.fileName,
      type: post.type,
      fileSize: post.fileSize,
      timestamp: post.timestamp
    }));
    const token = getAccessToken();
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}/post`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: 'Bearer ' + token,
        'X-Country-Code': getUserCountry()
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await addPost(userId, post, false);
        return res;
      }
    }
    if (response?.status === 404) {
      // HOW TO HANDLE THIS?
      return;
    }
    if (response?.status === 201 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Add post error', error);
    }
  }
}

export default addPost;