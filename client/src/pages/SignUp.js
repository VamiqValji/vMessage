import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "../App.css";
import { Route, Redirect } from 'react-router'
import { logIn } from "../actions/index";

export default function SignUp() {
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);
  console.log(isLogged);

  const submit = (e) => {
    e.preventDefault();

    let EMAIL = document.getElementById("EMAIL").value;
    let PASSWORD = document.getElementById("PASSWORD").value;

    axios
      .post("http://localhost:3001/signup", {
        email: EMAIL,
        password: PASSWORD,
      })
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message.includes("Created")) {
          setSuccess("Sign Up Successful!");
          dispatch(logIn());
        }
        // <Route exact path="/">
        //   <Redirect to="/home" />
        // </Route>
        <Redirect to="/home" />
      })
      .catch((err) => {
        console.log(err.response.data.message);
        if (err.response.data.message.includes("already used")) {
          setSuccess("Sign Up Failed");
        }
      });
  };

  let renderSignUpMsg;

  if (success === "Sign Up Failed") {
    renderSignUpMsg = <div className="fail">Sign Up Failed</div>;
  } else if (success === "Sign Up Successful!") {
    renderSignUpMsg = <div className="success">Sign Up Successful!</div>;
  } else {
    renderSignUpMsg = ""
  }

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <h1>Sign Up</h1>
          <form onSubmit={submit}>
            <label>
              Email:
              <input id="EMAIL" type="text" name="email" required />
            </label>
            <label>
              Password:
              <input id="PASSWORD" type="text" name="password" required />
            </label>
            <div className="flexCenter">
              <input type="submit" value="Submit" />
            </div>
          </form>
          <div className="flexCenter">
            <div>
              Have an account?{" "}
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Login{" "}
              </Link>
            </div>
          </div>
          <div className="flexCenter">
            <div className="successMsg">
              {renderSignUpMsg}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
