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

## Шаг 3: Развертывание Firestore Rules

```bash
firebase deploy --only firestore:rules
```

## Шаг 4: Развертывание статического контента (Hosting)

```bash
firebase deploy --only hosting
```

## Полное развертывание (Firestore + Hosting)

```bash
firebase deploy --only firestore:rules,hosting
```

---

## Архитектура развертывания

- **Firestore** - облачная база данных (Firebase)
- **Firestore Rules** - правила доступа (Firebase)
- **Hosting** - статический фронтенд (Firebase)

## Локальная разработка

### Запустить эмулятор Firestore:

```bash
firebase emulators:start --only firestore
```

---

## Безопасность

### Админ-панель

Админ-панель защищена простым секретным ключом через URL параметр.

**Использование:** 
```
https://stud-code.ru?admin=kigm23
```

**Изменить ключ:**

1. Откройте `index.html`
2. Найдите строку:
   ```javascript
   const ADMIN_SECRET_KEY = 'kigm23';  // Измените на свой секретный ключ!
   ```
3. Замените `admin123` на свой ключ
4. Разверните: `firebase deploy --only hosting`

**Важно:** Используйте сложный ключ (не просто `admin` или `123`)!

### Firestore Rules:

- Чтение: все авторизованные пользователи
- Создание: все авторизованные пользователи
- Удаление: только администраторы (требуется ключ админ-панели)

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
