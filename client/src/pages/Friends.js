import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import { useSelector } from "react-redux";
import SuccessPopUp from "../components/SuccessPopUp";
import axios from "axios";
// import FriendsList from "../components/FriendsList";

export default function Friends() {
  const isLogged = useSelector((state) => state.isLogged);

  const inputRef = useRef("")

  const [renderSearchMessage, setRenderSearchMessage] = useState("");
  const [frsTo, setFrsTo] = useState([]);
  const [frsFrom, setFrsFrom] = useState([]);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [renderFriendsList, setRenderFriendsList] = useState(<div>Loading...</div>);

  const updateRenderSearchMessage = (classN="success", msg=String) => {
    setRenderSearchMessage(
      <div className="flexCenter" style={{marginBottom:30, marginTop: -30 }}>
        <div className="successMsg">
          <div className={classN} style={{fontSize:20}}>{msg}</div>
        </div>
      </div>
    )
  }

  const addUser = () => {
    console.log("Added");
  }

  const addOrDeleteUser = (user=String, action=String, to=Array, from=Array, classN=String) => {
    action = action.replace("check", "add").replace("times", "delete");
    console.log(user, action, to, from, classN);
    if (action === "add") return addUser();
    // at this point, action === "delete" 
    // DELETE USER
    // client removal
    let index;
    console.log("before removal", to, from);

    /* COMMENTED OUT FOR DB TESTING */
    // if (classN === "frTo") {
    //   index = to.findIndex(a => a === user);
    //   if (index === -1) return;
    //   to.splice(index, 1);
    //   setFrsTo(to);
    // } else {
    //   index = from.findIndex(a => a === user);
    //   if (index === -1) return;
    //   from.splice(index, 1);
    //   setFrsFrom(from);
    // }
    /* COMMENTED OUT FOR DB TESTING */

    //db removal
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .post("http://localhost:3001/friends/requests/delete", {
        username: user,
        token: TOKEN,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        try {
          console.log(err.response.data.message);
        } catch {
          console.warn(err);
        }
      });
    console.log("removed", to, from);
  }

  const renderFriendsListFunc = (to=[], from=[]) => {
    
    let renderTos;
    let renderFroms;

    const renderFrs = (list=[], classN) => {
      return (
      <>
        <div className={classN}>
          <h3>{classN === "frTo"? "Outgoing" : "Incoming"} Friend Requests ({list.length})</h3>
          {list.map((n) => { // e.currentTarget.firstChild.innerHTML
          return <span key={n}><data>{n}</data><i onClick={e => {
            addOrDeleteUser(n, e.currentTarget.className.replace("fas fa-", ""), to, from, classN);
          }} class="fas fa-check"></i><i onClick={e => {
            addOrDeleteUser(n, e.currentTarget.className.replace("fas fa-", ""), to, from, classN);
          }} class="fas fa-times"></i></span> 
          })}
        </div>
      </>)
    }

    if (to.length > 0) {
      renderTos = (renderFrs(to,"frTo"))
    }
    if (from.length > 0) {
      renderFroms = (renderFrs(from,"frFrom"))
    }

    setRenderFriendsList(
      <>
        {renderTos}
        {renderFroms}
        {[1,23,4].map((n) => {return (<span key={n}> Friend {n}</span>);})}
      </>
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
        renderFriendsListFunc(frsTo, frsFrom);
        console.log("Data loaded. => ",frsTo,frsFrom,friendsLoaded);
      })
      .catch((err) => {
        try {
          console.log(err.response.data.message);
        } catch {
          console.warn(err);
        }
      })
  }, []);

  let render = <div>Loading...</div>;
  if (friendsLoaded) {
    render = (
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
          <div className="friendsListContainer">
            <h2>Friends List</h2>
              <div className="friendsList">
                <div className="chatBoxList">
                  {friendsLoaded ? renderFriendsList : <div style={{fontSize: 25}} className="flexCenter">Loading...</div> }
                </div>
              </div>
          </div>
      </div>
    )
  }


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
