import React, { useEffect } from "react";
import style from "./ProfilePopup.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../app/authSlice";
import { logout } from "../../../http";
import Button from "../Button/Button";

function ProfilePopup({ setShow }) {
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  // ===========================================
  return (
    isAuth &&
    user && (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShow((prev) => !prev);
        }}
        className={`${style.ProfilePopup} flex-center`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`${style.ProfilePopupInner} flex-center`}
        >
          <img src={user.avatar} alt="" />
          <h2>{user.name}</h2>
          <Button text={"Logout"} onNext={handleLogout} />
        </div>
      </div>
    )
  );
}

export default ProfilePopup;
