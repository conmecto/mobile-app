let userId: null | number = null;

const getUserId = () => {
  return userId;
}

const setUserId = (id: number) => {
  userId = id;
}

const resetUserId = () => {
  userId = null;
}

export { getUserId, setUserId, resetUserId }