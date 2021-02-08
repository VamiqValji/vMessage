import React, { useRef } from "react";
import "../App.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuccessPopUp from "../components/SuccessPopUp";
import e from "cors";

export default function Friends() {
  const isLogged = useSelector((state) => state.isLogged);

  const inputRef = useRef("")

  const searchFriends = (e) => {
    e.preventDefault();
    if (searchFriends.length < 1) return;
    console.log(inputRef.current.value);
    inputRef.current.value = "";
  }

  let render = (
    <div className="friendsContainer">
      <h2>Search Username</h2>
      <div className="messageBoxContainer">
          <form onSubmit={(e) => searchFriends(e)} className="messageBox">
            <span>
              <input
                ref={inputRef} 
                placeholder="Search Username"
                type="text"
                name="Message"
                id="msg"
              />
              <button>Search</button>
            </span>
          </form>
        </div>
        <div className="friendsListContainer">
          <h2>Friends List</h2>
            <div className="friendsList">
              <div className="chatBoxList">
                {[1,23,4].map((n) => {return (<span key={n}> Friend {n}</span>);
                  // return <span key={n} onClick={e => console.log(e.currentTarget.innerHTML)}>User {n}</span>
                })}
              </div>
            </div>
        </div>
    </div>
  )

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <h1>Friends</h1>
          <div>
            {isLogged ? (
              render
            ) : (
              <SuccessPopUp message={"Please go login first."} color={"red"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
