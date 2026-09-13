const { User } = require("../../database/models");
const catchError = require("../../middleware/catchError");

// 1) POST /users/signup  -> create a new user using build() and save()
const signUp = catchError(async (req, res) => {
  const { name, email, password, role } = req.body;

  // make sure the email does not exist before
  const userExist = await User.findOne({ where: { email } });
  if (userExist) {
    return res.status(409).json({ message: "Email already exists." });
  }

  const user = User.build({ name, email, password, role });
  await user.save(); // runs the validations + the beforeCreate hook

  res.status(201).json({ message: "User added successfully." });
});

// 2) PUT /users/:id -> create or update based on the PK, skipping the validation
const createOrUpdateUser = catchError(async (req, res) => {
  const { id } = req.params;

  await User.upsert({ ...req.body, id }, { validate: false });

  res.status(200).json({ message: "User created or updated successfully" });
});

// 3) GET /users/by-email?email=user1@gmail.com -> find a user by his email
const getUserByEmail = catchError(async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({
    where: { email },
    attributes: { exclude: ["password"] },
  });

  if (!user) return res.status(404).json({ message: "no user found" });

  res.status(200).json({ user });
});

// 4) GET /user/:id -> get a user by his PK without the "role" field
const getUserById = catchError(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: { exclude: ["role", "password"] },
  });

  if (!user) return res.status(404).json({ message: "no user found" });

  res.status(200).json(user);
});

module.exports = { signUp, createOrUpdateUser, getUserByEmail, getUserById };
