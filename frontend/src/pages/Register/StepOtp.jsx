import { useState } from "react";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import rStyle from "./Register.module.css";
import { verifyOtp } from "../../http/index";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../app/authSlice";
import { toast } from "react-toastify";
import { sendOtp } from "../../http/index";
import { setOtp } from "../../app/authSlice";
// import {}

function StepOtp({ onNext }) {
  const [otpInput, setOtpInput] = useState("");
  const otp = useSelector((state) => state.auth.otp);
  const t = useSelector((state) => state.toastObj);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setOtpInput((v) => (e.target.validity.valid ? e.target.value : v));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitOtp();
    }
  };
  const resendOTP = async () => {
    // console.log(otp);
    try {
      const { data } = await toast.promise(
        sendOtp({ phone: otp.phone, email: otp.email }),
        {
          pending: "sending...",
          success: "OTP sent!",
        },
        t
      );
      dispatch(
        setOtp({ phone: data.phone, email: data.email, hash: data.hash })
      );
    } catch (err) {
      toast.error("Failed try again...", t);
      console.log(err);
    }
  };

  const submitOtp = async () => {
    if (!otpInput) {
      toast.error("Please enter OTP", t);
      return;
    } else if (!otp.hash || (!otp.phone && !otp.email)) {
      toast.error("try again...", t);
      return;
    }
    try {
      const { data } = await toast.promise(
        verifyOtp({
          otp: otpInput,
          phone: otp.phone,
          hash: otp.hash,
          email: otp.email,
        }),
        {
          pending: "Verifing...",
          success: "OTP verified successful",
          error: "Invalid OTP",
        },
        t
      );
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    //Card Props -> heading, icon, alt, children;
    <div className={`${rStyle.registerContainer} flex-center`}>
      <Card
        heading="Enter the code we just texted you"
        icon="otp_emoji.png"
        alt="lock_icon"
      >
        <input
          type="text"
          value={otpInput}
          onChange={handleChange}
          className={`${rStyle.inputBox}`}
          placeholder="otp"
          pattern="[0-9]*"
          onKeyDown={handleKeyDown}
        />
        <p className={`${rStyle.p}`}>
          Didn't receive?{" "}
          <button className={`${rStyle.resendBtn}`} onClick={resendOTP}>
            Tap to resend
          </button>
        </p>
        <Button text="Next" onNext={submitOtp} path={null}></Button>
      </Card>
    </div>
  );
}

export default StepOtp;
