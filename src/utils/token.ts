let accessToken = '';

const getAccessToken = () => {
  return accessToken;
}

const setAccessToken = (token: string) => {
  accessToken = token;
}

const resetToken = () => {
  accessToken = '';
}

export { getAccessToken, setAccessToken, resetToken }