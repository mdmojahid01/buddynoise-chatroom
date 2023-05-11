import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import rStyle from "./Register.module.css";

function StepOtp({ onNext }) {
  //Card Props -> heading, icon, alt, children;

  return (
    <div className={`${rStyle.registerContainer} flex-center`}>
      <Card
        heading="Enter the code we just texted you"
        icon="otp_emoji.png"
        alt="lock_icon"
      >
        <input type="text" className={`${rStyle.inputBox}`} placeholder="otp" />
        <p className={`${rStyle.p}`}>
          Didn't receive?{" "}
          <button className={`${rStyle.resendBtn}`}>Tap to resend</button>
        </p>
        <Button text="Next" onNext={onNext} path={null}></Button>
      </Card>
    </div>
  );
}

export default StepOtp;
