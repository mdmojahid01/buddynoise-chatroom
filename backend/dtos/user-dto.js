class UserDto {
  id;
  activated;
  avatar;
  name;
  createdAt;
  phone;

  constructor(user) {
    this.id = user._id;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
    this.phone = user.phone;
    this.avatar = user.avatar ? user.avatar : null;
    this.name = user.name;
  }
}
module.exports = UserDto;
