import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import rStyle from "./Register.module.css";

function StepAvatar({ onNext }) {
  const handelChange = (e) => {
    let reader = new FileReader();
    reader.onload = function () {
      let img = document.querySelector("#profile-pic");
      img.src = reader.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <div className={`${rStyle.registerContainer} flex-center`}>
      <Card heading={`Okay, UserName!`} icon="avatar_emoji.png" alt="icon">
        <p className={`${rStyle.p}`}>Please upload your image!</p>
        <label htmlFor="profile_image">
          <img
            src={`${process.env.PUBLIC_URL + "/images/profile_pic.jpg"}`}
            alt="profile_image"
            className={`${rStyle.profileImage}`}
            id="profile-pic"
          />
        </label>
        <input
          type="file"
          id="profile_image"
          className={`${rStyle.inputBox}`}
          placeholder="otp"
          style={{ display: "none" }}
          onChange={handelChange}
          accept="image/png, image/gif, image/jpeg,image/jpg"
        />
        <p className={`${rStyle.p}`}>
          <label htmlFor="profile_image" className={`${rStyle.resendBtn}`}>
            Choose a different photo
          </label>
        </p>
        <Button text="Next" onNext={onNext} path={null}></Button>
      </Card>
    </div>
  );
}

export default StepAvatar;
