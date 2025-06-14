module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false },
  });

  User.associate = (models) => {
    User.hasMany(models.Queue, { foreignKey: "user_id" });
    User.hasMany(models.VideoSession, { foreignKey: "user1_id", as: "Caller" });
    User.hasMany(models.VideoSession, { foreignKey: "user2_id", as: "Callee" });
  };

  return User;
};
