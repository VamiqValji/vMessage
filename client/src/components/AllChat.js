import React, { useEffect } from "react";
import "../App.css";

import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

export default function AllChat() {
    useEffect(() => {
        // data FROM server
        socket.on("test", (test) => {
          console.log(test);
        });
    
        // CLEAN UP THE EFFECT => on leave, so socket doesnt unnecessarily stay open
        return () => socket.disconnect();
      }, []);

  const sendMessage = (e, msg) => {
    e.preventDefault();
    console.log(msg);
    // data TO server
    socket.emit("message", msg)
    // clear msg box
    document.getElementById("msg").innerHTML = "";
  }

  // receive messages from other clients
  socket.on("message", (data) => {
    console.log(data);
  });

  return (
    <>
    <div className="flexCenter">
        <div className="loginContainer">
            <div className="messagingContainer">
                <h2 className="">Public Room</h2>
                <div className="messageArea">
                    <span id="you"><br/>messagemessagemessagemessagemessagemessagemessage</span>
                    {[1,2,3,4,5,6].map((n) => {
                        return <span key={n} id="other"><br/>message</span>
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
