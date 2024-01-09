let userId: null | number = null;

const getUserId = () => {
  return userId;
}

const setUserId = (id: number) => {
  userId = id;
}

export { getUserId, setUserId }