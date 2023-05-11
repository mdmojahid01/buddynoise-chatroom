import Card from "../../components/shared/Card/Card";
import rStyle from "./Register.module.css";
import Button from "../../components/shared/Button/Button";

function Email({ onNext }) {
  //Card== heading, icon, alt, children;
  return (
    <Card heading="Enter you email id" icon="email_emoji.png" alt="email-icon">
      <input
        type="text"
        className={`${rStyle.inputBox}`}
        placeholder="buddynoise@email.com"
      />
      <Button path={null} onNext={onNext} text="Next" />
      <p className={`${rStyle.p}`}>
        By entering your email id, you're agreeing to our Terms of Service and
        Privacy Policy. Thanks!
      </p>
    </Card>
  );
}

export default Email;
