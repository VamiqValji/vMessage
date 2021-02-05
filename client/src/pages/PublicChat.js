import React from "react";
import "../App.css";
import { useSelector } from "react-redux";
import AllChat from "../components/AllChat";
import SuccessPopUp from "../components/SuccessPopUp";

export default function PublicChat() {
    const isLogged = useSelector((state) => state.isLogged);

  return (
    <>
        {isLogged ? <AllChat /> : <SuccessPopUp message={"Please go login first."} color={"red"} /*msgInfo={
            {
                message: "Please go login first.",
                color: "red",
            }
            }*//> }
    </>
  );
}
