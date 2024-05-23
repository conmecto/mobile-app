import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type ProfileRes = {
  id: number,
  city?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number
}

type UserProfileRes = {
  [key: number]: ProfileRes
}

const getMultipleUsersProfile = async (userIds: number[], loggedInUserId: number, callIfUnauthorized: boolean = true): Promise<{ data: UserProfileRes } | undefined> => {
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
    if (Environments.appEnv !== 'prod') {
      console.log('Get multiple profiles by userIds api error', error);
    }
  }
}

export default getMultipleUsersProfile;