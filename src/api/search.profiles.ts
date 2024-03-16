import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UserProfile = {
  id: number,
  userName?: string,
  profilePicture?: string,
  userId: number,
  name: string
}

const searchProfiles = async (page: number, perPage: number, q: string, userId: number, city?: string, callIfUnauthorized: boolean = true): Promise<UserProfile[]> => {
  try {
    let query = `/profile?q=${q}&page=${page}&perPage=${perPage}`;
    if (city) {
      query += `&city=${city}`;
    } else {
      query += '&sameCity=true';
    }
    const token = getAccessToken();
    const response = await fetch(Environments.api.profileService.baseUrl + query, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token,
        'user': JSON.stringify({ userId })
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await searchProfiles(page, perPage, q, userId, city, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Search profiles api error', error);
    }
  }
  return [];
}

export default searchProfiles;