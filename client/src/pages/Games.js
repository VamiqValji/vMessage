import React, {useState, useEffect} from "react";
import "../App.css";
import { useSelector } from "react-redux";
import SuccessPopUp from "../components/SuccessPopUp";
import axios from "axios";

export default function Games() {
  const isLogged = useSelector((state) => state.isLogged);
  const [friends, setFriends] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .get("http://localhost:3001/friends/get")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setFriends(res.data.friends);
      })
  }, [])
  
  const FriendsList = () => {
    return (
    <div className="chatBoxList">
        <h2 style={{
            margin: "0 auto",
            marginBottom: 4,
        }}>Invite Friends</h2>
        {friends.length >= 1 ? friends.map((n) => {
        return (
            <span
            key={n + Math.random().toString()}
            onClick={(e) => {
                console.log(e.currentTarget.innerHTML);
            }}
            >
            {/*Friend*/}{n}
            </span>
        );
        // return <span key={n + Math.random().toString()} onClick={e => console.log(e.currentTarget.innerHTML)}>User {n}</span>
        }) : <div className="center">No Friends Yet...</div> }
    </div>
    );
  }

  const GamesDashboard = () => {
      return (
        <div className="gamesContainer">
            <h1 style={{ display: "flex", justifyContent: "center" }} >Games</h1>
            <div className="gamesAndFriendsListContainer">
                <div className="game">
                    {/* game in here */}
                </div>
                <FriendsList />
            </div>
        </div>
      )
  }

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <div>
            {isLogged ? (
              <GamesDashboard />
            ) : (
              <SuccessPopUp message={"Please go login first."} color={"red"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
