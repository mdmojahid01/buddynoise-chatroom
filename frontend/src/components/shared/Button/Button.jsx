import BtnStyle from "./Button.module.css";
import { MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Button({ text, path, onNext }) {
  const navigate = useNavigate();
  const Btnclick = () => {
    // console.log(path, onNext);
    if (path) {
      navigate(path);
    }
    if (onNext) {
      onNext();
    }
  };
  return (
    <div className={`${BtnStyle.buttonContainer}`}>
      <button onClick={Btnclick}>
        {text}
        <MdArrowForward />
      </button>
    </div>
  );
}

export default Button;
