const videoCallService = require('../services/videoCallService');

const createRoom = async (req, res) => {
  const { user_id } = req.body;
  try {
    const result = await videoCallService.createRoom(user_id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const joinRoom = async (req, res) => {
  const { videosession_id } = req.params;
  const { user_id } = req.body;

  try {
    const result = await videoCallService.joinRoom(videosession_id, user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/** ✅ Chỉ xử lý join socket room, KHÔNG gọi DB nữa */
const handleJoinRoom = (socket, roomId) => {
  try {
    socket.join(roomId);
    console.log(`✅ ${socket.id} joined socket room ${roomId}`);
    socket.to(roomId).emit("user-joined", socket.id);
  } catch (error) {
    console.error("❌ Error while joining socket room:", error);
  }
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
