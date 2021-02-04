import React from "react";
import "../App.css";

export default function AllChat() {

    const sendMessage = (msg) => {
        console.log(msg);
    }

  return (
    <>
    <div className="messagingContainer">
      <h2 className="">Public Room</h2>
      <div className="messageArea">
        <span id="you"><br/>messagemessagemessagemessagemessagemessagemessage</span>
        {[1,2,3,4,5,6].map((msg) => {
            return <span id="other"><br/>message</span>
        })}
      </div>
      <div className="messageBoxContainer">
      <div className="messageBox">
        <span>
            <input type="text" name="Message" id="msg" />
            <button onClick={() => sendMessage(document.getElementById("msg").value)}>Send</button>
        </span>
      </div>
      </div>
    </div>
    </>
  );
}
