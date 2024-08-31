import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type UserMatchSettingObject = {
  id?: number,
  userId?: number,
  country?: string, 
  searchFor?: string,
  minSearchAge?: number,
  maxSearchAge?: number,
  searchArea?: string,
  geohash?: string,
  gender?: string,
  dob?: Date
}

const getUserMatchSettings = async (userId: number, callIfUnauthorized: boolean = true): Promise<UserMatchSettingObject | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/setting/${userId}`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token,
        'X-Country-Code': getUserCountry() 
      },
    });
    if (response?.status === 404) {
      // HOW TO HANDLE THIS?
      return;
    }
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getUserMatchSettings(userId, false);
        return res;
      }
    }
    const jsonResponse = await response.json();
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Get user match settings api error', error);
    }
  }  
}

export default getUserMatchSettings;