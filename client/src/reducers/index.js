import loggedReducer from "./isLogged";
import setUsernameReducer from "./setUsername";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  isLogged: loggedReducer,
  setUsernameReducer, // same as above, just not renaming it
});

export default allReducers;
