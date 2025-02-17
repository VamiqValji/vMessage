import { useRef, useState, useEffect } from "react";
import "../App.css";
import axios from "axios";

import io from "socket.io-client";
let socket;

export default function DirectChatMenu({ currentUser, data, yourUsername }) {
  const inputRef = useRef("");
  const [messages, setMessages] = useState([]);
  const [renderMessages, setRenderMessages] = useState();

  const ENDPOINT = "http://localhost:3001";

  useEffect(() => {
    let currentUserMessages = [];

    // room name
    let consistent = [yourUsername, currentUser].sort();
    let roomName = `${consistent[0]},${consistent[1]}`;
    // request - returns GC / DM info
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .post("http://localhost:3001/friends/get/messages", {
        roomName: roomName,
      })
      .then((res) => {
        try {
          console.log("get friends", res.data);
          res.data.messages.forEach((message) => {
            if (message !== undefined) {
              currentUserMessages.push(message);
            }
          });

          setMessages(currentUserMessages);
          setRenderMessages(
            currentUserMessages.map((message) => {
              return (
                <span
                  key={message.message + Math.random().toString()}
                  id={message.author === yourUsername ? "you" : "other"}
                >
                  <div>
                    <li>
                      {message.author === yourUsername
                        ? `${message.author} (You)`
                        : message.author}
                    </li>
                    <li>{new Date(message.timeSent).toLocaleTimeString()}</li>
                  </div>
                  {message.message}
                </span>
              );
            })
          );
          let container = document.getElementsByClassName("messageArea")[0];
          container.scrollBy(0, container.scrollHeight);
        } catch (err) {
          console.warn("ERROR", err);
        }
      });
  }, [data, currentUser, yourUsername]);

  // const userEvent = (user=String, EVENT="joined") => {
  //   let currentTime = new Date().toLocaleTimeString();
  //   let span = document.createElement("div");
  //   span.innerHTML = `<span style={{fontSize:25}}><b>${user}</b> ${EVENT}.<li class="currentTime">${currentTime}</li></span>`;
  //   document.getElementsByClassName("messageArea")[0].appendChild(span);
  // }

  const addMsgToDB = (author = String, message = String, timeSent = String) => {
    // room name
    let consistent = [yourUsername, currentUser].sort();
    let roomName = `${consistent[0]},${consistent[1]}`;
    // post
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .post("http://localhost:3001/friends/add/messages", {
        roomName: roomName,
        author: author,
        message: message,
        timeSent: timeSent,
      })
      .then((res) => {
        console.log("res data: ", res.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const addMsg = (
    msg = String,
    who = "other",
    username = "you",
    saveToDB = false
  ) => {
    let currentTime = new Date().toLocaleTimeString();
    let span = document.createElement("div");
    let key = `${msg}${Math.random().toString()}`;
    if (who === "other") {
      span.innerHTML = `<span key={${key}} id=${who}><div><li>${username}</li><li>${currentTime}</li></div>${msg}</span>`;
    } else {
      // you
      span.innerHTML = `<span key={${key}} id=${who}><div><li>${yourUsername} (You)</li><li>${currentTime}</li></div>${msg}</span>`;
    }
    document.getElementsByClassName("messageArea")[0].appendChild(span);
    // after changes made to container
    let container = document.getElementsByClassName("messageArea")[0];
    container.scrollBy(0, container.scrollHeight);
    if (saveToDB) addMsgToDB(currentUser, msg, new Date().toUTCString());
  };

  const sendMessage = (e) => {
    e.preventDefault();
    let msg = inputRef.current.value;
    if (msg < 1 || currentUser === "") return;
    console.log(msg);
    socket.emit("sendMessage", { msg, username: yourUsername });
    addMsg(msg, "you", "you", true);
    inputRef.current.value = "";
  };

  console.log("msgs", messages);
  messages.map((message) => console.log("adawdawd", message[0]));

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("connected", {
      username: yourUsername,
      currentUser: currentUser /*, room: `${yourUsername}to${currentUser}`*/,
    });
    console.log(`currentUser(${currentUser})`);
    if (currentUser !== "") {
      // have selected user
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
              <div className="center">No messages here!</div>
            )}
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
