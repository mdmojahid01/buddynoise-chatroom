import React from "react";
import homeStyle from "./Home.module.css";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import { Link } from "react-router-dom";
// import Navigation from "../../components/shared/Navigation/Navigation";

function Home() {
  return (
    <>
      {/* <Navigation /> */}
      <div className={`${homeStyle.homeContainer} flex-center`}>
        <Card heading="Welcome To BuddyNoise" icon="logo_emoji.png" alt="emoji">
          <p className={`${homeStyle.p}`}>
            We're working hard to get BuddyNoise ready for everyone! While we
            wrap up the finishing youches, we're adding people gradually to make
            sure nothing breaks :)
          </p>
          <Button path="/register" text="Get your username" />
          <div className={`${homeStyle.signinButton}`}>
            Have an invite text?
            <Link to="/login">Sign In</Link>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Home;
