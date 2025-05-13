module.exports = (sequelize, DataTypes) => {
  const UserLanguage = sequelize.define("UserLanguage", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    language_id: { type: DataTypes.INTEGER, primaryKey: true },
    level: { type: DataTypes.STRING }, // hoặc ENUM
  });

  return UserLanguage;
};
