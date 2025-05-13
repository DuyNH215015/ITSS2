module.exports = (sequelize, DataTypes) => {
  const VideoSession = sequelize.define("VideoSession", {
    videosession_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    start_at: { type: DataTypes.DATE },
    end_at: { type: DataTypes.DATE },
  });

  VideoSession.associate = (models) => {
    VideoSession.belongsTo(models.User, { foreignKey: "user1_id", as: "Caller" });
    VideoSession.belongsTo(models.User, { foreignKey: "user2_id", as: "Callee" });
  };

  return VideoSession;
};
