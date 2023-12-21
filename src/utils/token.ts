let accessToken = '';

const getAccessToken = () => {
  return accessToken;
}

const setAccessToken = (token: string) => {
  accessToken = token;
}

export { getAccessToken, setAccessToken }