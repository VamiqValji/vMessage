import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import { useSelector } from "react-redux";
import SuccessPopUp from "../components/SuccessPopUp";
import axios from "axios";

export default function Friends() {
  const isLogged = useSelector((state) => state.isLogged);

  const inputRef = useRef("")

  const [renderSearchMessage, setRenderSearchMessage] = useState("");
  const [frsTo, setFrsTo] = useState([]);
  const [frsFrom, setFrsFrom] = useState([]);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  let renderFriends;

  const updateRenderSearchMessage = (classN="success", msg=String) => {
    setRenderSearchMessage(
      <div className="flexCenter" style={{marginBottom:30, marginTop: -30 }}>
        <div className="successMsg">
          <div className={classN} style={{fontSize:20}}>{msg}</div>
        </div>
      </div>
    )
  }

  const searchFriends = (e) => {
    e.preventDefault();
    if (inputRef.current.value.length < 1) return;
    const SEARCH = inputRef.current.value;
    inputRef.current.value = "";

    // get server response
    const TOKEN = localStorage.getItem("token");
      if (!TOKEN) return;
      axios.defaults.headers.common["auth-token"] = TOKEN;
      axios
        .post("http://localhost:3001/friends/search", {
          search: SEARCH,
          token: TOKEN,
        })
        .then((res) => {
          console.log(res.data);
          // user found
          updateRenderSearchMessage("success", res.data.message);
        })
        .catch((err) => {
          try {
            console.log(err.response.data.message);
            updateRenderSearchMessage("fail", err.response.data.message);
          } catch {
            console.warn(err);
          }
        });
  }

  useEffect(() => {
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .post("http://localhost:3001/friends/requests", {
        token: TOKEN,
      })
      .then((res) => {
        console.log(res.data);
        res.data.frs.forEach((fr) => {
          try {
            setFrsTo(prev => prev.push(fr.to));
          } catch(err) {
            setFrsFrom(prev => prev.push(fr.from));
          }
        })
        setFriendsLoaded(true);
        console.log("Data loaded. => ",frsTo,frsFrom,friendsLoaded)
      })
      .catch((err) => {
        try {
          console.log(err.response.data.message);
        } catch {
          console.warn(err);
        }
      })
  }, []);

  if (friendsLoaded) {
    renderFriends = (
      <>
        {/* <span className="frTo">Outgoing Friend Requests</span>
        {console.log("FRSTO MAP", frsTo)}
        {frsTo.map((n) => {(<span key={n}> Friend {n}</span>);})}
        <span className="frFrom">Incoming Friend Requests</span>
        {frsFrom.map((n) => {(<span key={n}> Friend {n}</span>);})} */}
        {["6021ea1165904c52ccb27d43"].map((n) => {return (<span key={n}> Friend {n}</span>);})}
        <span className="friends">Friend</span>
        {[1,23,4].map((n) => {return (<span key={n}> Friend {n}</span>);
          // return <span key={n} onClick={e => console.log(e.currentTarget.innerHTML)}>User {n}</span>
        })}
      </>
    )
  } else {
    renderFriends = (
      <div>Loading...</div>
    )
  }

  let render = (
    <div className="friendsContainer">
      <h2>Add Friend</h2>
      <div className="messageBoxContainer">
          <form onSubmit={(e) => searchFriends(e)} className="messageBox">
            <span>
              <input
                ref={inputRef} 
                placeholder="Search Username"
                type="text"
                name="Message"
                id="msg"
              />
              <button>Search</button>
            </span>
          </form>
        </div>
        {renderSearchMessage}
        {/* <div className="flexCenter" style={{marginBottom:50, marginTop: -30 }}>
          <div className="successMsg">
          <div className="success">test</div>
          </div>
  </div> */}
  {/*FINISH RENDER ON FRIEND FIND, UPDATE FRIENDS*/}
        {/*renderSearchMessage*/}
        <div className="friendsListContainer">
          <h2>Friends List</h2>
            <div className="friendsList">
              <div className="chatBoxList">
                {renderFriends}
              </div>
            </div>
        </div>
    </div>
  )

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <h1>Friends</h1>
          <div>
            {isLogged ? (
              render
            ) : (
              <SuccessPopUp message={"Please go login first."} color={"red"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
