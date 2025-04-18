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
  
    // 1) Проверяем подпись и срок жизни refresh‑токена
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET); // throws if expired/invalid
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  
    // 2) Находим пользователя
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) throw new Error("User not found");
  
    // 3) Убеждаемся, что токен из куки совпадает с тем, что хранится в БД
    if (user.refreshToken !== token) {
      throw new Error("Invalid refresh token");          // кука подделана/устарела
    }
  
    // 4) Генерируем НОВЫЙ access‑токен (refresh оставляем прежний)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
    );
  
    // 5) Отдаём данные
    return {
      accessToken,            // новый короткоживущий токен
      refreshToken: token,    // тот же, что был в куке и в БД
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
