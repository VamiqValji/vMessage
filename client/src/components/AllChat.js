import React, { useEffect, useState } from "react";
import "../App.css";

import io from "socket.io-client";
// const socket = io.connect("http://localhost:3001");

export default function AllChat() {

    const [messages, setMessages] = useState([1,2,3,4,5,6])
    const [prevMsg, setPrevMsg] = useState("")

    useEffect(() => {
      const socket = io("http://localhost:3001");

        socket.emit("test", "hi");
        socket.on("test", (test) => {
          console.log(test);
        });
    
        // CLEAN UP THE EFFECT => on leave, so socket doesnt unnecessarily stay open
        return () => socket.disconnect();
      }, []);

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
                {/* <form onSubmit={(e) => sendMessage(e, document.getElementById("msg").value)} className="messageBox">
                    <span>
                        <input placeholder="Enter message here..." type="text" name="Message" id="msg" />
                        <button >Send</button>
                    </span>
                </form> */}
                </div>
            </div>
        </div>
    </div>
    </>
  );
}
