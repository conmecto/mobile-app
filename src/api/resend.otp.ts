import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';
import { getUserCountry } from '../utils/user.country';

type ResendOtpRes = {
  userId?: number,
  token?: string,
  error?: string,
  errorCode?: string
}

const resendOtp = async (email: string): Promise<ResendOtpRes | undefined> => {
  try {
    const body = JSON.stringify({
      email
    });
    const response = await fetch(Environments.api.userService.baseUrl + '/users/otp/resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Country-Code': getUserCountry()
      },
      body
    });
    const jsonResponse = await response.json();
    if (response?.status === 404 || response?.status === 403) {
      return jsonResponse;
    }
    if (response?.status === 200 && jsonResponse) {
      return jsonResponse.data[0];
    }
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Resend otp api error:', error);
    }
  }
}

export default resendOtp;