import React from "react";
import {
  Link
} from "react-router-dom";
import '../App.css';
// import SignUp from "./SignUp";

export default function Login() {
  const submit = (e) => {
    e.preventDefault();

    let EMAIL = document.getElementById("EMAIL").value;
    let PASSWORD = document.getElementById("PASSWORD").value;

    console.log(EMAIL);
    console.log(PASSWORD);
  };

  return (
    <div className="App">
        <div className="contentContainer">
            <div className="loginContainer">
            <h1>Login</h1>
            <form onSubmit={submit}>
            <label>
                Email:
                <input id="EMAIL" type="text" name="name" />
            </label>
            <label>
                Password:
                <input id="PASSWORD" type="text" name="name" />
            </label>
                <div className="flexCenter">
                <input type="submit" value="Submit" />
                </div>
            </form>
            <div className="flexCenter">
            <div>Don't have an account? <Link to="/signup" style={{ textDecoration: 'none', color: "white", fontWeight: "bold" }}>Login</Link></div>
            </div>
            </div>
        </div>
    </div>
  );
}

