import { useRouteError } from "react-router-dom";
import errStyle from "./Error.module.css";
import Button from "../../components/shared/Button/Button";
// import Navigation from "../../components/shared/Navigation/Navigation";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      {/* <Navigation /> */}
      <div id="error-page" className={`${errStyle.container} flex-center`}>
        <div className={`${errStyle.innContainer} flex-center`}>
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
          <Button path="/" text="Go to home" />
        </div>
      </div>
    </>
  );
}
