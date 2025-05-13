module.exports = (sequelize, DataTypes) => {
  const UserTopic = sequelize.define("UserTopic", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    topic_id: { type: DataTypes.INTEGER, primaryKey: true },
  });

  return UserTopic;
};
