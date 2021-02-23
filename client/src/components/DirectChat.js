import { useRef, useState, useEffect } from "react";
import "../App.css";

export default function DirectChatMenu({ currentUser, data }) {
  const inputRef = useRef("");
  const [messages, setMessages] = useState([]);
  const [renderMessages, setRenderMessages] = useState();

  useEffect(() => {
    let currentUserMessages = [];
    if (data.friends !== undefined) {
      console.log("data", data.friends);
      data.friends.map(info => {
        console.log(info.name + currentUser)
        if (info.name === currentUser) {
          console.log("info.name === currentUser")
          currentUserMessages.push(info.messages);
        }
      });
      setMessages(currentUserMessages);
      setRenderMessages(
        messages.map(message => {
          return (<span id="you">
          <div>
            <li>{message[0][0]}</li>
            <li>{new Date().toLocaleTimeString()}</li>
          </div>
          {message[0][1]}
        </span>)
        })
      )
    }
  }, [data, currentUser])

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
    inputRef.current.value = "";
  };

  console.log("msgs", messages);
  messages.map(message => console.log("adawdawd",message[0]));
  // console.log(currentUser);

  return (
    <>
      <div className="messagingContainer">
        <div className="messagingContainerDM">
          <h2>
            {currentUser.length > 0
              ? currentUser
              : "Select A Friend to Chat With"}
          </h2>
          <div className="messageArea">
            {messages.length > 0 ? (
              renderMessages
            ) : (
              "No messages here!"
            ) }
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
