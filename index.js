const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const text = require('./const')
const webAppUrl = 'https://rainbow-trifle-e6da20.netlify.app'

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

// подключаем модуль для работы с файловой системой
//const fs = require('fs');
    
// имя файла, в который нужно сохранить данные
//const fileName = 'file.txt';

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl }}]
                ]
            }
        })

    }

    
    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            // вызываем метод writeFile для записи данных в файл
           // fs.writeFile(fileName, 'Ваша страна: ' + data?.country, (err) => {
                // если произошла ошибка, выбрасываем исключение
             //   if (err) throw err;
                // выводим сообщение об успешной записи
           //     console.log('Данные сохранены в файл');
          //  });
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
});



