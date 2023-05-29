import { Navigate } from "react-router-dom";
import Navigation from "../components/shared/Navigation/Navigation";
import Rooms from "../pages/Rooms/Rooms";
import Room from "../pages/Room/Room";

function ProtectedRoute({ isAuth, user, path }) {
  if (isAuth && user.activated) {
    // if (path === "/room/:id") {
    //   return (
    //     <>
    //       <Navigation />
    //       <Room />
    //     </>
    //   );
    // }
    return (
      <>
        <Navigation />
        {path === "/room/:id" ? <Room /> : <Rooms />}
      </>
    );
  } else if (isAuth && !user.activated) {
    return <Navigate to="/activate" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
