import React from "react";
import "../App.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Friends() {
  const isLogged = useSelector((state) => state.isLogged);

  const linkStyle = { textDecoration: "none", color: "white" };

  const publicChat = () => {
    return (
      <li className="logOut">
        <Link to="/public" style={linkStyle}>
          Public Room
        </Link>
      </li>
    );
  };

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <h1>Friends</h1>
          <div>
            {isLogged ? (
              publicChat()
            ) : (
              <Link to="/public" style={linkStyle}>
                go login!
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
