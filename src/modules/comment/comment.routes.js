const express = require("express");
const {
  addComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentDetails,
} = require("./comment.controller");

const commentRouter = express.Router();

commentRouter.post("/", addComments);
commentRouter.post("/find-or-create", findOrCreateComment);
commentRouter.get("/search", searchComments);
commentRouter.get("/newest/:postId", getNewestComments);
commentRouter.get("/details/:id", getCommentDetails);
commentRouter.patch("/:commentId", updateComment);

module.exports = commentRouter;
