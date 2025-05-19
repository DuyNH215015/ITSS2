const { VideoSession, User } = require('../../../models');

const createRoom = async (user_id) => {
  // Kiểm tra user tồn tại
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error("User does not exist.");
  }

  // Tạo videosession mới
  const session = await VideoSession.create({
    user1_id: user_id,
    user2_id: null,
    start_at: new Date(),
  });

  return {
    videosession_id: session.videosession_id,
    message: "Room created successfully.",
  };
};

const joinRoom = async (videosession_id, user_id) => {
  // Kiểm tra session còn trống user2_id
  const session = await VideoSession.findOne({
    where: {
      videosession_id,
      user2_id: null,
    },
  });

  if (!session) {
    throw new Error("Room is full or does not exist.");
  }

  // Kiểm tra user tồn tại
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error("User does not exist.");
  }

  // Gán user2_id vào session
  session.user2_id = user_id;
  await session.save();

  return {
    message: "You joined the room.",
    videosession_id,
  };
};

const handleJoinRoom = (socket, roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", socket.id);
};

const handleOffer = (socket, data) => {
    socket.to(data.room).emit("offer", data);
};

const handleAnswer = (socket, data) => {
    socket.to(data.room).emit("answer", data);
};

const handleIceCandidate = (socket, data) => {
    socket.to(data.room).emit("ice-candidate", data);
};

module.exports = {
    createRoom,
    joinRoom,
    handleJoinRoom,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
};
