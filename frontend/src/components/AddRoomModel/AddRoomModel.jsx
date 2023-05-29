import React, { useState } from "react";
import style from "./AddRoomModel.module.css";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createRoom as create } from "../../http";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader/Loader";

function AddRoomModel({ setShowModel }) {
  const navigate = useNavigate();
  const t = useSelector((state) => state.toastObj);

  const [roomType, setRoomType] = useState("open");
  const [topic, setTopic] = useState("");
  const [lengthOfTopic, setLengthOfTopic] = useState(0);
  const [loading, setLoading] = useState(false);

  const updateRoomType = (val) => {
    setRoomType((old) => val);
  };

  let flag = true;
  const handleChange = (e) => {
    if (e.target.value.length > 50) {
      if (flag) {
        toast.error("Topic name is too long", t);
        flag = false;
      }
    } else {
      setTopic(e.target.value);
      setLengthOfTopic(e.target.value.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRoom();
  };
  const createRoom = async (e) => {
    if (topic.length === 0) {
      toast.error("Please enter topic name to be disscussed", t);
    } else if (topic.length <= 5) {
      toast.error("Topic name is too short", t);
    } else {
      try {
        setLoading(true);
        let t = topic.charAt(0).toUpperCase() + topic.slice(1);
        const { data } = await create({ topic: t, roomType });
        setLoading(false);
        navigate(`/room/${data.id}`);
      } catch (err) {
        console.log(err.message);
        toast.error(err.message, t);
        setLoading(false);
      }
    }
  };

  // =============================================
  return (
    <div className={`${style.modelWrapper} flex-center`}>
      {loading && <Loader message="Creating room, please wait..." />}
      {!loading && (
        <div className={`${style.innerModelWrapper}`}>
          <button
            onClick={() => {
              setShowModel(false);
            }}
          >
            <RxCross2 />
          </button>
          <form onSubmit={handleSubmit}>
            <h3>Enter the topic to be disscussed</h3>
            <div className={`${style.inputTopisWrapper}`}>
              <input type="text" value={topic} onChange={handleChange} />
              <span>{lengthOfTopic} / 50</span>
            </div>
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
                className={`${
                  roomType === "social" ? style.activeRoomType : ""
                }`}
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
              {roomType === "open" && "Start a room, open to everyone"}
              {roomType === "social" && "Start a room, open to social people"}
              {roomType === "private" && "Start a room, open to private people"}
            </h3>
            <button
              onClick={createRoom}
              className={`${style.startARoomBtn} flex-center`}
            >
              <img src="/images/celebrate.png" alt="celebrate" />
              Lets go
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddRoomModel;
