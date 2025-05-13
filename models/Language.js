module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define("Language", {
    language_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    language_name: { type: DataTypes.STRING, allowNull: false },
  });

  Language.associate = (models) => {
    Language.belongsToMany(models.User, { through: models.UserLanguage, foreignKey: "language_id" });
    Language.hasMany(models.Queue, { foreignKey: "language_id" });
  };

  return Language;
};
