import React from "react";
import "../App.css";
import { useSelector /*, useDispatch*/ } from "react-redux";
// import { logIn, logOut } from "../actions/index";
import AllChat from "../components/AllChat";

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

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <h1>Home</h1>
          <div>{isLogged ? <AllChat /> : "go login!"}</div>
          {/* <button onClick={clicked}>hello</button> */}
        </div>
      </div>
    </div>
  );
}
