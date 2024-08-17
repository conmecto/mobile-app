import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type UpdateMatchSettingObject = {
  searchArea?: any;
  minSearchAge?: number;
  maxSearchAge?: number;
  searchFor?: string;
  gender?: string;
}

type UserMatchSettingObject = {
  id?: number;
  searchFor?: string,
  searchArea?: string,
  minSearchAge?: number,
  maxSearchAge?: number,
  gender?: string
}

const updateMatchSetting = async (
  userId: number, updateObj: UpdateMatchSettingObject, callIfUnauthorized: boolean = true
): Promise<UserMatchSettingObject | undefined> => {
  try {
    const body = JSON.stringify(updateObj);
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/setting/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token,
        'X-Country-Code': getUserCountry()
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
    if (Environments.appEnv !== 'prod') {
      console.log('Update match settings api error', error);
    }
  }
}

export default updateMatchSetting;