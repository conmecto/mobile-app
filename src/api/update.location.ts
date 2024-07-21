import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UpdateResponse = {
    message?: string,
    errorCode?: string
}

type UpdateUserLocationObj = {
  latitude: number,
  longitude: number
}

const updateUserLocation = async (
    userId: number, updateObj: UpdateUserLocationObj, callIfUnauthorized: boolean = true
) : Promise<UpdateResponse | undefined> => {
  try {
    const body = JSON.stringify(updateObj);
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/users/${userId}/location`, {
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
        const res = await updateUserLocation(userId, updateObj, false);
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
      console.log('Update location api error', error);
    }
  }
}

export default updateUserLocation;