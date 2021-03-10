import React, { useEffect, useState, useRef } from "react";
import "../App.css";

import io from "socket.io-client";
let socket;

export default function AllChat() {
  let happyEmotesList = [""];
  let sadEmotesList = [""];
  try {
    happyEmotesList = ["😂", "😴", "😁", "😎", "😉", "😜", "😊", "🤣", "😍"];
    sadEmotesList = ["😒", "😢", "😪", "😨", "😓", "😭", "😰"];
  } catch (err) {
    console.log("Emotes didn't register.");
  }

  // const [messages, setMessages] = useState([1,2,3,4,5,6])
  const ENDPOINT = "http://localhost:3001";

  // const usernameRef = useRef("");
  const [username, setUsername] = useState("");
  const [playersOnline, setPlayersOnline] = useState(0);
  const inputRef = useRef("");
  const messageArea = useRef("");

  const [modalData, setModalData] = useState({
    active: false,
    url: ""
  });

  const userEvent = (user = String, EVENT = "joined") => {
    let currentTime = new Date().toLocaleTimeString();
    let span = document.createElement("div");
    try {
      if (EVENT === "joined") {
        span.innerHTML = `<span style={{fontSize:25}}><b>${user}</b> ${EVENT}. ${
          happyEmotesList[Math.floor(Math.random() * happyEmotesList.length)]
        }<li class="currentTime">${currentTime}</li></span>`;
      } else if (EVENT === "left") {
        span.innerHTML = `<span style={{fontSize:25}}><b>${user}</b> ${EVENT}. ${
          sadEmotesList[Math.floor(Math.random() * sadEmotesList.length)]
        }</span>`;
      }
    } catch {
      span.innerHTML = `<span style={{fontSize:25}}><b>${user}</b> ${EVENT}.</span>`;
    }
    document.getElementsByClassName("messageArea")[0].appendChild(span);
  };

  const addMsg = (msg, who = "other", username = "you") => {
    let currentTime = new Date().toLocaleTimeString();
    let span = document.createElement("div");
    console.log();
    const regexRes = msg.match(/!\[(.*?)\]/);
    if (regexRes === null) {
      if (who === "other") {
        span.innerHTML = `<span key={${
          msg + Math.random().toString()
        }} id=${who}><div><li>${username}</li><li>${currentTime}</li></div>${msg}</span>`;
      } else {
        // you
        span.innerHTML = `<span key={${
          msg + Math.random().toString()
        }} id=${who}><div><li>You</li><li>${currentTime}</li></div>${msg}</span>`;
      }
    } else {
      const returnMsg = () => {
        if (msg.length > 0) return `${msg.replace(regexRes[0], "")}<br />`;
        // return "";
        // return msg.replace(" ", "");
      };

      /* 
      <a href="${
        regexRes[1]
      }">
      */

      span.innerHTML = `<span key={${
        msg + Math.random().toString()
      }} id=${who}><div><li>You</li><li>${currentTime}</li></div>${returnMsg()}<img src="${
        regexRes[1]
      }" alt="User Image" class="chatImg"></span>`;/*</a>*/
      let imgOfSpan = span.getElementsByTagName("img")[0];
      imgOfSpan.addEventListener("click", () => {
        setModalData({
          active: true,
          url: regexRes[1]
        });
        console.log("clicked img" + regexRes[1]);
      })
      // style="width:42px;height:42px;"
    }

    document.getElementsByClassName("messageArea")[0].appendChild(span);
    // after changes made to container
    let container = document.getElementsByClassName("messageArea")[0];
    container.scrollBy(0, container.scrollHeight);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    let msg = inputRef.current.value;
    if (msg < 1) return;
    console.log(msg);
    socket.emit("sendMessage", { msg, username: username });
    addMsg(msg, "you");
    inputRef.current.value = "";
  };

  useEffect(() => {
    let tempUsername;
    while (true) {
      tempUsername = window.prompt(
        "Public Rooms use different usernames than your regular account. Messages will disappear after you leave; they are session based. Enter in a username you would like to use for this session."
      );
      if (
        tempUsername.length > 0 &&
        tempUsername.length <= 10 &&
        tempUsername !== "You"
      ) {
        setUsername(tempUsername);
        break;
      } else {
        window.alert("Please enter a valid username.");
      }
    }

    socket = io(ENDPOINT);
    socket.emit("connected", tempUsername);
    userEvent("You", "joined");

    socket.on("userJoined", (user) => {
      console.log(`${user} joined.`);
      userEvent(user, "joined");
      setPlayersOnline((prev) => prev + 1);
    });

    socket.on("userLeft", (user) => {
      console.log(`${user} left.`);
      userEvent(user, "left");
      setPlayersOnline((prev) => prev - 1);
    });

    socket.on("receiveMessage", (msgInfo) => {
      console.log(msgInfo);
      addMsg(msgInfo.msg, "other", msgInfo.username);
    });

    socket.on("updatePlayersOnline", (count) => {
      console.log(count);
      setPlayersOnline(count);
    });

    // CLEAN UP THE EFFECT => on leave, so socket doesnt unnecessarily stay open
    return () => {
      // socket.emit("disconnect", tempUsername);
      socket.disconnect();
      socket.off();
    };
  }, [ENDPOINT]);

  const Modal = () => {
    return (
      <>
        <div className={`imgModalContainer ${modalData.active ? "popIn" : ""}`} onClick={() => {
          setModalData({
            active: false,
            url: modalData.url
          });
        }}>
          <div className="imgModal">
            <img src={modalData.url} alt="User Image"/>
            <a href={modalData.url}><h6>Click here for the image address</h6></a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flexCenter">
        <div className="loginContainer">
          {modalData.active && <Modal />}
          <div className="messagingContainer">
            <h2>
              Public Room
              <div>
                <span>{playersOnline}</span> User(s) Online
              </div>
            </h2>
            <div ref={messageArea} className="messageArea">
              {/* <span id="you"><br/>messagemessagemessagemessagemessagemessagemessage</span>
                    {messages.map((n) => {
                        return <span key={n + Math.random().toString()} id="other"><br/>{n}</span>
                    })} */}
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
      </div>
    </>
  );
}
