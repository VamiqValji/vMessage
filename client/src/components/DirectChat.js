import { useRef } from "react";
import "../App.css";

export default function DirectChatMenu({ currentUser }) {
  const inputRef = useRef("");

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
    inputRef.current.value = "";
  };

  console.log(currentUser);
  return (
    <>
      <div className="messagingContainer">
        <div className="messagingContainerDM">
        <h2>
          {currentUser.length > 0 ? currentUser : "Select A Friend to Chat With"}
          {/* <div>
            <span></span> User(s) Online
          </div> */}
        </h2>
        <div className="messageArea">
        <span id="you"><div><li>You</li><li>time</li></div>msg</span>
        </div>
        <div className="messageBoxContainer">
          <form onSubmit={(e) => sendMessage(e)} className="messageBox">
            <span>
              <input
                ref={inputRef}
                placeholder="Enter message here..."
                type="text"
                name="Message"
                id="msg"
              />
              <button>Send</button>
            </span>
          </form>
        </div>
        </div>
      </div>
    </>
  );
}
