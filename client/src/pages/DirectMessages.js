import React from "react";
import "../App.css";
import { useSelector } from "react-redux";
import SuccessPopUp from "../components/SuccessPopUp";
import { Link } from "react-router-dom";

export default function Home() {
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
          <h1>Direct Messages</h1>
          <div>
            {isLogged ? (
              publicChat()
            ) : (
              <SuccessPopUp message={"Please go login first."} color={"red"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
