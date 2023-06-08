const hashServices = require("../services/hash-service");
const otpServices = require("../services/otp-service");
const userService = require("../services/user-service");
const tokenServices = require("../services/token-service");
const UserDto = require("../dtos/user-dto");
const tokenService = require("../services/token-service");

class AuthController {
  // ============== Method to send OTP ============
  async sendOtp(req, res) {
    const { phone, email } = req.body;
    // console.log(email, phone);
    if (!email && !phone) {
      res.status(404).json({
        message: "Input feild is required!",
      });
      return;
    }

    const otp = await otpServices.generateOtp();
    // ====== Below variable is used 2 min for expiry time limit to verify otp =====
    // const ttl = 1000 * 60 *5; // 5 min expiration of OTP in production
    const ttl = 1000 * 60 * 5;
    const expires = Date.now() + ttl;

    if (phone) {
      const data = `${phone}.${otp}.${expires}`;
      // ===== Hashing the data by using crypto module to verify otp on server ======
      const hash = hashServices.hashOtp(data);
      try {
        // await otpServices.sendBySms(otp, phone);
        return res.json({
          hash: `${hash}.${expires}`,
          phone,
          email: null,
          otp,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "message sending failed!" });
        return;
      }
    }
    if (email) {
      const data = `${email}.${otp}.${expires}`;
      // ===== Hashing the data by using crypto module to verify otp on server ======
      const hash = hashServices.hashOtp(data);
      try {
        await otpServices.sendByEmail(otp, email);
        return res.json({
          hash: `${hash}.${expires}`,
          email,
          phone: null,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "message sending failed!" });
        return;
      }
    }
  }

  // =========== Method to verify OTP =========
  async verifyOtp(req, res) {
    const { otp, hash, phone, email } = req.body;
    if (!otp || !hash || (!phone && !email)) {
      res.status(404).json({ message: "All Fields are required!" });
      return;
    }

    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      res.status(400).json({ message: "OTP expired!" });
      return;
    }

    let user;

    if (phone) {
      const data = `${phone}.${otp}.${expires}`;
      const isValid = otpServices.verifyOtp(hashedOtp, data);
      if (!isValid) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
      }

      try {
        user = await userService.findUser({ phone });
        if (!user) {
          user = await userService.createUser({ phone, email: "NA" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "DB error" });
        return;
      }
    }
    if (email) {
      const data = `${email}.${otp}.${expires}`;
      const isValid = otpServices.verifyOtp(hashedOtp, data);
      if (!isValid) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
      }
      try {
        user = await userService.findUser({ email });
        if (!user) {
          user = await userService.createUser({ email, phone: "NA" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "DB error" });
        return;
      }
    }

    //======================= tokens service =====================
    const { accessToken, refreshToken } = tokenServices.generateToken({
      _id: user._id,
      activated: false,
    });
    // converting userdata to data transfer object(dto)
    const userdto = new UserDto(user);

    // ==== Store token in db
    await tokenServices.storeRefreshToken(refreshToken, user._id);
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      user: userdto,
      auth: true,
      message: "OTP verified successfully!",
    });
  }
  // ==================== Rfresh Token =================================
  async refresh(req, res) {
    // get refresh token from cookies
    const { refreshToken: refreshTokenFromCookie } = req.cookies;

    // check if token is valid
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);

      if (!userData) {
        throw new Error();
      }
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    // check if token is in db
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
      );

      if (!token) {
        return res.status(401).json({ message: "Invalid Token" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }
    // check if valid user from refresh token
    const user = await userService.findUser({ _id: userData._id });
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    // generate new tokens
    const { refreshToken, accessToken } = tokenService.generateToken({
      _id: userData._id,
    });

    // update refresh token
    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (err) {
      res.status(500).json({ message: "Internal error" });
    }

    // put in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    // response
    const userdto = new UserDto(user);
    res.status(200).json({
      user: userdto,
      auth: true,
    });
  }
  // ================ Logout ======================
  async logout(req, res) {
    const { refreshToken } = req.cookies;

    // delete refresh token from db
    tokenService.removeToken(refreshToken);

    // delete cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({ user: null, auth: false });
  }
}

module.exports = new AuthController();
