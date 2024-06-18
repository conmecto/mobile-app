import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import getMultipleUsersProfile from './multiple-users.profile';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UserProfileDetail = {
  id: number,
  userName?: string,
  profilePicture?: string,
  userId: number,
  name: string
}

type UserMatchRes = {
  id: number,
  userId1: number,
  userId2: number,
  score: number,
  createdAt: Date,
  city: string,
  country: string,
  profileUserId1?: UserProfileDetail,
  profileUserId2?: UserProfileDetail
}

const getPastMatches = async (userId: number, callIfUnauthorized: boolean = true): Promise<UserMatchRes[]> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/past?count=5&userId=${userId}`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse: UserMatchRes[] = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await getPastMatches(userId, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
      const userIds: number[] = [];
      jsonResponse.forEach(match => { userIds.push(match.userId1, match.userId2); });

      if (userIds.length) {
        const profilesRes = await getMultipleUsersProfile([...new Set(userIds)], userId);
        const profileData = profilesRes?.data;
        if (profileData) {
          return jsonResponse.map(match => {
            if (profileData[match.userId1]) {
              match.profileUserId1 = profileData[match.userId1];
            }
            if (profileData[match.userId2]) {
              match.profileUserId2 = profileData[match.userId2];
            }
            return match;
          });
        }
      }
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Get past matches api error', error);
    }
  }
  return [];
}

export default getPastMatches;