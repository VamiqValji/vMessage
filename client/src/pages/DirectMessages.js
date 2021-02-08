import { useState } from "react";
import "../App.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuccessPopUp from "../components/SuccessPopUp";
// import DirectChatMenu from "../components/DirectChatMenu";
import DirectChat from "../components/DirectChat";

export default function DirectMessages() {
  const isLogged = useSelector((state) => state.isLogged);

  const [currentUser, setCurrentUser] = useState("");
  let usersList = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  let render;
  if (isLogged) {
    render = (
      <div className="directMessagesContainer">
        {/* <div><DirectChatMenu /></div> */}
        <div className="chatContainer">
          <h2><div>Friends</div></h2>
          <div className="chatBoxList">
            {usersList.map((n) => {
              return (
                <span
                  key={n}
                  onClick={(e) => {
                    let clickedUser = e.currentTarget.innerHTML;
                    if (currentUser === clickedUser) return;
                    setCurrentUser(clickedUser);
                  }}
                >
                  Friend {n}
                </span>
              );
              // return <span key={n} onClick={e => console.log(e.currentTarget.innerHTML)}>User {n}</span>
            })}
          </div>
          <div className="addFriend">
            <Link to="/friends">
            <button>Manage Friends</button>
            </Link>
          </div>
        </div>

        <div>
          <DirectChat currentUser={currentUser} />
        </div>
        {/* going to pass down props from direct chat menu to direct chat (current room, contact, etc.) */}
      </div>
    );
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
