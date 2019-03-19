export default email => {
  const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
  return regex.test(email);
};

export const name = userName => {
  const regex = /^([a-zA-Z])([a-zA-Z_0-9]){0,255}$/;
  return regex.test(userName);
};
