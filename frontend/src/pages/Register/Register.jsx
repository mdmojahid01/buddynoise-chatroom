import { useState } from "react";
import StepMobileEmail from "./StepMobileEmail";
import StepOtp from "./StepOtp";
import StepName from "./StepName";
import StepAvatar from "./StepAvatar";
import { useSelector } from "react-redux";

const steps = {
  1: StepMobileEmail,
  2: StepOtp,
  3: StepName,
  4: StepAvatar,
};
function Register({ stepNo }) {
  const [step, setStep] = useState(stepNo);
  const user = useSelector(s => s.auth.user);
  const Step = steps[step];
  const onNext = () => {
    if (step < 4) {
      if (step === 2 && !user.activated) {
        return;
      }
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
