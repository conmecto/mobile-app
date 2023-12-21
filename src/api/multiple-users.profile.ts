import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UserProfileRes = {
  id: number,
  userName?: string,
  profile_picture?: string,
  userId: number,
  name: string
}

const getMultipleUsersProfile = async (userIds: number[], loggedInUserId: number, callIfUnauthorized: boolean = true): Promise<UserProfileRes[]> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.profileService.baseUrl + `/profile/multiple-users?userIds=${userIds.join(',')}`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(loggedInUserId);
      if (tokens) {
        const res = await getMultipleUsersProfile(userIds, loggedInUserId, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    console.log('Get multiple profiles by userIds api error', error);
  }
  return [];
}

export default getMultipleUsersProfile;