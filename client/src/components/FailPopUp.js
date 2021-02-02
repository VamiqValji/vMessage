import React from "react";
import '../App.css';
import { Link } from "react-router-dom";

export default function FailPopUp() {
  return (
    <div className="App">
        <div className="popContainer">
            <h1>Fail</h1>
            <div className="flexCenter">
                <button>
                <Link to="/">Back to Home</Link>
                </button>
            </div>
            </div>
    </div>
  );
}

