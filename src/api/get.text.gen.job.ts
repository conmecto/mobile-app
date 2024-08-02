import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';

type GenMessage = {
  response: string
}

const getTextGenJob = async (userId: number, jobId: number, callIfUnauthorized: boolean = true): Promise<GenMessage | undefined> => {
  try {
    const token = getAccessToken();
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/users/${userId}/gen-message/${jobId}`, {
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
        const res = await getTextGenJob(userId, jobId, false);
        return res;
      }
    }
    if (response?.status === 200 && jsonResponse) {
        return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Get Gen Message by job api error', error);
    }
  }
  return;
}

export default getTextGenJob;