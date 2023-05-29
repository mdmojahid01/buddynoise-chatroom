class RoomDto {
  id;
  topic;
  roomType;
  speakers;
  ownerId;
  createAt;

  constructor(room) {
    this.id = room._id;
    this.topic = room.topic;
    this.roomType = room.roomType;
    this.ownerId = room.ownerId;
    this.createAt = room.createAt;
    this.speakers = room.speakers;
  }
}

module.exports = RoomDto;
