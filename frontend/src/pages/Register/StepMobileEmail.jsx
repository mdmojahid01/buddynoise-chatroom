import { useState } from "react";
import rStyle from "./Register.module.css";
import { FiSmartphone } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import Mobile from "./Mobile";
import Email from "./Email";

function StepMobileEmail({ onNext }) {
  const [registerMode, setRegisterMode] = useState("M");
  const switchRegisterMode = (mode) => {
    setRegisterMode(mode);
  };

  return (
    <>
      <div className={`${rStyle.registerContainer} flex-center`}>
        <div className={`${rStyle.registerType}`}>
          <button
            onClick={() => {
              switchRegisterMode("M");
            }}
            className={`flex-center ${
              registerMode === "M" ? `${rStyle.active}` : ""
            }`}
          >
            <FiSmartphone />
          </button>
          <button
            onClick={() => {
              switchRegisterMode("E");
            }}
            className={`flex-center ${
              registerMode === "E" ? `${rStyle.active}` : ""
            }`}
          >
            <MdOutlineEmail />
          </button>
        </div>
        {/* ---------------------------- */}
        {registerMode === "M" && <Mobile onNext={onNext} />}
        {registerMode === "E" && <Email onNext={onNext} />}
      </div>
    </>
  );
}

export default StepMobileEmail;
