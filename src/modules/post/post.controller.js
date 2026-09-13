const { fn, col } = require("sequelize");
const { Post, User, Comment } = require("../../database/models");
const catchError = require("../../middleware/catchError");

// 1) POST /posts -> create a new post using a new instance and save()
const addPost = catchError(async (req, res) => {
  const { title, content, userId } = req.body;

  const post = new Post({ title, content, userId });
  await post.save();

  res.status(201).json({ message: "Post created successfully." });
});

// 2) DELETE /posts/:postId -> only the owner of the post can delete it (soft delete)
const deletePost = catchError(async (req, res) => {
  const { postId } = req.params;
  const userId = req.body.userId ?? req.query.userId;

  const post = await Post.findByPk(postId);
  if (!post) return res.status(404).json({ message: "Post not found." });

  if (post.userId != userId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this post." });
  }

  await post.destroy(); // paranoid -> fills deletedAt instead of deleting the row

  res.status(200).json({ message: "Post deleted." });
});

// 3) GET /posts/details -> all posts with their user and their comments
const getPostsDetails = catchError(async (req, res) => {
  const posts = await Post.findAll({
    attributes: ["id", "title"],
    include: [
      { model: User, as: "user", attributes: ["id", "name"] },
      { model: Comment, as: "comments", attributes: ["id", "content"] },
    ],
  });

  res.status(200).json(posts);
});

// 4) GET /posts/comment-count -> all posts with the number of their comments
const getPostsCommentCount = catchError(async (req, res) => {
  const posts = await Post.findAll({
    attributes: ["id", "title", [fn("COUNT", col("comments.id")), "commentCount"]],
    include: [{ model: Comment, as: "comments", attributes: [] }],
    group: ["post.id", "post.title"],
    raw: true,
  });

  res.status(200).json(
    posts.map((post) => ({ ...post, commentCount: Number(post.commentCount) }))
  );
});

module.exports = { addPost, deletePost, getPostsDetails, getPostsCommentCount };
