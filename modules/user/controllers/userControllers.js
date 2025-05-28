const { User } = require('../../../models');

const createUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }
    console.log("Creating user with username:", username);
    const user = await User.create({ username });
    return res.status(201).json({ user_id: user.user_id, username: user.username });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser };