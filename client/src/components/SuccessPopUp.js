import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function SuccesPopUp({ message, color }) {
  return (
    <div className="App">
      <div className="popBG">
        <div className="popContainer">
          <div className="pop">
            {color !== "red" ? (
              <h1 className="lightSuccess">You are logged in!</h1>
            ) : (
              <h1 className="whiteSmoke">{message}</h1>
            )}
            <div className="flexCenter">
              {color !== "red" ? (
                <Link to="/">
                  <button>Back to Home</button>
                </Link>
              ) : (
                <Link to="/login">
                  <button>Login</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
