const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../dbConnection");

// ---- Comments model : created with Model.init() ----
class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "posts",
        key: "id",
      },
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
    modelName: "comment",
    tableName: "comments",
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = Comment;
