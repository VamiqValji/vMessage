import React, { useEffect, useState } from "react";
import "../App.css";

import io from "socket.io-client";

export default function AllChat() {

  const socket = io.connect("http://localhost:3001");

    console.log(socket)

    const [messages, setMessages] = useState([1,2,3,4,5,6])

    useEffect(() => {
        // data FROM server
        socket.on("test", (test) => {
          console.log(test);
        });
    
        // CLEAN UP THE EFFECT => on leave, so socket doesnt unnecessarily stay open
        return () => socket.disconnect();
      }, []);
    

    const addMsg = (msg) => {
        let span = document.createElement("div");
        span.innerHTML = (`<span key={${msg}} id="other"><br/>${msg}</span>`);
        document.getElementsByClassName("messageArea")[0].appendChild(span);
        // after changes made to container
        let container = document.getElementsByClassName("messageArea")[0];
        console.log();
        container.scrollBy(0,container.scrollHeight);
    }


  const sendMessage = (e, msg) => {
    e.preventDefault();
    if (msg.length < 1) return;
    console.log(msg);
    // data TO server
    socket.emit("message", msg)
    // clear msg box
    document.getElementById("msg").innerHTML = "";
    // add chat msg to user's screen
    addMsg(msg);
  }

  socket.on("userConnected", (user) => {
    console.log(`${user} connected.`);
  });
  // receive messages from other clients
  socket.on("message", (data) => {
    console.log(data);
    // setMessages(msgs => msgs.push(data));
    addMsg(data);
  });
  socket.on("userDisconnected", (user) => {
    console.log(`${user} disconnected.`);
  });

  return (
    <>
    <div className="flexCenter">
        <div className="loginContainer">
            <div className="messagingContainer">
                <h2 className="">Public Room</h2>
                <div className="messageArea">
                    <span id="you"><br/>messagemessagemessagemessagemessagemessagemessage</span>
                    {messages.map((n) => {
                        return <span key={n} id="other"><br/>{n}</span>
                    })}
                </div>
                <div className="messageBoxContainer">
                <form onSubmit={(e) => sendMessage(e, document.getElementById("msg").value)} className="messageBox">
                    <span>
                        <input placeholder="Enter message here..." type="text" name="Message" id="msg" />
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
