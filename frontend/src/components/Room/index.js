import react from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import "./Room.css";
export default function Room(){
    return (
        <>
        
        <div className="Room">
            <h1 className="title">Connect with anyone, anywhere, anytime.</h1>
            <div className="room-links">
                <Link to={`/meeting/call/${uuidv4()}`}>
                    <button className="start-meeting-button">
                        Start new Meeting
                    </button>
                </Link>
                <input type="text" placeholder="Enter Meeting ID" className="Meeting-id"/>

            </div>
        </div>
       </>


    )
}