import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type requestBody = {
    userId: number, 
    fileName: string, 
    contentType: string
}

type UpdateProfileRes = {
    url?: string,
    status?: number,
    error?: string,
    errorCode?: string,
    path?: string
}

const requestChatSignedUrl = async (matchId: number, data: requestBody, callIfUnauthorized: boolean = true): Promise<UpdateProfileRes | undefined> => {
  try {
    const token = getAccessToken();
    const body = JSON.stringify(data);
    const response = await fetch(Environments.api.matchService.baseUrl + `/match/${matchId}/chats/signed-url`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
        'X-Country-Code': getUserCountry() 
      },
    });
    const jsonResponse = await response.json();
    if (response?.status === 401 && callIfUnauthorized) {
      const tokens = await updateTokens(data.userId);
      if (tokens) {
        const res = await requestChatSignedUrl(matchId, data, false);
        return res;
      }
    }
    if (response?.status === 404) {
      // HOW TO HANDLE THIS?
      return;
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Request chat signed url error', error);
    }
  }
}

export default requestChatSignedUrl;