import Card from "../../components/shared/Card/Card";
import rStyle from "./Register.module.css";
import Button from "../../components/shared/Button/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtp } from "../../app/authSlice";
import { toast } from "react-toastify";
import { sendOtp } from "../../http/index";

function Email({ onNext }) {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const t = useSelector((state) => state.toastObj);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const submitEmail = async () => {
    const emailRegx = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (emailRegx.test(email)) {
      try {
        const { data } = await toast.promise(
          sendOtp({ email: email }),
          {
            pending: "sending...",
            success: "OTP sent!",
          },
          t
        );
        dispatch(setOtp({ email: data.email, phone: null, hash: data.hash }));
        onNext();
      } catch {}
    } else {
      toast.error("Please enter valid email id", t);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitEmail();
    }
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
        onKeyDown={handleKeyDown}
      />
      <Button path={null} onNext={submitEmail} text="Next" />

      <p className={`${rStyle.p}`}>
        By entering your email id, you're agreeing to our Terms of Service and
        Privacy Policy. Thanks!
      </p>
    </Card>
  );
}

export default Email;
