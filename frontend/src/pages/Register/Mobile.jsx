import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import rStyle from "./Register.module.css";
import { sendOtp } from "../../http/index";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtp } from "../../app/authSlice";
import { toast } from "react-toastify";

function Mobile({ onNext }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  const t = useSelector((state) => state.toastObj);
  const handleChange = (e) => {
    setPhoneNumber((v) => (e.target.validity.valid ? e.target.value : v));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitPhoneNumber();
    }
  };

  const submitPhoneNumber = async () => {
    if (phoneNumber.length === 10) {
      try {
        const { data } = await toast.promise(
          sendOtp({ phone: phoneNumber }),
          {
            pending: "sending...",
            success: "OTP sent!",
          },
          t
        );
        // const { data } = await sendOtp({ phone: phoneNumber });
        dispatch(setOtp({ phone: data.phone, hash: data.hash }));
        onNext();
      } catch (err) {
        toast.error("Failed try again...", t);
        console.log(err);
      }
    } else {
      toast.error("Please enter 10-digit phone no.", t);
    }
  };
  // ===================================================================================
  return (
    // card props = heading, icon, alt, children;
    <Card
      heading="Enter you phone number"
      icon="phone_emoji.png"
      alt="phone-icon"
    >
      <input
        type="text"
        className={`${rStyle.inputBox}`}
        placeholder="+91 9856283928"
        value={phoneNumber}
        name="phone"
        pattern="[0-9]*"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Button path={null} onNext={submitPhoneNumber} text="Next" />

      <p className={`${rStyle.p}`}>
        By entering your number, you're agreeing to our Terms of Service and
        Privacy Policy. Thanks!
      </p>
    </Card>
  );
}

export default Mobile;
