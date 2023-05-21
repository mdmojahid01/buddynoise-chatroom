import { Link } from "react-router-dom";
import NavStyle from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../app/authSlice";
import { ToastContainer } from "react-toastify";
import { RiLogoutCircleRFill } from "react-icons/ri";

function Navigation() {
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
  // style={{ backgroundColor: "pink" }}
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
            {user.avatar && (
              <Link to="/">
                <img src={user.avatar} alt="avatar" title="avatar" />
              </Link>
            )}
            <button
              title="logout"
              className="flex-center"
              onClick={handleLogout}
            >
              <RiLogoutCircleRFill />
            </button>
          </div>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
