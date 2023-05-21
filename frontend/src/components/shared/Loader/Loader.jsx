import Card from "../Card/Card";
import style from "./Loader.module.css";

function Loader({ message }) {
  return (
    <>
      <div className={`${style.loaderContainer} flex-center`}>
        <Card>
          <span className={`${style.loaderSpin}`}></span>
          <span className={`${style.message}`}>{message}</span>
        </Card>
      </div>
    </>
  );
}

export default Loader;
