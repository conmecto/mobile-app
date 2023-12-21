import Environments from '../utils/environments';
import { ERROR_CODES } from '../utils/enums';

type ResendOtpRes = {
  userId?: number,
  token?: string,
  error?: string,
  errorCode?: string
}

const resendOtp = async (extension: string, number: string): Promise<ResendOtpRes | undefined> => {
  try {
    const body = JSON.stringify({
      extension,
      number
    });
    const response = await fetch(Environments.api.userService.baseUrl + '/users/otp/resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    console.log('Resend otp api error:', error);
  }
}

export default resendOtp;