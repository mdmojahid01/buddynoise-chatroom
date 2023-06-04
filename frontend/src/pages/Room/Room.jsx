import React, { useEffect, useState } from "react";
import style1 from "../Rooms/Rooms.module.css";
import style2 from "./Room.module.css";
import { useWebRTC } from "../../Hooks/useWebRTC";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { getRoom } from "../../http";

function Room() {
  const { id: roomId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [clients, provideRef, handleMute] = useWebRTC(roomId, user);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isMute, setMute] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await getRoom(roomId);
      setRoom((prev) => data);
    };
    fetchRooms();
  }, []);
  // ==================================
  useEffect(() => {
    handleMute(isMute, user.id);
  }, [isMute]);
  const handleMuteClick = (clientId) => {
    setMute((isMute) => !isMute);
  };
  // ====================================================
  return (
    <div className={style2.singleRoomConatainer}>
      <div className={`${style1.hrLine}`}></div>
      <div className={style2.roomHeader}>
        <BiArrowBack
          className={`${style1.backIcon}`}
          onClick={() => {
            navigate("/room");
          }}
        />
        <span className={`${style1.text}`}>All voice rooms</span>
      </div>
      <div className={style2.clientsWrapper}>
        <div className={style2.header}>
          {room && <h2 title="Room topic">{room.topic}</h2>}
          <div className={style2.buttonwrap}>
            <button>🤚</button>
            <button
              onClick={() => {
                navigate("/room");
              }}
            >
              ✌️Leave quietly
            </button>
          </div>
        </div>
        <div className={style2.clientList}>
          {clients.map((client) => {
            return (
              <div className={style2.client} key={client.id}>
                <div className={style2.userHead}>
                  <button
                    onClick={() => {
                      handleMuteClick(client.id);
                    }}
                    className={`${style2.micwrap} flex-center`}
                    disabled={client.id !== user.id}
                    title={client.id !== user.id ? "permission denied" : ""}
                  >
                    {client.muted ? (
                      <BsFillMicMuteFill style={{ color: "red" }} />
                    ) : (
                      <BsFillMicFill style={{ color: "white" }} />
                    )}
                  </button>

                  <audio
                    style={{ display: "none" }}
                    ref={(instance) => provideRef(instance, client.id)}
                    controls
                    autoPlay
                  ></audio>
                  <img
                    src={client.avatar}
                    className={style2.activeClient}
                    alt={client.name}
                  />
                </div>
                <h3>{client.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Room;
