import React from "react";
import style from "./RoomCard.module.css";
import { AiFillMessage } from "react-icons/ai";
import { GiCharacter } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

function RoomCard({ room }) {
  const navigate = useNavigate();
  // ================================================
  return (
    <div
      className={`${style.roomCard}`}
      onClick={() => {
        navigate(`/room/${room.id}`);
      }}
    >
      <h3 className={`${style.roomHeader}`} title={room.topic}>
        {room.topic}
      </h3>
      <div className={`${style.speakers}`}>
        <div
          className={`${
            room.speakers.length === 0
              ? style.avatars
              : style.singleAvatar + " flex-center"
          }`}
        >
          {room.speakers[0] && (
            <img
              className={`${style.speakersAvatar1}`}
              src={room.speakers[0].avatar}
              alt="speaker"
            />
          )}
          {room.speakers[1] && (
            <img
              className={`${style.speakersAvatar2}`}
              src={room.speakers[1].avatar}
              alt="speaker"
            />
          )}
        </div>
        <div className={`${style.speakersName}`}>
          {room.speakers[0] && (
            <h3>
              {room.speakers[0].name}
              <AiFillMessage style={{ marginLeft: "5px" }} />
            </h3>
          )}

          {room.speakers[1] && (
            <h3 style={{ margin: "10px 0px" }}>
              {room.speakers[1].name}
              <AiFillMessage style={{ marginLeft: "5px" }} />
            </h3>
          )}
        </div>
      </div>
      <span className={`${style.totalUserIcon}`}>
        {room.totalPeople}
        <GiCharacter style={{ marginLeft: "5px" }} />
      </span>
    </div>
  );
}

export default RoomCard;
