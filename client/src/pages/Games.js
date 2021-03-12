import React from "react";
import "../App.css";
import { useSelector } from "react-redux";
import SuccessPopUp from "../components/SuccessPopUp";

export default function Games() {
  const isLogged = useSelector((state) => state.isLogged);

  const GamesDashboard = () => {
      return (
          <>
            <h1>Games</h1>
          </>
      )
  }

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          
          <div>
            {isLogged ? (
              <GamesDashboard />
            ) : (
              <SuccessPopUp message={"Please go login first."} color={"red"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
