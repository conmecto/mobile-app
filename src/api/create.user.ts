import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';

type CreateUserRes = {
  userId?: number,
  token?: string,
  error?: string,
  errorCode?: string
}

type CreateUserObj = {
  number: string,
  name: string,
  dob: string,
  city: string,
  country: string, 
  searchFor: string,
  searchIn: string,
  gender: string,
}

const createUser = async (createUserObj: CreateUserObj): Promise<CreateUserRes | undefined> => {
  try {
    const body = JSON.stringify(createUserObj);
    const response = await fetch(Environments.api.userService.baseUrl + `/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });
    const jsonResponse = await response.json();
    if (response?.status === 201 && jsonResponse) {
      return jsonResponse.data[0];
    }
  } catch(error) {
    console.log('Create user api error', error);
  }
}

export default createUser;