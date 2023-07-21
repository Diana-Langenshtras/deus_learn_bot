const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const text = require('./const')
const {menuOptions, helpOptions, startLearn, poll1Options, poll2Options} = require('./options')
const webAppUrl = 'https://rainbow-trifle-e6da20.netlify.app'

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "martlan30", 
  database: "mydb"
});






/*connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE information (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), surname VARCHAR(255), tgId VARCHAR(255), knowledge_level TINYINT)";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });*/

  /*connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM information", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });*/
  
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

bot.setMyCommands([
  {command: '/start', description: 'Перезапустить бота'},
  {command: '/menu', description: 'Меню бота'},
  {command: '/help', description: 'Помощь'},
])


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Привет! Я учебный бот по DevOps. Вместе мы пройдем с тобой непростой путь по освоению этой сферы, но я уверен, что все получится!\nДавай зарегистрируем тебя в нашей базе - это нужно будет для сбора обратной связи и статистики.', {
            reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: true,
                keyboard: [
                    [{text: 'Регистрация', web_app: {url: webAppUrl }}]
                ]
            }
        })
    }


  /*  if(text === '/start') {
      await bot.sendMessage(chatId, 'Привет! Я учебный бот по DevOps. Вместе мы пройдем с тобой непростой путь по освоению этой сферы, но я уверен, что все получится!\nДавай зарегистрируем тебя в нашей базе - это нужно будет для сбора обратной связи и статистики.')
      await setTimeout(async () => {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                one_time_keyboard: true,
                keyboard: [
                    [{text: 'Регистрация', web_app: {url: webAppUrl }}]
                ]
            }
        })
      }, 3000)
    }*/

   
    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)

            function resolved(result) {
                console.log('Resolved');
              }
              
              function rejected(result) {
                console.error(result);
              }
            if(data){
                // отдельная переменная для читабельность
                const sql = "INSERT INTO information (name, surname, tgId, knowledge_level) VALUES (?,?,?,?)"; 
                const params = [data?.name, data?.surname, msg?.chat?.username, data?.knowledge_level];
                connection.query(sql, params,
                        function(err) {
                            if (err) Promise.reject(new Error('fail')).then(resolved, rejected);
                        });
                 //   connection.end();
                }
                
            await bot.sendMessage(chatId, `Приятно познакомиться с тобой, ${data?.name}! Я рад, что ты пришел учиться DevOps, ведь в современном мире это одна из самых высокооплачиваемых и востребованных специальностей. Она не так проста в освоении, но вместе мы справимся!`,
                {
                  reply_markup: {
                    remove_keyboard:true
                  }
                })
            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате', menuOptions);
            }, 1000)
            } catch (e) {
            console.log(e);
        }
        
    }
    if(text === '/menu') {
      await bot.sendMessage(chatId, 'Меню бота', menuOptions);
    }
    if(text === '/help') {
      await bot.sendMessage(chatId, 'Ответы на самые распространенные вопросы:', helpOptions);
    }
    
    
});

bot.on('callback_query', async  (msg) => {
    const databot = msg.data;
    const chatId = msg.message.chat.id;
    const text = msg.message.text;
    if(databot === 'learn'){
      await bot.sendMessage(chatId, 'Я тоже уже хочу начать обучение! \n\nИтак, наш первый модуль для изучения - Введение в DevOps. \nЗдесь мы разберем темы: \n1.1. Жизненный цикл разработки ПО и методологии работы \n1.2. Что такое DevOps, основные концепции \n1.3. Система контроля версий Git, модели ветвления: gitflow \n1.4. Знакомство с GitLab, понятие Continuous Integration \n1.5. Continuous Delivery и Continuous Deployment \n\nЯ буду тебе давать информацию на изучение, а ты проходи ее в удобном для тебя темпе. После каждой темы мы будем проверять с помощью опроса качество усвоения материала. Это позволит тебе закрепить знания и структурировать информацию в голове :) \n\nГотов заниматься?', startLearn)
    }
    if(databot === 'firstLearn'){
      await bot.sendMessage(chatId, 'Сначала посмотри это видео, где Дипеж (мой создатель) подробно объясняет тему: \n\nhttps://youtu.be/Wo2TwPi3cNs \n\nКстати, буду очень рад твоей подписке на этот канал :) Там регулярно выходят не только обучающие видео про DevOps, но и разговорные стримы, где можно мило побеседовать о жизни в уютной компании!', {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{text: 'Видео просмотрено!', callback_data: 'videoReady'}]
          ]
        })
      })
    }
    if(databot === 'videoReady'){
      await bot.sendMessage(chatId, 'Супер, теперь давай пройдем небольшой опрос, чтобы закрепить полученные знания.', {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{text: 'Давай!', callback_data: 'pollStart'}]
          ]
        })
      })
    }
    if(databot === 'pollStart'){
      await bot.sendMessage(chatId, '1. Расположи в правильном порядке жизненный цикл ПО:\n 1. Тестирование\n2. Проектирование\n3. Анализ требований\n4. Техническая поддержка\n5. Разработка', poll1Options);
      
    }

    switch(databot) {
      case 'help1':  

      await bot.sendMessage(chatId, '@Ann_Ve тебе обязательно поможет со всеми трудностями :)');  
      break;
    
      case 'help2':  
      
      await bot.sendMessage(chatId, 'Опрос пропустить нельзя, так как бот выедает учебные материалы убедившись, что ты все усвоил из предыдущего урока. Если у тебя есть трудности с ответами, то напиши @Ann_Ve о своей проблеме.');   
      break;

      case 'help3':  
      
      await bot.sendMessage(chatId, 'Вы точно получите хорошую базу для дальнейшего изучения сферы DevOps. А если еще дополнительно тренироваться, например с нашим проектом «DevOps-задачник», где будут 2 раза в месяц присылаться реальные рабочие DevOps задачи, то оффер не за горами ;)');  
      break;

      case 'help4':  
      
      await bot.sendMessage(chatId, 'Автором курса является Константин Брюханов - эксперт в области DevOps и преподаватель этой дисциплины в Университете ИТМО.');   
      break;

      case 'help5':  
      
      await bot.sendMessage(chatId, 'Всё ваши мысли, отзывы мы будем рады увидеть по этой форме: ');    
      break;
    
      default:
        break;
    }
})
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
    if (text === '5-1-3-2-4' || text === '2-3-5-1-4' || text === '1-2-4-3-5')
    {
      await bot.sendMessage(chatId, 'Попробуй еще раз.');
    }
    else
    if (text === '3-2-5-1-4')
    {
      await bot.sendMessage(chatId, 'Выбери верное утверждение:', poll2Options);
    }
    if (text === 'Методика Scrum может быть внедрена на этапе разработки при модели Waterfall')
    {
      await bot.sendMessage(chatId, 'Следующий вопрос:');
    }
    else
    if (text === 'С помощью Scrum легко планировать крупные проекты' || text === 'Scrum должен сопровождаться подробной документацией, чтобы вносить меньше исправлений' || text === 'При модели Waterfall можно постоянно возвращаться назад, так как эта модель делает упор на качество')
    {
      await bot.sendMessage(chatId, 'Попробуй еще раз.');
    }
})



