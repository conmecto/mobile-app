import { getCountry } from 'react-native-localize';

let userCountry: string = '';

const getUserCountry = () => {
  return userCountry;
}

const setUserCountry = () => {
  userCountry = getCountry()?.toLowerCase();
}

const resetUserCountry = () => {
  userCountry = '';
}

const addCountryToApi = (api?: string) => {
  const components = api?.split('//');
  if (components?.length === 2) {
    return components[0] + `//${getUserCountry()}.` + components[1];
  }
  return api;
}

export { getUserCountry, setUserCountry, resetUserCountry, addCountryToApi }