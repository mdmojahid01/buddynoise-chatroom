import React, { useState } from "react";
import RoomHeader from "./RoomHeader";
import RoomCard from "../../components/RoomCard/RoomCard";
import style from "./Room.module.css";
import AddRoomModel from "../../components/AddRoomModel/AddRoomModel";

function Room() {
  const [showModel, setShowModel] = useState(false);
  const openModel = () => {
    setShowModel(!showModel);
  };

  const rooms = [
    {
      id: 1,
      topic: "Which framework is best for Backend",
      speakers: [
        {
          id: 1,
          name: "Md Mojahid",
          avatar: "/images/profile_pic.jpg",
        },
        {
          id: 2,
          name: "John Doe",
          avatar: "/images/profile_pic.jpg",
        },
      ],
      totalPeople: 30,
    },
    {
      id: 2,
      topic: "Which framework is best for frontend",
      speakers: [
        {
          id: 1,
          name: "Md Mojahid",
          avatar: "/images/profile_pic.jpg",
        },
        {
          id: 2,
          name: "John Doe",
          avatar: "/images/profile_pic.jpg",
        },
      ],
      totalPeople: 30,
    },
    {
      id: 3,
      topic:
        "Which framework is best for frontend Which framework is best for froWhich framework is best for fro",
      speakers: [
        {
          id: 1,
          name: "Md Mojahid",
          avatar: "/images/profile_pic.jpg",
        },
        {
          id: 2,
          name: "John Doe",
          avatar: "/images/profile_pic.jpg",
        },
      ],
      totalPeople: 30,
    },
    {
      id: 4,
      topic: "Which framework is best for frontend",
      speakers: [
        {
          id: 1,
          name: "Md Mojahid",
          avatar: "/images/profile_pic.jpg",
        },
        {
          id: 2,
          name: "John Doe",
          avatar: "/images/profile_pic.jpg",
        },
      ],
      totalPeople: 30,
    },
  ];

  // ============================================
  return (
    <>
      <div className={`${style.hrLine}`}></div>
      <div className={`${style.roomContainer}`}>
        <RoomHeader openModel={openModel} />
        <div className={`${style.roomList}`}>
          {rooms.map((room) => {
            return <RoomCard rooms={room} key={room.id} />;
          })}
          {rooms.map((room) => {
            return <RoomCard rooms={room} key={room.id} />;
          })}
        </div>
        {showModel && <AddRoomModel openModel={openModel} />}
      </div>
    </>
  );
}

export default Room;
