module.exports = (sequelize, DataTypes) => {
  const Queue = sequelize.define("Queue", {
    queue_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING }, // hoặc ENUM nếu cần
    language: { type: DataTypes.STRING}, 
    topic: { type: DataTypes.STRING }, 
    level: { type: DataTypes.STRING },
  });

  Queue.associate = (models) => {
    Queue.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Queue;
};
