const userRouter = require("./modules/user/user.routes");
const postRouter = require("./modules/post/post.routes");
const commentRouter = require("./modules/comment/comment.routes");
const globalErrorHandler = require("./middleware/globalErrorHandler");

const bootstrap = (app) => {
  app.use("/users", userRouter);
  app.use("/user", userRouter); // the pdf uses /user/:id for "get user by pk"
  app.use("/posts", postRouter);
  app.use("/comments", commentRouter);

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found : ${req.originalUrl}` });
  });

  app.use(globalErrorHandler);
};

module.exports = bootstrap;
