import React, { useEffect /*, useState*/ } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
// import logo from './logo.svg';
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { logOut, logIn /*, actionSetUsername*/ } from "./actions/index";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PublicChat from "./pages/PublicChat";
import DirectMessages from "./pages/DirectMessages";
import Friends from "./pages/Friends";

export default function App() {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);

  // const [username, setUsername] = useState("");

  let renderLogOut;
  const logOutHandler = () => {
    dispatch(logOut());
    localStorage.removeItem("token");
  };

  useEffect(
    () => {
      console.log("Refresh.");
      // check if logged in based on token
      const TOKEN = localStorage.getItem("token");
      if (!TOKEN) return logOutHandler();
      // login user if valid token exists
      axios.defaults.headers.common["auth-token"] = TOKEN;
      axios
        .post("http://localhost:3001/login/token/", {
          token: TOKEN,
        })
        .then((res) => {
          if (res.data.includes("Logged in")) dispatch(logIn());
          // useSelector((state) => state.setUsernameReducer);
          // localStorage.setItem("username", res.data.split(",")[1]);
          // dispatch(actionSetUsername(res.data.split(",")[1]));
        })
        .catch((err) => {
          try {
            console.log(err.response.data.message);
          } catch {
            console.warn(err);
          }
        });
    } /*[]*/
  );

  const linkStyle = { textDecoration: "none", color: "white" };

  if (isLogged) {
    renderLogOut = (
      <li className="logOut" onClick={logOutHandler}>
        Log Out
      </li>
    );
  } else {
    renderLogOut = (
      <li className="logOut">
        <Link to="/login" style={linkStyle}>
          Login
        </Link>
      </li>
    );
  }

  return (
    <div className="appContainer">
      <Router>
        <div>
          <div className="nav">
            <nav>
              <ul>
                <span className="leftNav">
                  <li>
                    <Link to="/" style={linkStyle}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/public" style={linkStyle}>
                      Public Chat
                    </Link>
                  </li>
                  <li>
                    <Link to="/dms" style={linkStyle}>
                      Direct Messages
                    </Link>
                  </li>
                </span>
                <span className="rightNav">{renderLogOut}</span>
              </ul>
            </nav>
          </div>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/public">
              <PublicChat />
            </Route>
            <Route path="/dms">
              <DirectMessages />
            </Route>
            <Route path="/friends">
              <Friends />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}
