const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Токен вашего бота
const TELEGRAM_TOKEN = 'ВАШ_ТОКЕН_БОТА';
const DEEPSEEK_API_KEY = 'ВАШ_API_КЛЮЧ_DEEPSEEK'; // Замените на ваш API-ключ DeepSeek

// Создание экземпляра бота
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Функция для взаимодействия с API DeepSeek
async function callDeepSeekApi(query) {
    const url = "https://api.deepseek.com/v1/chat/completions"; // Пример URL API DeepSeek
    const headers = {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
    };
    const data = {
        model: "deepseek-chat", // Укажите модель, если требуется
        messages: [{ role: "user", content: query }]
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.choices[0].message.content; // Возвращаем ответ от API
    } catch (error) {
        console.error("Ошибка при обращении к API DeepSeek:", error.response ? error.response.data : error.message);
        return null;
    }
}

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Привет! Я бот, который взаимодействует с DeepSeek API. Используй /help для списка команд.");
});

// Команда /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Доступные команды:\n/ask <текст> - задать вопрос DeepSeek");
});

// Команда /ask
bot.onText(/\/ask (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userQuery = match[1]; // Получаем текст запроса

    // Вызов API DeepSeek
    const apiResponse = await callDeepSeekApi(userQuery);
    if (apiResponse) {
        bot.sendMessage(chatId, `Ответ DeepSeek: ${apiResponse}`);
    } else {
        bot.sendMessage(chatId, "Ошибка при обращении к API DeepSeek.");
    }
});

// Обработка ошибок
bot.on("polling_error", (error) => {
    console.error("Ошибка polling:", error);
});