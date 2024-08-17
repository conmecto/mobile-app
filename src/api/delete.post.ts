import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

const deletePost = async (postId: number, userId: number, callIfUnauthorized: boolean = true): Promise<undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}/post/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token,
        'X-Country-Code': getUserCountry() 
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await deletePost(postId, userId, false);
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
      console.log('Delete user post api error', error);
    }
  }
}

export default deletePost;