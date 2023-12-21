import Environments from '../utils/environments';

const getCities = async (country: string): Promise<string[] | undefined> => {
  try {
    const response = await fetch(Environments.api.userService.baseUrl + `/users/cities?country=${country}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const jsonResponse = await response.json();
    if (response?.status === 200 && jsonResponse) {
        return jsonResponse.cities;
    }
  } catch(error) {
    console.log('Get cities api error', error);
  }
  return;
}

export default getCities;