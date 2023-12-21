import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UserMatchSettingObject = {
  id: number,
  userId: number,
  age?: number,
  city?: string,
  country?: string, 
  searchFor: string,
  searchIn: string,
  gender?: string,
  minSearchAge: number,
  maxSearchAge: number
}

const getUserMatchSettings = async (userId: number, callIfUnauthorized: boolean = true): Promise<UserMatchSettingObject | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/setting/${userId}`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token 
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
    console.log('Get user match settings api error', error);
  }
}

export default getUserMatchSettings;