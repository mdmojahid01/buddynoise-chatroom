import React from "react";
import style from "./RoomCard.module.css";
import { AiFillMessage } from "react-icons/ai";
import { GiCharacter } from "react-icons/gi";

function RoomCard({ rooms }) {
  // ================================================
  return (
    <div className={`${style.roomCard}`}>
      <h3 className={`${style.roomHeader}`} title={rooms.topic}>
        {rooms.topic}
      </h3>
      <div className={`${style.speakers}`}>
        <div className={`${style.avatars}`}>
          <img
            className={`${style.speakersAvatar1}`}
            src={rooms.speakers[0].avatar}
            alt="speaker"
          />
          <img
            className={`${style.speakersAvatar2}`}
            src={rooms.speakers[1].avatar}
            alt="speaker"
          />
        </div>
        <div className={`${style.speakersName}`}>
          <h3>
            {rooms.speakers[0].name}
            <AiFillMessage style={{ marginLeft: "5px" }} />
          </h3>
          <h3>
            {rooms.speakers[1].name}
            <AiFillMessage style={{ marginLeft: "5px" }} />
          </h3>
        </div>
      </div>
      <span className={`${style.totalUserIcon}`}>
        {rooms.totalPeople}
        <GiCharacter style={{ marginLeft: "5px" }} />
      </span>
    </div>
  );
}

export default RoomCard;
