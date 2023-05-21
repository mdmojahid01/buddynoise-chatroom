import Card from "../../components/shared/Card/Card";
import rStyle from "./Register.module.css";
import Button from "../../components/shared/Button/Button";
import { useState } from "react";

function Email({ onNext }) {
  const [email, setEmail] = useState("");
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  // ======================================================================
  //Card== heading, icon, alt, children;
  return (
    <Card heading="Enter you email id" icon="email_emoji.png" alt="email-icon">
      <input
        type="text"
        className={`${rStyle.inputBox}`}
        placeholder="buddynoise@email.com"
        name="email"
        value={email}
        onChange={handleChange}
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
