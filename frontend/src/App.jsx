import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navigation from "./components/shared/Navigation/Navigation";
import ErrorPage from "./pages/Error/ErrorPage";
import GuestRoute from "./Routes/GuestRoute";
import SemiProtectedRoute from "./Routes/SemiProtectedRoute";
import ProtectedRoute from "./Routes/ProtectedRout";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./Hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";

function App() {
  const { isAuth, user } = useSelector((state) => state.auth);
  const { loading } = useLoadingWithRefresh();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <GuestRoute path="/" isAuth={isAuth} user={user} />,
      errorElement: (
        <>
          <Navigation />
          <ErrorPage />
        </>
      ),
    },
    {
      path: "/login",
      element: <GuestRoute path="/login" isAuth={isAuth} user={user} />,
    },
    {
      path: "/register",
      element: (
        <SemiProtectedRoute path="/register" isAuth={isAuth} user={user} />
      ),
    },
    {
      path: "/activate",
      element: (
        <SemiProtectedRoute path="/activate" isAuth={isAuth} user={user} />
      ),
    },
    {
      path: "/room",
      element: <ProtectedRoute path="/room" isAuth={isAuth} user={user} />,
    },
  ]);
  return loading ? (
    <Loader message="Loading, Please wait..." />
  ) : (
    <RouterProvider router={router} />
  );
}
export default App;
