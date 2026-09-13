const express = require("express");
const {
  signUp,
  createOrUpdateUser,
  getUserByEmail,
  getUserById,
} = require("./user.controller");

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.get("/by-email", getUserByEmail); // must stay before "/:id"
userRouter.put("/:id", createOrUpdateUser);
userRouter.get("/:id", getUserById);

module.exports = userRouter;
