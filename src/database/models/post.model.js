const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../dbConnection");

// ---- Posts model : created with Model.init() ----
class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "post",
    tableName: "posts",
    timestamps: true, // createdAt & updatedAt
    paranoid: true, // soft delete -> adds deletedAt instead of removing the row
  }
);

module.exports = Post;
