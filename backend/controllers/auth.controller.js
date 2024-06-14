import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    next(errorHandler(400, "All fields are required", res));
  }

  const user = await User.findOne({ email });

  if (user) {
    return next(errorHandler(400, "User already exists", res));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username: username.toLowerCase(),
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(200).json({ message: "Signup successful", sucess: true });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required", res));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found", res));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password", res));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
        isSuperAdmin: validUser.isSuperAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Adding an expiration time for security
    );

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure flag for production
        sameSite: "strict", // Prevent CSRF attacks
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      })
      .json({ user: validUser, success: true, message: "SignIn Successfull" });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, photoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
        },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: photoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        {
          id: newUser._id,
          isAdmin: newUser.isAdmin,
          isSuperAdmin: newUser.isSuperAdmin,
        },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
