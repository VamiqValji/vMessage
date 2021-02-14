// import axios from "axios";

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
  // const res = await axios.get('http://locahost:5000/route-here')
  // may fetch user data here on page load and then set state in action instead
  // of through a component.
  return {
    type: "SET_USERNAME",
    payload: username,
  };
};
