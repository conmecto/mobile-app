import { getCountry } from 'react-native-localize';

let userCountry: string = '';

const getUserCountry = () => {
  return userCountry;
}

const setUserCountry = () => {
  try {
    userCountry = getCountry()?.toLowerCase() || 'in';
  } catch (error) {
    userCountry = 'in';
  }
}

const resetUserCountry = () => {
  userCountry = '';
}

export { getUserCountry, setUserCountry, resetUserCountry }