import { Navigate } from "react-router-dom";
import Navigation from "../components/shared/Navigation/Navigation";
import Register from "../pages/Register/Register";

function SemiProtectedRoute({ isAuth, user, path }) {
  if (path === "/register") {
    if (isAuth && user.activated) {
      return <Navigate to="/room" />;
    } else if (isAuth && !user.activated) {
      return <Navigate to="/activate" />;
    } else {
      return (
        <>
          <Navigation />
          <Register stepNo={1} />
        </>
      );
    }
  } else if (path === "/activate") {
    if (isAuth && user.activated) {
      return <Navigate to="/room" />;
    } else if (isAuth && !user.activated) {
      return (
        <>
          <Navigation />
          <Register stepNo={3} />
        </>
      );
    } else {
      return <Navigate to="/register" />;
    }
  }
}

export default SemiProtectedRoute;
