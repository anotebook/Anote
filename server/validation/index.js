export default email => {
  const regex = /^([a-zA-Z_0-9]){1,150}@([a-z]){1,50}\.[a-z]{2,10}$/;
  return regex.test(email);
};

export const name = userName => {
  const regex = /^([a-zA-Z])([a-zA-Z_0-9]){0,255}$/;
  return regex.test(userName);
};
