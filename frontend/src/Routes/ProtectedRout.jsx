import { Navigate } from "react-router-dom";
import Navigation from "../components/shared/Navigation/Navigation";
import Room from "../pages/Rooms/Room";


function ProtectedRoute({ isAuth, user, path }) {
  if (isAuth && user.activated) {
    return (
      <>
        <Navigation />
        <Room />
        
      </>
    );
  } else if (isAuth && !user.activated) {
    return <Navigate to="/activate" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
