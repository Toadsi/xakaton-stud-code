const functions = require("firebase-functions");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

admin.initializeApp();

/**
 * Функция проверки пароля администратора
 * Принимает пароль, проверяет против переменной окружения
 * Возвращает JWT токен если пароль верный
 */
exports.verifyAdminPassword = functions.https.onCall(async (data, context) => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kigm23";
  const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";

  // Проверка что пароль передан
  if (!data.password) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Пароль не предоставлен"
    );
  }

  // Проверка пароля
  if (data.password !== ADMIN_PASSWORD) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Неверный пароль"
    );
  }

  // Создание JWT токена
  const token = jwt.sign(
    { 
      role: "admin",
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return { 
    success: true, 
    token: token,
    expiresIn: 86400 
  };
});

/**
 * Проверка валидности токена (для использования в других функциях)
 */
exports.verifyToken = functions.https.onCall(async (data, context) => {
  const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";

  if (!data.token) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Токен не предоставлен"
    );
  }

  try {
    const decoded = jwt.verify(data.token, JWT_SECRET);
    return { valid: true, role: decoded.role };
  } catch (error) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Истекший или неверный токен"
    );
  }
});
