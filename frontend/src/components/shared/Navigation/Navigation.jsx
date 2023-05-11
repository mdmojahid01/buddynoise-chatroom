import { Link } from "react-router-dom";
import NavStyle from "./Navigation.module.css";

function Navigation() {
  // style={{ backgroundColor: "pink" }}
  return (
    <nav>
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
      </ul>
    </nav>
  );
}

export default Navigation;
