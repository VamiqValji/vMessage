import React, { useState, useEffect } from "react";
import "../App.css";
import { useSelector } from "react-redux";
import SuccessPopUp from "../components/SuccessPopUp";
import axios from "axios";

import io from "socket.io-client";
let socket;

export default function Games() {
  const isLogged = useSelector((state) => state.isLogged);
  const [friends, setFriends] = useState([]);
  const [data, setData] = useState([]);
  const [currentGame, setCurrentGame] = useState("");
  const [yourUsername, setYourUsername] = useState("");

  const ENDPOINT = "http://localhost:3001";

  useEffect(() => {
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios.get("http://localhost:3001/friends/get").then((res) => {
      console.log(res.data);
      setData(res.data);
      setFriends(res.data.friends);
      setYourUsername(res.data.yourUsername);
    });
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("connected", {
      username: yourUsername
    });
    return () => {
      socket.disconnect();
      socket.off();
    }
  }, [setYourUsername, yourUsername])

  const FriendsList = () => {
    if (currentGame !== "") {
      return (
        <div className="chatBoxList">
          <h2
            style={{
              margin: "0 auto",
              marginBottom: 4,
            }}
          >
            Invite Friends
          </h2>
          {friends.length >= 1 ? (
            friends.map((n) => {
              return (
                <span
                  key={n + Math.random().toString()}
                  // onClick={(e) => {
                  //     console.log(e.currentTarget.innerHTML);
                  // }}
                >
                  {/*Friend*/}
                  {n}{" "}
                  <div
                    onClick={() => {
                      console.log(`Invite ${n}.`);
                    }}
                  >
                    Invite <i class="fas fa-plus-circle"></i>
                  </div>
                </span>
              );
              // return <span key={n + Math.random().toString()} onClick={e => console.log(e.currentTarget.innerHTML)}>User {n}</span>
            })
          ) : (
            <div className="center">No Friends Yet...</div>
          )}
        </div>
      );
    } else {
      return (
        <div className="chatBoxList">
          <h3
            style={{
              margin: "0 auto",
              marginBottom: 4,
            }}
          >
            Pick A Game First!
          </h3>
          </div>
      );
    }
  };

  const GamesDashboard = () => {
    const gamesList = [
      {
        name: "Click Speed",
        icon: "fas fa-mouse-pointer",
      },
      {
        name: "Game 2",
        icon: "fas fa-futbol",
      },
      {
        name: "Game 3",
        icon: "fas fa-basketball-ball",
      },
    ];

    const getGame = () => {
      if (currentGame === gamesList[0].name) {
        return (
          <>
            <h1 className="header">
              <div className="timer">Timer: 10s</div>
              <div className="title">{gamesList[0].name}</div>
              <div className="userList">Users (1/2): []</div>
            </h1>
            <h2>Score</h2>
            <div className="score">
                <span className="P1">P1 Score: 1</span>
                <span className="P2">P2 Score: 5</span>
            </div>
            <div className="gameItems">
              <button className="p1Btn">P1's Button</button>
              <span className="seperator"></span>
              <button className="p2Btn">P2's Button</button>
            </div>
            <div className="container">
              <button className="startButton">Start Game</button>
            </div>
          </>
        );
      } else if (currentGame === gamesList[1].name) {
        return (
          <>
            <h1>{gamesList[1].name}</h1>
          </>
        );
      } else if (currentGame === gamesList[2].name) {
        return (
          <>
            <h1>{gamesList[2].name}</h1>
          </>
        );
      }
    }

    return (
      <div className="gamesContainer">
        <div className="gamesHeader">
          <h1>Games</h1>
          <span className="seperator"></span>
          {gamesList.map((game) => {
            return (
              <span
                key={game.name}
                onClick={() => {
                  console.log(`${game.name} clicked.`);
                  setCurrentGame(game.name);
                }}
              >
                {game.name}
                <i class={game.icon}></i>
              </span>
            );
          })}
        </div>
        <div className="gamesAndFriendsListContainer">
          <div className={`game ${currentGame.replace(" ", "-").toLowerCase()}`}>
            {/* game in here */}
            {getGame()}
          </div>
          <FriendsList />
        </div>
      </div>
    );
  };

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
