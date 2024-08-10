import Config from 'react-native-config'; 
import { addCountryToApi } from './user.country';

export default {
  api: {
    userService: {
      baseUrl: addCountryToApi(Config.API_BASE_URL_USER_SERVICE) || ''
    },
    matchService: {
      baseUrl: addCountryToApi(Config.API_BASE_URL_MATCH_SERVICE) || ''
    },
    profileService: {
      baseUrl: addCountryToApi(Config.API_BASE_URL_PROFILE_SERVICE) || ''
    }
  },
  socket: {
    matchService: {
      baseUrl: addCountryToApi(Config.API_BASE_URL_MATCH_SERVICE_CHAT_SOCKET) || ''
    }
  },
  appEnv: Config.APP_ENV || 'dev'
};