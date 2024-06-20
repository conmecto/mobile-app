import * as Keychain from 'react-native-keychain';
import { COLOR_CODE } from './enums';
import authenticateRefreshToken from '../api/auth';
import { setAccessToken } from './token';
import Environments from './environments'
import { allowedFileTypes } from './constants';

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
  try {
    const key = userId + ':auth:token';
    res = await Keychain.resetGenericPassword({ service: key });
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Delete token error: ', error);
    }
  }
  return res;
}

const saveToken = async (key: string, value: string) => {
  let res = null;
  try {
    res = await Keychain.setGenericPassword(key, value, { service: key });
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Token save error: ', error);
    }
  }
  return res;
}

const getToken = async (key: string) => {
  let token = null;
  try {
    token = await Keychain.getGenericPassword({ service: key });
  } catch(error) {
    if (Environments.appEnv !== 'prod') {
      console.log('Retrieve token error: ', error);
    }
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
  if (score >= 0 && score < 100) {
    return COLOR_CODE.BRIGHT_RED;
  } else if (score >= 100 && score < 500) {
    return COLOR_CODE.FIRE_YELLOW;
  } else if (score >= 500 && score < 1000) {
    return COLOR_CODE.FIRE_GREEN;
  } else if (score >= 1000 && score <= 5000) {
    return COLOR_CODE.FIRE_BLUE;
  } else {
    return COLOR_CODE.FIRE_PURPLE;
  }
}

const getNextMaxScore = (score: number) => {
  if (score >= 0 && score < 100) {
    return 100;
  } else if (score >= 100 && score < 500) {
    return 500;
  } else if (score >= 500 && score < 1000) {
    return 1000;
  } else if (score >= 1000 && score <= 5000) {
    return 5000;
  } else {
    return 10000;
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
    await saveToken(key, JSON.stringify({ refresh: newToken.refresh }))
    return true;
  }
  return false;
}

const getFileType = (key: string) => {
  return allowedFileTypes.find(type => type.split('/').pop() === key);
}

const getPolaroidDate = (date: string) => {
  try {
    const polaroidDate = date?.split('T')[0]?.replace(/\-/g, ' . ');
    return polaroidDate;
  } catch(error) {
  }
}

const getFormatedView = (views: number) => {
  if (views < 1000) {
    return [views, '']; 
  }  
  if (views < 1000000) {
    return [Math.floor(views / 1000), 'K'];
  }
  if (views < 1000000000) {
    return [Math.floor(views / 1000000), 'M'];
  }
  return [Math.floor(views / 1000000000), 'B'];
}

const getChatSocketKey = (matchId: number, userId: number) => {
  return `${matchId}:${userId}`;
}

export { 
  formatPayloadDob, saveToken, getToken, getAge, deleteToken, formatText, fireColorScoreBased, updateTokens, 
  getNextMaxScore, getFileType, getPolaroidDate, getFormatedView, getChatSocketKey
}