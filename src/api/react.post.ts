import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

const reactUserPost = async (postId: number, userId: number, callIfUnauthorized: boolean = true): Promise<undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/post/${postId}/react`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token 
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await reactUserPost(postId, userId, false);
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
      console.log('React user post api error', error);
    }
  }
}

export default reactUserPost;