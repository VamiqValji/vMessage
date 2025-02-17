import { useState, useEffect } from "react";
import "../App.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuccessPopUp from "../components/SuccessPopUp";
// import DirectChatMenu from "../components/DirectChatMenu";
import DirectChat from "../components/DirectChat";
import axios from "axios";

export default function DirectMessages() {
  const isLogged = useSelector((state) => state.isLogged);

  const [currentUser, setCurrentUser] = useState("");
  const [friends, setFriends] = useState([]);
  const [data, setData] = useState([]);
  const [yourUsername, setYourUsername] = useState("");

  useEffect(() => {
    let tempFriendsList = [];
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .get("http://localhost:3001/friends/get")
      .then((res) => {
        setYourUsername(res.data.yourUsername);
        console.log("get friends", res.data);
        res.data.friends.forEach((friend) => {
          // console.log("friend", friend);
          tempFriendsList.push(friend);
        })
        setData(res.data);
        setFriends(tempFriendsList);
      })
  }, [])

  // let usersList = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  let render;
  if (isLogged) {
    render = (
      <div className="directMessagesContainer">
        {/* <div><DirectChatMenu /></div> */}
        <div className="chatContainer">
          <h2><div>Friends</div></h2>
          <div className="chatBoxList">
            {friends.length >= 1 ? friends.map((n) => {
              return (
                <span
                  key={n + Math.random().toString()}
                  onClick={(e) => {
                    let clickedUser = e.currentTarget.innerHTML;
                    if (currentUser === clickedUser) return;
                    setCurrentUser(clickedUser);
                  }}
                >
                  {/*Friend*/}{n}
                </span>
              );
              // return <span key={n + Math.random().toString()} onClick={e => console.log(e.currentTarget.innerHTML)}>User {n}</span>
            }) : <div className="center">No Friends Yet...</div> }
          </div>
          <div className="addFriend">
            <Link to="/friends">
            <button>Manage Friends</button>
            </Link>
          </div>
        </div>

        <div>
          <DirectChat currentUser={currentUser} data={data} yourUsername={yourUsername} />
        </div>
        {/* going to pass down props from direct chat menu to direct chat (current room, contact, etc.) */}
      </div>
    );
  } else {
    render = <SuccessPopUp message={"Please go login first."} color={"red"} />;
  }

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <h1>Direct Messages</h1>
          <div>{render}</div>
        </div>
      </div>
    </div>
  );
}
