import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';

type VerifyOtpRes = {
  error?: string,
  errorCode?: string,
  userId?: number,
  access?: string,
  refresh?: string
}

const verifyOtp = async (email: string, code: number, token: string): Promise<VerifyOtpRes | undefined> => {
  try {
    const body = JSON.stringify({
      // extension,
      // number,
      email,
      code,
      token
    });
    const response = await fetch(Environments.api.userService.baseUrl + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });
    const jsonResponse = await response.json();
    if (response?.status === 403 || response?.status === 498) {
      return jsonResponse;
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse.data[0];
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Verify otp api error:', error);
    }
  }
}

export default verifyOtp;