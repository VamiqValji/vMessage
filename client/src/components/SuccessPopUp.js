import React from "react";
import '../App.css';
import { Link } from "react-router-dom";

export default function FailPopUp() {
  return (
    <div className="App">
        <div className="popBG">
        <div className="popContainer">
            <div className="pop">
                <h1 class="lightSuccess">You are logged in!</h1>
                <div className="flexCenter">
                <Link to="/">
                    <button>
                    Back to Home
                    </button>
                </Link>
                </div>
            </div>
        </div>
        </div>
    </div>
  );
}

