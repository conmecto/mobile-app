import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type UserMatchesSummaryResponse = {
    error?: string,
    errorCode?: string,
    currentMatches?: number,
    totalMatches?: number,
    highestMatchStreak?: number,
    conmectoScore?: number,
    avgMatchStreak?: number,
    avgMatchDuration?: number,
}

const UserMatchesSummary = async (userId: number, callIfUnauthorized: boolean = true): Promise<UserMatchesSummaryResponse | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/users/${userId}/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        authorization: 'Bearer ' + token 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(userId);
      if (tokens) {
        const res = await UserMatchesSummary(userId, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
        return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Match summary api error', error);
    }
  }
  return;
}

export default UserMatchesSummary;