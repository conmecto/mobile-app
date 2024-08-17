import Config from 'react-native-config';
export default {
  api: {
    userService: {
      baseUrl: Config.API_BASE_URL_USER_SERVICE || ''
    },
    matchService: {
      baseUrl: Config.API_BASE_URL_MATCH_SERVICE || ''
    },
    profileService: {
      baseUrl: Config.API_BASE_URL_PROFILE_SERVICE || ''
    }
  },
  socket: {
    matchService: {
      baseUrl: Config.API_BASE_URL_MATCH_SERVICE_CHAT_SOCKET || ''
    }
  },
  appEnv: Config.APP_ENV || 'dev'
};