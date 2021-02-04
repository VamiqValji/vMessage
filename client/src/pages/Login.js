import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Redirect } from "react-router";
import { logIn } from "../actions/index";
import SuccessPopUp from "../components/SuccessPopUp";

export default function Login() {
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);
  // console.log(isLogged);

  const submit = (e) => {
    e.preventDefault();

    let EMAIL = document.getElementById("EMAIL").value;
    let PASSWORD = document.getElementById("PASSWORD").value;

    axios
      .post("http://localhost:3001/login", {
        email: EMAIL,
        password: PASSWORD,
      })
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message.includes("Logged in")) {
          setSuccess("Login Successful!");
          dispatch(logIn());
          localStorage.setItem("token", res.data.token);
          <Redirect to="/home" />;
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        if (
          err.response.data.message.includes("Incorrect Password") ||
          err.response.data.message.includes("Login Error")
        ) {
          setSuccess("Login Failed");
        }
      });
  };

  let renderSignUpMsg;

  if (success === "Login Failed") {
    renderSignUpMsg = <div className="fail">Login Failed</div>;
  } else if (success === "Login Successful!") {
    renderSignUpMsg = <div className="success">Login Successful!</div>;
  } else {
    renderSignUpMsg = "";
  }

  return (
    <div className="App">
      <div className="contentContainer">
        <div className="loginContainer">
          <h1>Login</h1>
          <form onSubmit={submit}>
            <label>
              Email:
              <input id="EMAIL" type="text" name="name" required />
            </label>
            <label>
              Password:
              <input id="PASSWORD" type="text" name="name" required />
            </label>
            <div className="flexCenter">
              <input type="submit" value="Login" />
            </div>
          </form>
          <div className="flexCenter">
            <div>
              <span class="dontHaveAccount">Don't have an account? </span>
              <Link
                to="/signup"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
          <div className="flexCenter">
            <div className="successMsg">{renderSignUpMsg}</div>
          </div>
          {isLogged ? <SuccessPopUp /> : ""}
        </div>
      </div>
    </div>
  );
}
