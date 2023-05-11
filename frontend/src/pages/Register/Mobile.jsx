import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import rStyle from "./Register.module.css";

function Mobile({ onNext }) {
  // heading, icon, alt, children;
  return (
    <Card
      heading="Enter you phone number"
      icon="phone_emoji.png"
      alt="phone-icon"
    >
      <input
        type="text"
        className={`${rStyle.inputBox}`}
        placeholder="+91 9856283928"
      />
      <Button path={null} onNext={onNext} text="Next" />
      <p className={`${rStyle.p}`}>
        By entering your number, you're agreeing to our Terms of Service and
        Privacy Policy. Thanks!
      </p>
    </Card>
  );
}

export default Mobile;
