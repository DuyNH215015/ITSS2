module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define("Topic", {
    topic_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    topic_name: { type: DataTypes.STRING, allowNull: false },
  });

  Topic.associate = (models) => {
    Topic.belongsToMany(models.User, { through: models.UserTopic, foreignKey: "topic_id" });
    Topic.hasMany(models.Queue, { foreignKey: "topic_id" });
  };

  return Topic;
};
