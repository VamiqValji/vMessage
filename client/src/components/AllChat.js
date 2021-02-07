import React, { useEffect, useState, useRef } from "react";
import "../App.css";

import io from "socket.io-client";
let socket;

export default function AllChat() {

  let happyEmotesList;
  let sadEmotesList;
  try {
    happyEmotesList = ["😂","😴","😁","😎","😉","😜","😊","🤣","😍"];
    sadEmotesList = ["😒","😢","😪","😨","😓","😭","😰"];
  } catch (err) {
    console.log("Emotes didn't register.")
  }

    // const [messages, setMessages] = useState([1,2,3,4,5,6])
    const ENDPOINT = "http://localhost:3001";

    // const usernameRef = useRef("");
    const [username, setUsername] = useState("");
    const inputRef = useRef("");
    const messageArea = useRef("")

    const userEvent = (user=String, EVENT="joined") => {
      let span = document.createElement("div");
      try {
        if (EVENT === "joined") {
          span.innerHTML = (`<span style={{fontSize:25}}>${user} ${EVENT}. ${happyEmotesList[Math.floor(Math.random() * happyEmotesList.length)]}</span>`);
        } else if (EVENT === "left") {
          span.innerHTML = (`<span style={{fontSize:25}}>${user} ${EVENT}. ${sadEmotesList[Math.floor(Math.random() * sadEmotesList.length)]}</span>`);
        }
      } catch {
        span.innerHTML = (`<span style={{fontSize:25}}>${user} ${EVENT}.</span>`);
      }
      document.getElementsByClassName("messageArea")[0].appendChild(span);
    }

    const addMsg = (msg, who="other", username="you") => {
      let span = document.createElement("div");
      if (who === "other") {
        span.innerHTML = (`<span key={${msg}} id=${who}><div>${username}</div>${msg}</span>`);
      } else { // you
        span.innerHTML = (`<span key={${msg}} id=${who}><br/>${msg}</span>`);
      }
      document.getElementsByClassName("messageArea")[0].appendChild(span);
      // after changes made to container
      let container = document.getElementsByClassName("messageArea")[0];
      container.scrollBy(0,container.scrollHeight);
    }
    
    const sendMessage = (e) => {
      e.preventDefault();
      let msg = inputRef.current.value;
      if (msg < 1) return;
      console.log(msg);
      socket.emit("sendMessage", {msg, username: username});
      addMsg(msg, "you");
      inputRef.current.value = "";
    }

    useEffect(() => {

      let tempUsername;
      while(true) {
        tempUsername = window.prompt("Public Rooms use different usernames than your regular account. Messages will disappear after you leave; they are session based. Enter in a username you would like to use for this session.");
        if (tempUsername.length > 0 && tempUsername.length <= 10 && tempUsername !== "You") {
          setUsername(tempUsername);
          break;
        } else {
          window.alert("Please enter a valid username.");
        }
      }

      socket = io(ENDPOINT);
      socket.emit("connected", tempUsername);
      userEvent("You", "joined");
      
      // socket.on("changeUsername", (userN) => {
      //   console.log(userN);
      //   tempUsername = userN;
      //   setUsername(tempUsername);
      // })

      socket.on("userJoined", user => {
        console.log(`${user} joined.`);
        userEvent(user, "joined");
      })

      socket.on("userLeft", user => {
        console.log(`${user} left.`);
        userEvent(user, "left");
      })
      
      socket.on("receiveMessage", (msgInfo) => {
        console.log(msgInfo);
        addMsg(msgInfo.msg, "other", msgInfo.username);
      })
    
      // CLEAN UP THE EFFECT => on leave, so socket doesnt unnecessarily stay open
      return () => {
        // socket.emit("disconnect", tempUsername);
        socket.disconnect();
        socket.off();
      }

    }, [ENDPOINT]);

  return (
    <>
    <div className="flexCenter">
        <div className="loginContainer">
            <div className="messagingContainer">
                <h2>Public Room</h2>
                <div ref={messageArea} className="messageArea">
                    {/* <span id="you"><br/>messagemessagemessagemessagemessagemessagemessage</span>
                    {messages.map((n) => {
                        return <span key={n} id="other"><br/>{n}</span>
                    })} */}
                </div>
                <div className="messageBoxContainer">
                <form onSubmit={(e) => sendMessage(e)} className="messageBox">
                    <span>
                        <input ref={inputRef} placeholder="Enter message here..." type="text" name="Message" id="msg" />
                        <button >Send</button>
                    </span>
                </form>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}
