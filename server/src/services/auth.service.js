const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { v4, uuidv4 } = require("uuid");
const prisma = require("../../prisma");

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  });

  return { accessToken, refreshToken };
};

const register = async ({ email, userName, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("A user with this email already exists.");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, userName, password: hashed },
  });

  return { id: user.id, email: user.email, userName: user.userName };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Incorrect email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Incorrect email or password");

  const { accessToken, refreshToken } = generateTokens(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
  };
};

const refresh = async (token) => {
  if (!token) throw new Error("Refresh token absense");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    console.log("🔥 JWT VERIFY ERROR:", err.name, err.message, err.expiredAt);
    throw new Error("Invalid refresh token");
  }
  

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) throw new Error("User not found");

  // LOG — для отладки
  console.log("💾 Token from DB:", user.refreshToken);
  console.log("🍪 Token from Cookie:", token);

  // Сравнение токенов
  if (user.refreshToken !== token) {
    console.warn("🚫 Refresh token mismatch");
    throw new Error("Invalid refresh token");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
  };
};

const logout = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await prisma.user.update({
      where: { id: payload.id },
      data: { refreshToken: null },
    });
  } catch {
    console.warn("⚠️ Logout: invalid token, ignoring");
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
