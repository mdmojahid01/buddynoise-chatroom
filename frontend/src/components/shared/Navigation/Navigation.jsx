import { useState } from "react";
import { Link } from "react-router-dom";
import NavStyle from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../app/authSlice";
import { ToastContainer } from "react-toastify";
import { RiLogoutCircleRFill } from "react-icons/ri";
import ProfilePopup from "../ProfilePopup/ProfilePopup";

function Navigation() {
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);

  const handleLogout = async () => {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <nav>
      <ToastContainer pauseOnFocusLoss={false} />
      <ul className={`${NavStyle.logo}`}>
        <li>
          <Link to="/" className="">
            <img
              src={process.env.PUBLIC_URL + "./images/logo_emoji.png"}
              alt=""
            />
            BuddyNoise
          </Link>
        </li>
        {isAuth && user && (
          <div className={`${NavStyle.navRight}`}>
            {user.name && <h4 title="username">{user.name}</h4>}

            <button
              onClick={() => {
                setShow((prev) => !prev);
              }}
              className={NavStyle.profileBtn}
            >
              <img
                src={user.avatar ? user.avatar : "/images/profile_pic.jpg"}
                alt="avatar"
                title="avatar"
              />
            </button>

            <button
              title="logout"
              className={`${NavStyle.logoutBtn}  flex-center`}
              onClick={handleLogout}
            >
              <RiLogoutCircleRFill />
            </button>
          </div>
        )}
        {show && <ProfilePopup setShow={setShow} />}
      </ul>
    </nav>
  );
}

export default Navigation;
