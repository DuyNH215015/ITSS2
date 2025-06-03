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
  let { user_id, language, topic, level } = req.body;

  try {
    // Convert comma-separated strings to arrays
    const languageArr = language ? language.split(",") : [];
    const topicArr = topic ? topic.split(",") : [];

    // Find another waiting user with at least one common language and topic
    const existingQueue = await db.Queue.findOne({
      where: {
        user_id: { [Op.ne]: user_id },
        level,
        status: "waiting",
      }
    });

    let matchedQueue = null;

    if (existingQueue) {
      // Check for at least one common language and topic
      const existingLanguages = existingQueue.language ? existingQueue.language.split(",") : [];
      const existingTopics = existingQueue.topic ? existingQueue.topic.split(",") : [];

      const hasCommonLanguage = languageArr.some(l => existingLanguages.includes(l));
      const hasCommonTopic = topicArr.some(t => existingTopics.includes(t));

      if (hasCommonLanguage && hasCommonTopic) {
        matchedQueue = existingQueue;
      }
    }

    if (matchedQueue) {
      // Find the corresponding session
      const session = await db.VideoSession.findOne({
        where: {
          user1_id: matchedQueue.user_id,
          user2_id: null,
        },
      });

      if (!session) {
        return res.status(400).json({ error: "Không tìm thấy phòng hợp lệ cho hàng đợi." });
      }

      // Join the new user to the session
      const result = await videoCallService.joinRoom(session.videosession_id, user_id);

      // Remove the old queue entry
      await db.Queue.destroy({ where: { queue_id: matchedQueue.queue_id } });

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
