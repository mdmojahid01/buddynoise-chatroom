import React from "react";
import style from "./Rooms.module.css";
import { ImSearch } from "react-icons/im";
import { BiArrowBack, BiStation } from "react-icons/bi";

function RoomHeader({ setShowModel }) {
  // =======================================
  return (
    <>
      <div className={`${style.roomHeader}`}>
        <div className={`${style.roomheadleft}`}>
          <span className={`${style.text}`}>All voice rooms</span>
          <div className={`${style.searchIcon}`}>
            <ImSearch />
            <input type="search" name="room-name" id="room" />
          </div>
        </div>
        <div className={`${style.roomheadright}`}>
          <button
            onClick={() => {
              setShowModel(true);
            }}
            className={`${style.startARoomBtn} flex-center`}
          >
            {" "}
            <BiStation /> Start a room
          </button>
        </div>
      </div>
    </>
  );
}

export default RoomHeader;
