// modules/match/controllers/matchController.js
const db = require("../../../models");
const { Op } = require("sequelize");
const videoCallService = require("../../videoCall/services/videoCallService");

/**
 * Controller duy nhất để xử lý cả user1 và user2
 * - Nếu có người đợi phù hợp → ghép vào phòng đó
 * - Nếu không có → tạo phòng mới và chờ người khác
 */
const matchOrJoin = async (req, res) => {
  const { user_id, language, topic, level } = req.body;

  try {
    // Tìm người khác đang đợi có cùng tiêu chí
    const existingQueue = await db.Queue.findOne({
      where: {
        user_id: { [Op.ne]: user_id },
        language,
        topic,
        level,
        status: "waiting",
      },
    });

    if (existingQueue) {
      // Tìm session tương ứng với người đang chờ đó
      const session = await db.VideoSession.findOne({
        where: {
          user1_id: existingQueue.user_id,
          user2_id: null,
        },
      });

      if (!session) {
        return res.status(400).json({ error: "Không tìm thấy phòng hợp lệ cho hàng đợi." });
      }

      // Ghép người dùng mới vào phòng đó
      const result = await videoCallService.joinRoom(session.videosession_id, user_id);

      // Xoá hàng đợi của người cũ
      await db.Queue.destroy({ where: { queue_id: existingQueue.queue_id } });

      return res.json({
        matched: true,
        session_id: result.videosession_id,
        message: "Đã ghép vào phòng đang chờ."
      });
    }

    // Không có người nào chờ phù hợp → tạo phòng mới và đợi
    const created = await videoCallService.createRoom(user_id);

    await db.Queue.create({
      user_id,
      language,
      topic,
      level,
      status: "waiting",
    });

    return res.status(201).json({
      matched: false,
      session_id: created.videosession_id,
      message: "Đã tạo phòng mới và chờ người khác."
    });
  } catch (error) {
    console.error("❌ Lỗi matchOrJoin:", error);
    return res.status(500).json({ error: "Lỗi server khi xử lý ghép phòng." });
  }
};

module.exports = { matchOrJoin };
