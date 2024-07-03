import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UserPost = {
  id: number,
  userId: number,
  location: string,
  type: string,
  createdAt: string,
  caption: string,
  tags: string,
  match: boolean,
  reported?: boolean,
  reportedBy?: number,
  reactCount: number
}

type UserPostRes = {
  posts: UserPost[],
  hasMore: boolean
}

type PaginationOptions = {
  page: number,
  perPage: number
}

const getUserPosts = async (userId: number, paginationOptions: PaginationOptions, callIfUnauthorized: boolean = true): Promise<UserPostRes | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}/posts?page=${paginationOptions.page}&perPage=${paginationOptions.perPage}`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getUserPosts(userId, paginationOptions, false);
        return res;
      }
    }
    if (response?.status === 404) {
      // HOW TO HANDLE THIS?
      return;
    } else if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Get user posts api error', error);
    }
  } 
}

export default getUserPosts;