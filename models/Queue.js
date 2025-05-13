module.exports = (sequelize, DataTypes) => {
  const Queue = sequelize.define("Queue", {
    queue_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING }, // hoặc ENUM nếu cần
  });

  Queue.associate = (models) => {
    Queue.belongsTo(models.User, { foreignKey: "user_id" });
    Queue.belongsTo(models.Topic, { foreignKey: "topic_id" });
    Queue.belongsTo(models.Language, { foreignKey: "language_id" });
  };

  return Queue;
};
