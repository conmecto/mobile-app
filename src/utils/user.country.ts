import { getCountry } from 'react-native-localize';

let userCountry: string = '';

const getUserCountry = () => {
  return userCountry;
}

const setUserCountry = () => {
  userCountry = getCountry()?.toLowerCase() || 'in';
}

const resetUserCountry = () => {
  userCountry = '';
}

export { getUserCountry, setUserCountry, resetUserCountry }