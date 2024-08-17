import Environments from '../utils/environments';
import { updateTokens } from '../utils/helpers';
import { getAccessToken } from '../utils/token';
import { getUserCountry } from '../utils/user.country';

type Response = {
    jobId: number
}

const createTextGenJob = async (userId: number, context: string, callIfUnauthorized: boolean = true): Promise<Response | undefined> => {
    try {
        const body = JSON.stringify({ context });
        const token = getAccessToken();
        const response = await fetch(Environments.api.matchService.baseUrl + `/match/users/${userId}/gen-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                authorization: 'Bearer ' + token,
                'X-Country-Code': getUserCountry() 
            },
            body
        });
        const jsonResponse = await response.json();
        if (response?.status === 401 && callIfUnauthorized) {
            const tokens = await updateTokens(userId);
            if (tokens) {
                const res = await createTextGenJob(userId, context, false);
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
            console.log('Create Text Gen Job api error', error);
        }
    }
}

export default createTextGenJob;