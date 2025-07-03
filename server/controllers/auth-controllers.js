import {User} from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateJWTtoken } from "../utils/generatejwt.js";
import {sendEmail} from "../utils/sendemail.js";

export const register = async (req, res) => {
  try {
    const { name,userID, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const usedid = await User.findOne({ userID });
    if (usedid) return res.status(400).json({ message: "UserID already used" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationtoken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationtokenexpiresat = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newUser = new User({ name, email,userID, password: hashedPassword, isverified: false,verificationtoken,verificationtokenexpiresat });
    await newUser.save();
    
    // Email verification token
    const emailToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
    const verifyURL = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;
    await sendEmail(
        email,
        "Your Email Verification Code",
        `Your verification code is: ${verificationtoken}. It will expire in 24 hours.`
        );

    res.status(201).json({ message: "User created. Please verify your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err)
  }
};

export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if already verified
    if (user.isverified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    // Generate new verification code
    const verificationtoken = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationtoken = verificationtoken;
    user.verificationtokenexpiresat = new Date(Date.now() + 24*60 * 60 * 1000);
    await user.save();

    // Send email
    await sendEmail(
      email,
      "Your Verification Code",
      `Your new verification code is: ${verificationtoken}`
    );

    res.status(200).json({ message: "Verification code resent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.isverified) return res.status(400).json({ message: "Email already verified" });
  // console.log(new Date() > new Date(user.verificationtokenexpiresat))
  // console.log(code)
  if (
    user.verificationtoken !== code ||
    new Date() > new Date(user.verificationtokenexpiresat)
  ) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  user.isverified = true;
  user.verificationtoken = undefined;
  user.verificationtokenexpiresat = undefined;
  await user.save();

  res.status(200).json({success:true, message: "Email successfully verified" });
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (!user.isverified)
      return res.status(401).json({ error: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const { accesstoken, refreshtoken } = generateJWTtoken(res, user._id);
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({ user: userData, accesstoken, refreshtoken });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accesstoken");
  res.clearCookie("refreshtoken");
  res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendEmail(email, "Reset Password", `Click here to reset your password: ${resetLink}`);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// In auth controller
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshtoken;
    if (!token) return res.status(401).json({ error: "Refresh token missing" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userID).select("-password");

    if (!user) return res.status(401).json({ error: "Invalid refresh token" });

    const { accesstoken } = generateJWTtoken(res, user._id);

    res.status(200).json({ user, accesstoken });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.accesstoken;
    if (!token) return res.status(401).json({ message: "Access token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ user: userData });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired access token" });
  }
};