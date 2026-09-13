const { Op } = require("sequelize");
const { Comment, User, Post } = require("../../database/models");
const catchError = require("../../middleware/catchError");

// 1) POST /comments -> create a bulk of comments
const addComments = catchError(async (req, res) => {
  const { comments } = req.body;

  if (!Array.isArray(comments) || comments.length === 0) {
    return res
      .status(400)
      .json({ message: "comments must be a non empty array." });
  }

  await Comment.bulkCreate(comments, { validate: true });

  res.status(201).json({ message: "comments created." });
});

// 2) PATCH /comments/:commentId -> only the owner can update his comment
const updateComment = catchError(async (req, res) => {
  const { commentId } = req.params;
  const { userId, content } = req.body;

  const comment = await Comment.findByPk(commentId);
  if (!comment) return res.status(404).json({ message: "comment not found." });

  if (comment.userId != userId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this comment." });
  }

  comment.content = content;
  await comment.save();

  res.status(200).json({ message: "Comment updated." });
});

// 3) POST /comments/find-or-create -> return the comment if it exists, else create it
const findOrCreateComment = catchError(async (req, res) => {
  const { postId, userId, content } = req.body;

  const [comment, created] = await Comment.findOrCreate({
    where: { postId, userId, content },
    defaults: { postId, userId, content },
  });

  res.status(created ? 201 : 200).json({ comment, created });
});

// 4) GET /comments/search?word=the -> all comments containing a word + their count
const searchComments = catchError(async (req, res) => {
  const { word } = req.query;

  const { count, rows } = await Comment.findAndCountAll({
    where: { content: { [Op.like]: `%${word}%` } },
  });

  if (count === 0) {
    return res.status(404).json({ message: "no comments found." });
  }

  res.status(200).json({ count, comments: rows });
});

// 5) GET /comments/newest/:postId -> the 3 most recent comments of a post
const getNewestComments = catchError(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.findAll({
    where: { postId },
    attributes: ["id", "content", "createdAt"],
    order: [["createdAt", "DESC"]],
    limit: 3,
  });

  res.status(200).json(comments);
});

// 6) GET /comments/details/:id -> a comment by its PK with its user and its post
const getCommentDetails = catchError(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findByPk(id, {
    attributes: ["id", "content"],
    include: [
      { model: User, as: "user", attributes: ["id", "name", "email"] },
      { model: Post, as: "post", attributes: ["id", "title", "content"] },
    ],
  });

  if (!comment) return res.status(404).json({ message: "no comment found" });

  res.status(200).json(comment);
});

module.exports = {
  addComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentDetails,
};
