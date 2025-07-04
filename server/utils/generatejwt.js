import jwt from 'jsonwebtoken';

export const generateTokens = (res, userId) => {
  const accessToken = jwt.sign({ userID: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userID: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("accesstoken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
