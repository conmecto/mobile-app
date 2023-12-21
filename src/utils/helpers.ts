import * as Keychain from 'react-native-keychain';
import logout from '../api/logout';
import { COLOR_CODE } from './enums';
import authenticateRefreshToken from '../api/auth';
import { setAccessToken } from './token';

const formatPayloadDob = (dob: string): string => {
  const newDate = new Date(dob);
  const date = newDate.getDate();
  const dateString = date < 10 ? `0${date}` : `${date}`;
  const month = newDate.getMonth() + 1;
  const monthString = month < 10 ? `0${month}` : `${month}`;
  return `${dateString}/${monthString}/${newDate.getFullYear()}`;
}

const deleteToken = async (userId: number) => {
  let res = null;
  let apiRes = null; 
  try {
    const key = userId + ':auth:token';
    [res, apiRes] = await Promise.all([
      Keychain.resetGenericPassword({ service: key }),
      logout(userId)
    ]);
  } catch(error) {
    console.log('Delete token error: ', error);
  }
  return res;
}

const saveToken = async (key: string, value: string) => {
  let res = null;
  try {
    res = await Keychain.setGenericPassword(key, value, { service: key });
  } catch(error) {
    console.log('Token save error: ', error);
  }
  return res;
}

const getToken = async (key: string) => {
  let token = null;
  try {
    token = await Keychain.getGenericPassword({ service: key });
  } catch(error) {
    console.log('Retrieve token error: ', error);
  }
  return token;
}

const getAge = (date: string): number => {
  const dob = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const month = today.getMonth() - dob.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
      age--;
  }
  return age;
}

const formatText = (text: string | undefined) => {
  if (!text) {
    return '';
  }
  return text?.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  }).join(' ');
}

const fireColorScoreBased = (score: number) => {
  if (score >= 1 && score < 100) {
    return COLOR_CODE.BRIGHT_RED;
  } else if (score >= 100 && score < 500) {
    return COLOR_CODE.FIRE_YELLOW;
  } else if (score >= 500 && score < 1000) {
    return COLOR_CODE.FIRE_GREEN;
  } else if (score >= 1000 && score <= 2000) {
    return COLOR_CODE.FIRE_PURPLE;
  } else {
    return COLOR_CODE.FIRE_SILVER;
  }
}

const updateTokens = async (userId: number) => {
  if (!userId) {
    return false;
  }
  const authToken = await getToken(userId + ':auth:token');    
  if (!authToken) {
    return false;
  }
  let token: { refresh: string } | undefined = JSON.parse(authToken.password);
	if (!token) {
		return false;
	}
  const newToken = await authenticateRefreshToken(token.refresh);
  if (newToken) {
    setAccessToken(newToken.access);
    const key = userId + ':auth:token';
    await saveToken(key, JSON.stringify({ refresh: newToken.refresh })).then((response: any) => console.log('Save auth token response', response));
    return true;
  }
  return false;
}

export { formatPayloadDob, saveToken, getToken, getAge, deleteToken, formatText, fireColorScoreBased, updateTokens }