import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import rStyle from "./Register.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setAvatar } from "../../app/activateSlice";
import { useEffect, useState } from "react";
import { activateUser } from "../../http/index";
import { setAuth } from "../../app/authSlice";
import Loading from "../../components/shared/Loader/Loader";
import { toast } from "react-toastify";

function StepAvatar({ onNext }) {
  const [mounted, setMounted] = useState(true);
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state) => state.activate);
  const t = useSelector((s) => s.toastObj);
  const [image, setImage] = useState(avatar);
  const [loading, setLoading] = useState(false);

  const handelChange = (e) => {
    let reader = new FileReader();
    reader.onload = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) {
      toast.error("Please choose image", t);
      return;
    }
    setLoading(true);
    try {
      const { data } = await activateUser({ name, avatar });
      if (data) {
        if (mounted) {
          dispatch(setAuth(data));
        }
      }
    } catch (err) {
      toast.error("Activation Failed, try again...", t);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      setMounted(false);
    };
  }, []);
  // ====================================================================
  if (loading) {
    return <Loading message="Activation in progress..." />;
  }
  return (
    <div className={`${rStyle.registerContainer} flex-center`}>
      <Card heading={`Okay, ${name}`} icon="avatar_emoji.png" alt="icon">
        <p className={`${rStyle.p}`}>Please upload your image!</p>
        <label htmlFor="profile_image">
          <img
            src={image ? image : "/images/profile_pic.jpg"}
            alt="profile_image"
            className={`${rStyle.profileImage}`}
            id="profile-pic"
          />
        </label>
        <input
          type="file"
          id="profile_image"
          className={`${rStyle.inputBox}`}
          placeholder=" "
          style={{ display: "none" }}
          onChange={handelChange}
          accept="image/png, image/jpeg,image/jpg"
        />
        <p className={`${rStyle.p}`}>
          <label htmlFor="profile_image" className={`${rStyle.resendBtn}`}>
            Choose a different photo
          </label>
        </p>
        <Button text="Next" onNext={handleSubmit} path={null}></Button>
      </Card>
    </div>
  );
}

export default StepAvatar;
