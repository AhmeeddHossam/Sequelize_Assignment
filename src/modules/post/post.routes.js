const express = require("express");
const {
  addPost,
  deletePost,
  getPostsDetails,
  getPostsCommentCount,
} = require("./post.controller");

const postRouter = express.Router();

postRouter.post("/", addPost);
postRouter.get("/details", getPostsDetails);
postRouter.get("/comment-count", getPostsCommentCount);
postRouter.delete("/:postId", deletePost);

module.exports = postRouter;
