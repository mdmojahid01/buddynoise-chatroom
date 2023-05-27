import React, { useState } from "react";
import style from "./AddRoomModel.module.css";
import { RxCross2 } from "react-icons/rx";

function AddRoomModel({ openModel }) {
  const [roomType, setRoomType] = useState("open");

  const updateRoomType = (val) => {
    setRoomType((old) => val);
  }; // =============================================
  return (
    <div className={`${style.modelWrapper} flex-center`}>
      <div className={`${style.innerModelWrapper}`}>
        <button onClick={openModel}>
          <RxCross2 />
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h3>Enter the topic to be disscussed</h3>
          <input type="text" />
          <h3>Room Type</h3>
          <div className={`${style.roomTypeWrapper}`}>
            <button
              onClick={() => {
                updateRoomType("open");
              }}
              className={`${roomType === "open" ? style.activeRoomType : ""}`}
            >
              <img src={`/images/Globe.png`} alt="open" />
              <span>Open</span>
            </button>
            <button
              onClick={() => {
                updateRoomType("social");
              }}
              className={`${roomType === "social" ? style.activeRoomType : ""}`}
            >
              <img src={`/images/Users.png`} alt="social" />
              <span>Social</span>
            </button>
            <button
              onClick={() => {
                updateRoomType("private");
              }}
              className={`${
                roomType === "private" ? style.activeRoomType : ""
              }`}
            >
              <img src={`/images/Lock.png`} alt="private" />
              <span>Private</span>
            </button>
          </div>
          <div className={`${style.hr}`}></div>
          <h3 style={{ textAlign: "center", margin: "20px" }}>
            Start a room, open to everyone
          </h3>
          <button
            // onClick={}
            className={`${style.startARoomBtn} flex-center`}
          >
            {" "}
            <img src="/images/celebrate.png" alt="celebrate" />
            Lets go
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRoomModel;
