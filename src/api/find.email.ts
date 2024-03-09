import Environments from '../utils/environments';

type FindEmailRes = {
  userId?: number,
  error?: string,
  errorCode?: string
}

const findEmail = async (email: string): Promise<FindEmailRes | undefined> => {
  try {
    const response = await fetch(Environments.api.userService.baseUrl + `/users/check?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 404) {
      return jsonResponse;
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse;
    }
  } catch(error) {
    console.log('Find email api error:', error);
  }
}

export default findEmail;