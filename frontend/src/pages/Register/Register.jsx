import { useState } from "react";
// import rStyle from "./Register.module.css";
import StepMobileEmail from "./StepMobileEmail";
import StepOtp from "./StepOtp";
import StepName from "./StepName";
import StepAvatar from "./StepAvatar";
// import StepUsername from "./StepUsername";
const steps = {
  1: StepMobileEmail,
  2: StepOtp,
  3: StepName,
  4: StepAvatar,
  // 5: StepUsername,
};
function Register({ stepNo }) {
  const [step, setStep] = useState(stepNo);
  const Step = steps[step];
  const onNext = () => {
    if (step < 4) {
      setStep((old) => old + 1);
    }
  };

  return (
    <>
      <Step onNext={onNext} />
    </>
  );
}

export default Register;
