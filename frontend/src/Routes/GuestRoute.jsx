import { Navigate } from "react-router-dom";
import Navigation from "../components/shared/Navigation/Navigation";
import Home from "../pages/home/Home";
import Login from "../pages/Login/Login";

const GuestRoute = ({ isAuth, user, path }) => {
  if (path === "/") {
    if (isAuth && user.activated) {
      return <Navigate to="/room" />;
    } else if (isAuth && !user.activated) {
      return <Navigate to="/activate" />;
    } else {
      return (
        <>
          <Navigation />
          <Home />
        </>
      );
    }
  } else if (path === "/login") {
    if (isAuth && user.activated) {
      return <Navigate to="/room" />;
    } else if (isAuth && !user.activated) {
      return <Navigate to="/activate" />;
    } else {
      return (
        <>
          <Navigation />
          <Login />
        </>
      );
    }
  }
};

export default GuestRoute;
