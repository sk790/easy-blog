import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
  let { email, username, password } = req.body;
  if (req.user.id !== req.params.userId) {
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
export const deleteUser = async (req, res, next) => {
  if (req.user && !req.user.isSuperAdmin) {
    return next(
      errorHandler(403, "Yor are not authorized to delete any account!", res)
    );
  }
  if (req.user.id === req.params.userId) {
    return next(errorHandler(403, "You can not delete your account!", res));
  }
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) {
    return next(errorHandler(404, "User not found", res));
  }
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    user: null,
  });
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({
      success: true,
      message: "User has been sign Out",
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (req.user && !req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get all users", res));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    // const oneWeekAgo = new Date(
    //   now.getFullYear(),
    //   now.getMonth(),
    //   now.getDate() - 7
    // )

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      success: true,
      messages: "All users fetched successfully",
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers: lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found", res));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
