import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import rStyle from "./Register.module.css";

function StepName({ onNext }) {
  return (
    <div className={`${rStyle.registerContainer} flex-center`}>
      <Card heading="What's your full name?" icon="name_emoji.png" alt="icon">
        <input
          type="text"
          className={`${rStyle.inputBox}`}
          placeholder="Your name"
        />
        <p className={`${rStyle.p}`}>Please use real names at BuddyNoise :)</p>
        <Button text="Next" onNext={onNext} path={null}></Button>
      </Card>
    </div>
  );
}

export default StepName;
