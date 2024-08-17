import Environments from '../utils/environments';
import { getUserCountry } from '../utils/user.country';

type CreateUserRes = {
  data?: {
    userId: number,
    access: string,
    refresh: string,
  }[],
  error?: string,
  errorCode?: string
}

type CreateUserObj = {
  //number: string,
  email?: string,
  name?: string,
  appleAuthToken?: string,
  termsAccepted?: boolean,
  appleAuthUserId?: string,
  dob?: Date,
  city?: string,
  searchIn?: string,
  searchFor?: string,
  gender?: string
}

const createUser = async (createUserObj: CreateUserObj): Promise<CreateUserRes | undefined> => {
  try {
    const body = JSON.stringify(createUserObj);
    const response = await fetch(Environments.api.userService.baseUrl + `/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Country-Code': getUserCountry()
      },
      body
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Create user api error', error);
    }
  }
}

export default createUser;