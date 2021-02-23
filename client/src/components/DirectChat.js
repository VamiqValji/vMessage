import { useRef, useState, useEffect } from "react";
import "../App.css";

import io from "socket.io-client";
let socket;

export default function DirectChatMenu({ currentUser, data, yourUsername }) {
  const inputRef = useRef("");
  const [messages, setMessages] = useState([]);
  const [renderMessages, setRenderMessages] = useState();

  const ENDPOINT = "http://localhost:3001";

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
        currentUserMessages.map(message => {
          return (<span key={message[0][0] + (Math.random()).toString()} id={message[0][0] === yourUsername ? "you" : "other"}>
          <div>
            <li>{message[0][0] === yourUsername ? `${message[0][0]} (You)` : message[0][0]}</li>
            <li>{new Date().toLocaleTimeString()}</li>
          </div>
          {message[0][1]}
        </span>)
        })
      )
    }
  }, [data, currentUser])

  //

  // const userEvent = (user=String, EVENT="joined") => {
  //   let currentTime = new Date().toLocaleTimeString();
  //   let span = document.createElement("div");
  //   span.innerHTML = `<span style={{fontSize:25}}><b>${user}</b> ${EVENT}.<li class="currentTime">${currentTime}</li></span>`;
  //   document.getElementsByClassName("messageArea")[0].appendChild(span);
  // }

  const addMsg = (msg, who="other", username="you") => {
    let currentTime = new Date().toLocaleTimeString();
    let span = document.createElement("div");
    let key = `${msg}${(Math.random()).toString()}`;
    if (who === "other") {
      span.innerHTML = (`<span key={${key}} id=${who}><div><li>${username}</li><li>${currentTime}</li></div>${msg}</span>`);
    } else { // you
      span.innerHTML = (`<span key={${key}} id=${who}><div><li>${yourUsername} (You)</li><li>${currentTime}</li></div>${msg}</span>`);
    }
    document.getElementsByClassName("messageArea")[0].appendChild(span);
    // after changes made to container
    let container = document.getElementsByClassName("messageArea")[0];
    container.scrollBy(0,container.scrollHeight);
  }
  
  const sendMessage = (e) => {
    e.preventDefault();
    let msg = inputRef.current.value;
    if (msg < 1 || currentUser === "") return;
    console.log(msg);
    socket.emit("sendMessage", {msg, username: yourUsername});
    addMsg(msg, "you");
    inputRef.current.value = "";
  }
  //

  console.log("msgs", messages);
  messages.map(message => console.log("adawdawd",message[0]));

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("connected", {username: yourUsername, currentUser: currentUser, room: `${yourUsername}to${currentUser}`});
    console.log(`currentUser(${currentUser})`)
    if (currentUser !== "") { // have selected user
      socket.on("receiveMessage", (msgInfo) => {
        console.log(msgInfo);
        addMsg(msgInfo.msg, "other", msgInfo.username);
      });

    }
    // userEvent("You", "joined");

    // socket.on("updatePlayersOnline", (count) => {
    //   console.log(count);
    //   setPlayersOnline(count);
    // });

    // CLEAN UP THE EFFECT => on leave, so socket doesnt unnecessarily stay open
    return () => {
      // socket.emit("disconnect", tempUsername);
      socket.disconnect();
      socket.off();
    };
  }, [ENDPOINT, currentUser]);

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
