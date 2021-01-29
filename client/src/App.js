import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// import logo from './logo.svg';
import './App.css';

import Home from "./pages/Home";
import Login from "./pages/Login";

export default function App() {
  return (
    <div className="appContainer">
    <Router>
      <div>
        <div className="nav">
        <nav>
          <ul>
            <li>
              <Link to="/" style={{ textDecoration: 'none', color: "white" }}>Home</Link>
            </li>
            <li>
              <Link to="/Login" style={{ textDecoration: 'none', color: "white" }}>Login</Link>
            </li>
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
