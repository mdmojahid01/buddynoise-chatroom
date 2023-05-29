import React, { useState, useEffect } from "react";
import RoomHeader from "./RoomHeader";
import RoomCard from "../../components/RoomCard/RoomCard";
import style from "./Rooms.module.css";
import AddRoomModel from "../../components/AddRoomModel/AddRoomModel";
import { getAllRooms } from "../../http";

function Rooms() {
  const [showModel, setShowModel] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await getAllRooms();
      setRooms(data);
      // console.log(data);
    };
    fetchRooms();
  }, []);

  // ============================================
  return (
    <>
      <div className={`${style.hrLine}`}></div>
      <div className={`${style.roomContainer}`}>
        <RoomHeader setShowModel={setShowModel} />
        <div className={`${style.roomList}`}>
          {rooms.map((room) => {
            return <RoomCard room={room} key={room.id} />;
          })}
        </div>
        {showModel && <AddRoomModel setShowModel={setShowModel} />}
      </div>
    </>
  );
}

export default Rooms;
