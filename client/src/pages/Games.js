import React, {useState, useEffect} from "react";
import "../App.css";
import { useSelector } from "react-redux";
import SuccessPopUp from "../components/SuccessPopUp";
import axios from "axios";

export default function Games() {
  const isLogged = useSelector((state) => state.isLogged);
  const [friends, setFriends] = useState([]);
  const [data, setData] = useState([]);
  const [currentGame, setCurrentGame] = useState("");

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
            // onClick={(e) => {
            //     console.log(e.currentTarget.innerHTML);
            // }}
            >
            {/*Friend*/}{n} <div onClick={() => {
                console.log(`Invite ${n}.`);
            }}>Invite <i class="fas fa-plus-circle"></i></div>
            </span>
        );
        // return <span key={n + Math.random().toString()} onClick={e => console.log(e.currentTarget.innerHTML)}>User {n}</span>
        }) : <div className="center">No Friends Yet...</div> }
    </div>
    );
  }

  const GamesDashboard = () => {
    
    const gamesList = [
        {
            name: "Game 1",
            icon: "fas fa-square"
        },
        {
            name: "Game 2",
            icon: "fas fa-futbol"
        },
        {
            name: "Game 3",
            icon: "fas fa-basketball-ball"
        }
    ]

      return (
        <div className="gamesContainer">
            <div className="gamesHeader">
                <h1>Games</h1>
                <span className="seperator"></span>
                {gamesList.map((game) => {
                    return <span key={game.name} onClick={() => {
                        console.log(`${game.name} clicked.`);
                        setCurrentGame(game.name);
                    }}>{game.name}<i class={game.icon}></i></span>
                })}
            </div>
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
