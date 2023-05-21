// const Buffer = require("buffer");
const Jimp = require("jimp");
const path = require("path");
const userService = require("../services/user-service");
const UserDto = require("../dtos/user-dto");

// ========================================================================
class ActivateController {
  async activateUser(req, res) {
    const { avatar, name } = req.body;
    // res.user getting from auth-middleware.js file by using jwt
    const userId = req.user._id;

    if (!name || !avatar) {
      res.status(400).json({ message: "All fields are required!" });
      return;
    }
    // creating buffer of base64 image that get from user
    const buffer = Buffer.from(
      avatar.replace(/^data:image\/(jpeg|png|jpg);base64,/, ""),
      "base64"
    );

    // creating a unique value or name to set name of the image to store in backend...
    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

    try {
      // Reducing size of image by using jimp package or library
      const jimResp = await Jimp.read(buffer);
      await jimResp
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagePath}`));
    } catch (err) {
      res.status(500).json({ message: "Could not process the image" });
    }

    // update user activation in database
    try {
      const user = await userService.findUser({ _id: userId });
      if (!user) {
        res.status(404).json({ message: "user not found" });
      }

      user.activated = true;
      user.name = name;
      // avatar full path means baseUrl and folder name with file name setting in UserDto file.
      user.avatar = `/storage/${imagePath}`;
      user.save();
      res.json({ user: new UserDto(user) });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
}
module.exports = new ActivateController();
