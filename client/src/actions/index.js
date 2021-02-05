export const logIn = () => {
  return {
    type: "LOG_IN",
  };
};

export const logOut = () => {
  return {
    type: "LOG_OUT",
  };
};

export const actionSetUsername = (username) => {
  return {
    type: "SET_USERNAME",
    payload: username,
  };
};
