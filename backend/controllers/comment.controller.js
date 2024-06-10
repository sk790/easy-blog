import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;
    if (userId !== req.user.id) {
      return next(new errorHandler(400, "You are not authorized", res));
    }
    const newComment = new Comment({
      content,
      userId,
      postId,
    });
    await newComment.save();
    res.status(200).json({
        success:true,
        message:"The comment has been created.",
        newComment
    })
  } catch (error) {
    next(error)
  }
};
