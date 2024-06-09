import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
  let { email, username, password } = req.body;
  console.log(email, username, password);
  if (req.user._id !== req.params.id) {
    return next(errorHandler(403, "You can only update your account", res));
  }
  if (password) {
    if (password.length <= 5) {
      return next(
        errorHandler(400, "Password must be at least 6 characters long", res)
      );
    }
    password = bcryptjs.hashSync(password, 10);
  }
  if (username) {
    if (username.length < 7 || username.length > 15) {
      return next(
        errorHandler(
          400,
          "Username must be at least 7 and maximum 15 characters long",
          res
        )
      );
    }
    if (username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces", res));
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username not contain special characters", res)
      );
    }
  }
  try {
    // if (email) {
    //   const findemail = await User.findOne({ email });
    //   if (findemail) {
    //     return next(errorHandler(400, "Email already exists", res));
    //   }
    // }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username,
          email,
          password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    }
  } catch (error) {
    next(error);
  }
};
