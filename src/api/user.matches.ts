import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type UserProfileRes = {
  id: number,
  city?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number
}

type UserMatchRes = {
  id?: number,
  userId1?: number,
  userId2?: number,
  score?: number,
  createdAt?: Date,
  city?: string,
  country?: string,
  chatNotification?: boolean,
  user1MatchSeenAt: Date,
  user2MatchSeenAt: Date
  profile?: UserProfileRes
}

type PaginationOptions = {
  page: number,
  perPage: number
}

const getUserMatches = async (userId: number, paginationOptions: PaginationOptions, callIfUnauthorized: boolean = true): Promise<{ data: UserMatchRes[], hasMore: boolean } | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/users/${userId}?page=${paginationOptions.page}&perPage=${paginationOptions.perPage}`, {
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
        const res = await getUserMatches(userId, paginationOptions, false);
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
      console.log('Get user matches api error', error);
    }
  }
}

export default getUserMatches;