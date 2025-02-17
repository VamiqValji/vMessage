import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import { useSelector } from "react-redux";
import SuccessPopUp from "../components/SuccessPopUp";
import axios from "axios";
// import FriendsList from "../components/FriendsList";

export default function Friends() {
  const isLogged = useSelector((state) => state.isLogged);

  const inputRef = useRef("");
  const outgoingHeaderRef = useRef("");
  const incomingHeaderRef = useRef("");

  const [yourUsername, setYourUsername] = useState("");
  const [renderSearchMessage, setRenderSearchMessage] = useState("");
  const [frsTo, setFrsTo] = useState([]);
  const [frsFrom, setFrsFrom] = useState([]);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [renderFriendsList, setRenderFriendsList] = useState(
    <div>Loading...</div>
  );

  const updateRenderSearchMessage = (classN = "success", msg = String) => {
    setRenderSearchMessage(
      <div className="flexCenter" style={{ marginBottom: 30, marginTop: -30 }}>
        <div className="successMsg">
          <div className={classN} style={{ fontSize: 20 }}>
            {msg}
          </div>
        </div>
      </div>
    );
  };

  const deleteUserFromUI = (remUser, classN) => {
    console.log("removing: ", remUser);

    remUser.remove();
    console.log(`%c ${classN} `, "background: #222; color: #bada55");

    let frHeader = document.getElementsByClassName(classN);
    if (frHeader.length <= 1) {
      try {
        if (classN === "frTo") {
          console.log(`classN === frTo`);
          outgoingHeaderRef.current.remove();
        } else if (classN === "frFrom") {
          incomingHeaderRef.current.remove();
        }
      } catch (err) {
        console.log(
          "Didn't remove header: ",
          err,
          outgoingHeaderRef,
          incomingHeaderRef
        );
      }
    }
    // frHeader[0].remove();
  };
  const deleteUser = (
    user = "",
    to = [],
    from = [],
    classN = "",
    remUser = <></>,
    deleteFromDB = true
  ) => {
    if (deleteFromDB) {
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

    deleteUserFromUI(remUser, classN);
  };

  const addUser = (
    user = "",
    to = [],
    from = [],
    classN = "",
    remUser = <></>
  ) => {
    console.log("Added");
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .post("http://localhost:3001/friends/requests/add", {
        username: user,
        token: TOKEN,
      })
      .then((res) => {
        console.log("res data: ", res.data);
        if (res.data.message.includes("Added"))
          return deleteUser(user, to, from, classN);
      })
      .catch((err) => {
        try {
          console.log(err.response.data.message);
        } catch {
          console.warn(err);
        }
      });
    deleteUserFromUI(remUser, classN);

    let container = document.getElementsByClassName("chatBoxList")[0];
    console.log(container);
    let child = document.createElement("span");
    let x = document.createElement("span");
    child.addEventListener("click", () => {
      deleteUser(user, to, from, classN, child);
      // console.log("child", child.innerHTML);
      // child.remove();
    });
    // console.log("remuser", remUser);
    x.innerHTML = `<i class="fas fa-times"></i>`;
    child.innerHTML = `<data>${remUser.childNodes[0].innerHTML}</data> ${x.innerHTML}`;
    console.log(x);
    container.appendChild(child);
    // remUser.remove();
  };

  const addOrDeleteUser = (
    user = String,
    action = String,
    to = Array,
    from = Array,
    classN = String
  ) => {
    action = action.replace("check", "add").replace("times", "delete");
    // console.log(user, action, to, from, classN);

    let removingUser = document
      .getElementsByClassName(classN)[0]
      .getElementsByTagName("span");
    for (let i = 0; i < removingUser.length; i++) {
      if (removingUser[i].childNodes[0].innerHTML === user) {
        removingUser = removingUser[i] /*.childNodes[0]*/;
      }
    }

    if (action === "add") return addUser(user, to, from, classN, removingUser);
    // at this point, action === "delete"
    // DELETE USER
    // client removal
    // console.log("before removal", to, from);

    /* COMMENTED OUT FOR TESTING */
    // let index;
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
    /* COMMENTED OUT FOR TESTING */

    //db removal
    deleteUser(user, to, from, classN, removingUser);
  };

  const deleteFriendFromFriendsList = (
    removedFriend = String,
    DOMSpanToRemove = HTMLSpanElement
  ) => {
    DOMSpanToRemove.remove();
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .put("http://localhost:3001/friends/list/delete", {
        username: removedFriend,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.warn(err);
      });
    // console.log("POST");
    // console.log(removedFriend, DOMSpanToRemove);
  };

  const renderFriendsListFunc = (to = [], from = []) => {
    let renderTos;
    let renderFroms;

    const renderFrs = (list = [], classN) => {
      return (
        <>
          <div
            className={classN}
            ref={classN === "frTo" ? outgoingHeaderRef : incomingHeaderRef}
          >
            <h3>
              {classN === "frTo" ? "Outgoing" : "Incoming"} Friend Requests (
              {list.length})
            </h3>
            {list.map((n) => {
              // e.currentTarget.firstChild.innerHTML
              return (
                <span key={n + Math.random().toString()}>
                  <data>{n}</data>
                  {classN !== "frTo" ? (
                    <i
                      onClick={(e) => {
                        addOrDeleteUser(
                          n,
                          e.currentTarget.className.replace("fas fa-", ""),
                          to,
                          from,
                          classN
                        );
                      }}
                      className="fas fa-check"
                    ></i>
                  ) : (
                    ""
                  )}
                  <i
                    onClick={(e) => {
                      addOrDeleteUser(
                        n,
                        e.currentTarget.className.replace("fas fa-", ""),
                        to,
                        from,
                        classN
                      );
                    }}
                    className="fas fa-times"
                  ></i>
                </span>
              );
            })}
          </div>
        </>
      );
    };

    if (to.length > 0) {
      renderTos = renderFrs(to, "frTo");
    }
    console.log("to", to, "from", from, "frsTo", frsTo, "frsFrom", frsFrom);
    if (from.length > 0) {
      renderFroms = renderFrs(from, "frFrom");
    }

    let friends = [];
    // FRIENDS SCHEMA
    // friends: [
    //   {name: String, messages: [
    //     ["username", "message"]
    //   ]},
    // ],
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .get("http://localhost:3001/friends/get")
      .then((res) => {
        console.log("get friends", res.data);
        res.data.friends.forEach((friend) => {
          if (friend !== undefined) {
            friends.push(friend);
          }
        });
        setRenderFriendsList(
          <>
            {renderTos}
            {renderFroms}
            {friends.map((n) => {
              // console.log("FRIEND: ", friends);
              return (
                <span key={n + Math.random().toString()}>
                  {" "}
                  {/* Friend */} {n}
                  <i
                    style={{ marginLeft: 20, cursor: "pointer" }}
                    onClick={(e) => {
                      // REMOVE FRIEND!
                      setYourUsername(res.data.yourUsername);
                      deleteFriendFromFriendsList(
                        n,
                        e.currentTarget.parentElement
                      );
                      console.log("remove friend!");
                    }}
                    className="fas fa-times"
                  ></i>
                </span>
              );
            })}
          </>
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
  };

  useEffect(() => {
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;
    // let tempFrsTo = [];
    // let tempFrsFrom = [];
    axios.defaults.headers.common["auth-token"] = TOKEN;
    axios
      .post("http://localhost:3001/friends/requests", {
        token: TOKEN,
      })
      .then((res) => {
        console.log(res.data);
        res.data.frs.forEach((fr) => {
          if (fr.to !== undefined) {
            setFrsTo((prev) => prev.push(fr.to));
            // setFrsTo((prev) => [...prev, fr.to]);
            console.log("pushing TO: ", fr.to);
            // tempFrsTo.push(fr.to);
          } else if (fr.from !== undefined) {
            setFrsFrom((prev) => prev.push(fr.from));
            // setFrsFrom((prev) => [...prev, fr.from]);
            console.log("pushing FROM: ", fr.from);
            // tempFrsFrom.push(fr.from);
          }
        });
        // setFrsTo(tempFrsTo);
        // setFrsFrom(tempFrsFrom);
        console.log(
          "%c AFTER PUSH, TO, FROM",
          frsTo,
          frsFrom,
          "background: #222; color: #bada55"
        );
        renderFriendsListFunc(frsTo, frsFrom);
        setFriendsLoaded(true);
        console.log("Data loaded. => ", frsTo, frsFrom, friendsLoaded);
      })
      .catch((err) => {
        try {
          console.log(err.response.data.message);
        } catch {
          console.warn(err);
        }
      });
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
              {friendsLoaded ? (
                renderFriendsList
              ) : (
                <div style={{ fontSize: 25 }} className="flexCenter">
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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
