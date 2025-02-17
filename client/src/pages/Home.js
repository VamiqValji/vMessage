import React from "react";
import "../App.css";
import { useSelector /*, useDispatch*/ } from "react-redux";
// import { logIn, logOut } from "../actions/index";
// import AllChat from "../components/AllChat";
import { Link } from "react-router-dom";

export default function Home() {
  // const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);
  // let bool = false;
  // const clicked = () => {
  //   if (bool) {
  //     dispatch(logOut())
  //     bool = !bool;
  //   } else {
  //     dispatch(logIn())
  //     bool = !bool;
  //   }
  //   console.log()
  // }

  const linkStyle = { textDecoration: "none", color: "white" };

  const publicChat = () => {
    return (
      <li className="logOut">
        <Link to="/public" style={linkStyle}>
          Public Room
        </Link>
      </li>
    );
  };

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <h1>Home</h1>
          <div>
            {isLogged ? (
              /*<AllChat />*/ publicChat()
            ) : (
              <Link to="/public" style={linkStyle}>
                go login!
              </Link>
            )}
          </div>
          {/* <button onClick={clicked}>hello</button> */}
        </div>
      </div>
    </div>
  );
}
