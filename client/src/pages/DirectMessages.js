import React from "react";
import "../App.css";
import { useSelector } from "react-redux";
import SuccessPopUp from "../components/SuccessPopUp";
// import DirectChatMenu from "../components/DirectChatMenu";
import DirectChat from "../components/DirectChat";

export default function DirectMessages() {
  const isLogged = useSelector((state) => state.isLogged);

  let render;
  if (isLogged) {
    render = (
    <div>
        {/* <div><DirectChatMenu /></div> */}
        <div>Direct Chat Menu</div>
        <div><DirectChat /></div>
        {/* going to pass down props from direct chat menu to direct chat (current room, contact, etc.) */}
    </div>)
  } else {
    render = <SuccessPopUp message={"Please go login first."} color={"red"} />;
  }

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <h1>Direct Messages</h1>
          <div>{render}</div>
        </div>
      </div>
    </div>
  );
}
