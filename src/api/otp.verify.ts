import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';

type LoginObj = {
  userId?: number,
  appleAuthToken?: string,
  deviceToken?: string
}

type VerifyOtpRes = {
  error?: string,
  errorCode?: string,
  data?: {
    userId: number,
    access: string,
    refresh: string
  }[]
}

const verifyOtp = async (loginObj: LoginObj): Promise<VerifyOtpRes | undefined> => {
  try {
    const body = JSON.stringify({
      // extension,
      // number,
      // email,
      // code,
      // token,
      ...loginObj
    });
    const response = await fetch(Environments.api.userService.baseUrl + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Verify otp api error:', error);
    }
  }
}

export default verifyOtp;