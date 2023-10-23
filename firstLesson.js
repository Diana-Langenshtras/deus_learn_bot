const {menuOptions, helpOptions, startLearn, poll1Options, poll2Options} = require('./options')

function firstLesson(query, bot) {

  const databot = query.data;
  const chatId = query.message.chat.id;
      if(databot === 'firstLearn'){
         botLesson.sendMessage(chatId, 'Сначала посмотри это видео, где Дипеж (мой создатель) подробно объясняет тему: \n\nhttps://youtu.be/Wo2TwPi3cNs \n\nКстати, буду очень рад твоей подписке на этот канал :) Там регулярно выходят не только обучающие видео про DevOps, но и разговорные стримы, где можно мило побеседовать о жизни в уютной компании!', {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{text: 'Видео просмотрено!', callback_data: 'videoReady'}]
            ]
          })
        })
      }
      
      if(databot === 'videoReady'){
         bot.sendMessage(chatId, 'Супер, теперь давай пройдем небольшой опрос, чтобы закрепить полученные знания.', {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{text: 'Давай!', callback_data: 'pollStart'}]
            ]
          })
        })
      }
      if(databot === 'pollStart'){
         bot.sendMessage(chatId, '1. Расположи в правильном порядке жизненный цикл ПО:\n 1. Тестирование\n2. Проектирование\n3. Анализ требований\n4. Техническая поддержка\n5. Разработка', poll1Options);
        
      }
}
module.exports = firstLesson;