const { DataTypes, ValidationError, ValidationErrorItem } = require("sequelize");
const { sequelize } = require("../dbConnection");

// ---- Users model : created with sequelize.define() ----
const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        // built-in validation for the email format
        isEmail: {
          msg: "Email format is not valid",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // database level default, needed by "create or update" (PUT /users/:id)
      // because that request skips the validation and may not send a password
      defaultValue: "",
      validate: {
        // custom validation method : password length must be greater than 6
        checkPasswordLength(value) {
          if (!value || value.length <= 6) {
            throw new Error("Password length must be greater than 6 characters");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    tableName: "users",
    timestamps: true, // createdAt & updatedAt
  }
);

// custom validation method used inside the beforeCreate hook
User.prototype.checkNameLength = function () {
  if (!this.name || this.name.length <= 2) {
    const message = "Name length must be greater than 2 characters";
    // thrown as a sequelize validation error so it is handled
    // exactly like the other validation errors
    throw new ValidationError(message, [
      new ValidationErrorItem(message, "Validation error", "name", this.name),
    ]);
  }
};

// ---- beforeCreate hook that calls the custom validation method ----
User.beforeCreate((user) => {
  user.checkNameLength();
});

module.exports = User;
