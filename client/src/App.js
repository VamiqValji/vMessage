import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
// import logo from './logo.svg';
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { logOut, logIn } from "./actions/index";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import { render } from "react-dom";

export default function App() {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);

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
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } /*[]*/
  );

  if (isLogged) {
    renderLogOut = (
      <li className="logOut" onClick={logOutHandler}>
        Log Out
      </li>
    );
  } else {
    renderLogOut = (
      <li className="logOut">
        <Link to="/login" style={{ textDecoration: "none", color: "white" }}>
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
                    <Link
                      to="/"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      Home
                    </Link>
                  </li>
                  {/* <li>
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Login
                  </Link>
                </li> */}
                </span>
                <span className="rightNav">{renderLogOut}</span>
                {/* <li>
              <Link to="/users" style={{ textDecoration: 'none', color: "white" }}>Users</Link>
            </li> */}
              </ul>
            </nav>
          </div>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            {/* <Route path="/users">
            <Users />
          </Route> */}
            <Route path="/signup">
              <SignUp />
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

// function Home() {
//   return <h2>Home</h2>;
// }

// function About() {
//   return <h2>About</h2>;
// }

// function Users() {
//   return <h2>Users</h2>;
// }
