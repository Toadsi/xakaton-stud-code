# Развертывание Studcode 2026

## Предварительные требования

1. **Node.js** 18+ установлен
2. **Firebase CLI** установлен:
   ```bash
   npm install -g firebase-tools
   ```
3. **Firebase Project** создан на https://console.firebase.google.com

## Шаг 1: Аутентификация

```bash
firebase login
firebase use --add  # Выберите ваш Firebase проект
```

## Шаг 2: Установка зависимостей

```bash
cd functions
npm install
cd ..
```

## Шаг 3: Настройка переменных окружения

1. Скопируйте `.env.local.example` в `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Обновите значения в `.env.local`:
   - `ADMIN_PASSWORD` - ваш пароль администратора
   - `JWT_SECRET` - сложный секретный ключ для подписи JWT
   - Firebase конфиг (из Firebase Console)

3. Установите переменные окружения в Firebase:
   
   **Важно:** `functions:config:set` является устаревшей командой (будет удалена в марте 2027). Для временного использования включите легаси-команды:
   ```bash
   firebase experiments:enable legacyRuntimeConfigCommands
   firebase functions:config:set admin.password="your_password" admin.jwt_secret="your_secret"
   ```

## Шаг 4: Развертывание Cloud Functions

```bash
firebase deploy --only functions
```

## Шаг 5: Развертывание Firestore Rules

```bash
firebase deploy --only firestore:rules
```

## Шаг 6: Развертывание статического контента (Hosting)

```bash
firebase deploy --only hosting
```

## Полное развертывание

```bash
firebase deploy
```

---

## Локальная разработка

### Запустить эмулятор Functions:

```bash
firebase emulators:start --only functions
```

### Использовать функции локально:

В браузере откройте DevTools и выполните:

```javascript
// Установка URL эмулятора
const functions = getFunctions();
connectFunctionsEmulator(functions, 'localhost', 5001);
```

---

## Безопасность

### Что скрыто от исходника:

- ✅ Пароль администратора (`ADMIN_PASSWORD`)
- ✅ JWT секрет (`JWT_SECRET`)
- ✅ Firebase конфиги (в переменных окружения)

### Как пароль проверяется:

1. Клиент отправляет пароль в Cloud Function (HTTPS)
2. Function проверяет против `process.env.ADMIN_PASSWORD`
3. Если верно — возвращает JWT токен
4. Токен сохраняется в `sessionStorage` (доступен только текущей сессии)
5. Токен используется для доступа к админ-панели

### Firestore Rules:

- Чтение: все авторизованные пользователи
- Создание: все авторизованные пользователи
- Удаление: только администраторы (требуется токен)

---

## Мониторинг

Посмотреть логи функций:

```bash
firebase functions:log
```

Посмотреть все развертывания:

```bash
firebase deploy:list
```

---

## Сброс (для разработки)

```bash
firebase emulators:start --only firestore,functions
```

Откройте http://localhost:4000 для Firestore эмулятора UI.

---

## Поддержка

При ошибках:

1. Проверьте логи: `firebase functions:log`
2. Проверьте Firestore Rules в Firebase Console
3. Проверьте переменные окружения: `firebase functions:config:get`
