import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import rStyle from "./Register.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../app/activateSlice";
import { toast } from "react-toastify";

function StepName({ onNext }) {
  const storeName = useSelector((state) => state.activate.name);
  const t = useSelector((state) => state.toastObj);
  const [name, setNameInput] = useState(storeName);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setNameInput(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitName();
    }
  };

  const submitName = () => {
    if (!name) {
      toast.error("Please enter name", t);
      return;
    }
    if (name.length < 4) {
      toast.error("Please enter correct name", t);
      return;
    }
    dispatch(setName(name));
    onNext();
  };

  // ======================================================================
  return (
    <div className={`${rStyle.registerContainer} flex-center`}>
      <Card heading="What's your full name?" icon="name_emoji.png" alt="icon">
        <input
          type="text"
          className={`${rStyle.inputBox}`}
          placeholder="Your name"
          name="name"
          value={name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <p className={`${rStyle.p}`}>Please use real names at BuddyNoise :)</p>
        <Button text="Next" onNext={submitName} path={null}></Button>
      </Card>
    </div>
  );
}

export default StepName;
