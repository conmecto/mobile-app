import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type UserPost = {
  id: number,
  userId: number,
  location: string,
  type: string,
  createdAt: string,
  profilePicture?: string,
  name: string,
  caption: string,
  match: boolean,
  reported?: boolean,
  reactCount: number,
  reacted: boolean,
  tags: string
}

type UserPostRes = {
  feed: UserPost[],
  hasMore: boolean
}

type PaginationOptions = {
  page: number,
  perPage: number
}

const getFeed = async (userId: number, paginationOptions: PaginationOptions, callIfUnauthorized: boolean = true): Promise<UserPostRes | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/users/${userId}/feed?page=${paginationOptions.page}&perPage=${paginationOptions.perPage}`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token,
        'X-Country-Code': getUserCountry() 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getFeed(userId, paginationOptions, false);
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
      console.log('Get user feed api error', error);
    }
  } 
}

export default getFeed;