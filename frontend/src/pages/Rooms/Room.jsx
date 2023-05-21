import React from "react";
import style from "./Room.module.css";

function Room() {
  return (
    <>
      <div className={`${style.roomContainer}`}>
        <div className={`${style.roomHeader}`}>
          <div className={`${style.roomheadleft}`}>
            <span className={`${style.backIcon}`}>==</span>
            <span className={`${style.text}`}>All voice rooms</span>
            <div className={`${style.searchIcon}`}>
              <input type="search" name="room-name" id="room" />
            </div>
          </div>
          <div className={`${style.roomheadright}`}>
            <button className={`${style.startARoomBtn}`}>Start a room</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Room;
