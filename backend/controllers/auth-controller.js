const hashServices = require("../services/hash-service");
const otpServices = require("../services/otp-service");
const userService = require("../services/user-service");
const tokenServices = require("../services/token-service");

class AuthController {
  // ============== Method to send OTP ============
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      res.status(404).json({
        message: "Phone feild is required!",
      });
    }

    const otp = await otpServices.generateOtp();
    // ====== Below variable is used 2 min for expiry time limit to verify otp =====

    // const ttl = 1000 * 60 *5; // 5 min expiration of OTP in production
    const ttl = 1000 * 60 * 60 * 24 * 30;

    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    // ===== Hashing the data by using crypto module to verify otp on server ======
    const hash = hashServices.hashOtp(data);

    try {
      await otpServices.sendBySms(otp, phone);
      return res.json({
        hash: `${hash}.${expires}`,
        phone,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "message sending failed!" });
      return;
    }
  }

  // =========== Method to verify OTP =========
  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;
    if (!otp || !hash || !phone) {
      res.status(404).json({ message: "All Fields are required!" });
      return;
    }

    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      res.status(400).json({ message: "OTP expired!" });
      return;
    }

    const data = `${phone}.${otp}.${expires}`;

    const isValid = otpServices.verifyOtp(hashedOtp, data);

    if (!isValid) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }
    // =============================
    let user;
    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "DB error" });
      return;
    }

    //======================= tokens service =====================
    const { accessToken, refreshToken } = tokenServices.generateToken({
      _id: user._id,
      activated: false,
    });

    res.cookie("refreshtoken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
    res
      .status(200)
      .json({ accessToken, message: "OTP verified successfully!" });
  }
}

module.exports = new AuthController();
