import { useState } from "react";
// import lStyle from "./Login.module.css";
import StepMobileEmail from "../Register/StepMobileEmail";
import StepOtp from "../Register/StepOtp";

const steps = {
  1: StepMobileEmail,
  2: StepOtp,
};
function Login() {
  const [step, setStep] = useState(1);
  const Step = steps[step];
  const onNext = () => {
    if (step < 2) {
      setStep((old) => old + 1);
    }
  };

  return (
    <>
      <Step onNext={onNext} />
    </>
  );
}

export default Login;
