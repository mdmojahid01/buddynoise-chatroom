const crypto = require("crypto");
const hashService = require("./hash-service");
const { clearScreenDown } = require("readline");
const nodemailer = require("nodemailer");

// ========== Twilio SMS Realated Tokens ===============================
const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require("twilio")(smsSid, smsAuthToken, {
  lazyLoading: true,
});
// ===============================================================
class OtpService {
  // ======== Generating OTP By using below Method by using crypto module of node js =======
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  // ============= Sendind message to user mobile ================
  async sendBySms(otp, phone) {
    return await twilio.messages.create({
      to: phone,
      from: process.env.SMS_FROM_NUMBER,
      body: `Your BuddyNoise opt is ${otp}`,
    });
  }
  // ========== verifying otp given by user =======================
  verifyOtp(hashedOtp, data) {
    let computedHash = hashService.hashOtp(data);
    return computedHash == hashedOtp;
  }
  // ============== Send OPT Through Email =========================
  async sendByEmail(otp, email) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "cr.buddynoise@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "cr.buddynoise@gmail.com",
      to: email,
      subject: "BuddyNoise: Email Verification OTP!",
      text: `${otp}`,
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">BuddyNoise</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing BuddyNoise. Use the following OTP to complete your Sign Up or Login procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />BuddyNoise Team!</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>BuddyNoise</p>
      <p>CS Student Project</p>
      <p>India</p>
    </div>
  </div>
</div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return error;
      } else {
        // console.log("Email sent: " + info.response);
        return info.response;
      }
    });
  }
}

module.exports = new OtpService();
