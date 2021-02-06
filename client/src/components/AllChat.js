import React, { useEffect, useState, useRef } from "react";
import "../App.css";

import io from "socket.io-client";
let socket;

export default function AllChat() {

    const [messages, setMessages] = useState([1,2,3,4,5,6])
    const [prevMsg, setPrevMsg] = useState("")
    const ENDPOINT = "http://localhost:3001";

    const inputRef = useRef("");
    const messageArea = useRef("")

    const addMsg = (msg, who="other") => {
      let span = document.createElement("div");
      span.innerHTML = (`<span key={${msg}} id=${who}><br/>${msg}</span>`);
      document.getElementsByClassName("messageArea")[0].appendChild(span);
      // after changes made to container
      let container = document.getElementsByClassName("messageArea")[0];
      console.log();
      container.scrollBy(0,container.scrollHeight);
    }
    
    const sendMessage = (e) => {
      e.preventDefault();
      let msg = inputRef.current.value;
      if ( msg < 1) return;
      console.log(msg);
      socket.emit("sendMessage", msg);
      addMsg(msg, "you");
      inputRef.current.value = "";
    }

    useEffect(() => {
      socket = io(ENDPOINT);

      socket.emit("test", "hi");
      socket.on("test", (test) => {
        console.log(test);
      });
      
      socket.on("receiveMessage", (msg) => {
        console.log(`Received: ${msg}`);
        addMsg(msg);
      })
    
      // CLEAN UP THE EFFECT => on leave, so socket doesnt unnecessarily stay open
      return () => {
        socket.emit("disconnected");
        socket.disconnect();
        socket.off();
      }

    }, [ENDPOINT]);

  return (
    <>
    <div className="flexCenter">
        <div className="loginContainer">
            <div className="messagingContainer">
                <h2 className="">Public Room</h2>
                <div ref={messageArea} className="messageArea">
                    <span id="you"><br/>messagemessagemessagemessagemessagemessagemessage</span>
                    {messages.map((n) => {
                        return <span key={n} id="other"><br/>{n}</span>
                    })}
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
