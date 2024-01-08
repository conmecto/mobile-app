import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UpdateMatchSettingObject = {
  searchFor?: string,
  searchIn?: string,
  minSearchAge?: number,
  maxSearchAge?: number
}

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

const updateMatchSetting = async (userId: number, updateObj: UpdateMatchSettingObject, callIfUnauthorized: boolean = true): Promise<UserMatchSettingObject | undefined> => {
  try {
    const body = JSON.stringify(updateObj);
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/setting/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token
      },
      body
    });
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await updateMatchSetting(userId, updateObj, false);
        return res;
      }
    }
    if (response?.status === 404) {
      // HOW TO HANDLE THIS?
      return;
    }
    const jsonResponse = await response.json();
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    console.log('Get update match settings api error', error);
  }
}

export default updateMatchSetting;