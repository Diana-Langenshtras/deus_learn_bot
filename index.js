const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const text = require('./const')
const {menuOptions, helpOptions, poll1Options, poll2Options} = require('./options')
const webAppUrl = 'https://rainbow-trifle-e6da20.netlify.app'

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "mydb"
});

  connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM users_info", function (err, result, fields) {
     // if (err) throw err;
      console.log(result);
    });
  });

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});


bot.setMyCommands([
  {command: '/start', description: 'Перезапустить бота'},
  {command: '/learn', description: 'Начать обучение'},
  {command: '/help', description: 'Помощь'},
  {command: '/library', description: 'Библиотека'},
])

//Начало работы с ботом

bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      await bot.sendMessage(chatId, 'Привет! Я учебный бот по DevOps. Вместе мы пройдем с тобой непростой путь по освоению этой сферы.\nДля начала давай зарегистрируемся - это нужно для сбора обратной связи и статистики.', {
        reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
                [{text: 'Регистрация', web_app: {url: webAppUrl }}]
            ],
            remove_keyboard:true
        }
    })
  }
)

//Пункт "Помощь"
  
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  // await bot.sendMessage(chatId, 'Ответы на самые распространенные вопросы:', helpOptions);
  await bot.sendMessage(chatId, '<b>1. К кому можно обратиться в случае вопросов?</b>\n\n@Ann_Ve тебе обязательно поможет со всеми трудностями :)\n\n\n<b>2. Можно ли как-то пропустить опрос по изученным материалам?</b>\n\nОпрос пропустить нельзя, так как бот выедает учебные материалы убедившись, что ты все усвоил из предыдущего урока. Если у тебя есть трудности с ответами, то напиши @Ann_Ve о своей проблеме.\n\n\n<b>3. Смогу ли я устроиться на работу, если пройду этого бота?</b>\n\nВы точно получите хорошую базу для дальнейшего изучения сферы DevOps. А если еще дополнительно тренироваться, например с нашим проектом <a href=\"https://deusops.com/classbook\">«DevOps-задачник»</a>, где будут 2 раза в месяц присылаться реальные рабочие DevOps задачи, то оффер не за горами ;)\n\n\n<b>4. Кто автор всех учебных материалов?</b>\n\nАвтором курса является Константин Брюханов - эксперт в области DevOps и преподаватель этой дисциплины в Университете ИТМО. \n\n\n<b>5. Как можно оставить обратную связь?</b>\n\nВсё ваши мысли, отзывы мы будем рады увидеть по этой <a href=\"https://docs.google.com/forms/d/e/1FAIpQLScyERgR_ivF8_VwsvbTqjt9PWynDNEzX0Sm-njMWSKQr4mGXw/viewform\">форме</a>',{ parse_mode: "HTML", disable_web_page_preview: true } );
  
  });

//Пункт "Обучение"

bot.onText(/\/learn/, async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    bot.sendMessage(chatId, 'Начни обучение', {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{text: 'Хочу учиться', callback_data: 'learn'}]
        ]
      })
    })
    
    });

//Пункт "Библиотека"

  bot.onText(/\/library/, async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    await bot.sendMessage(chatId, 'Приветствую тебя! Здесь будут лежать все учебные материалы, которые я тебе прислал, чтобы они не терялись в нашей переписке :)');
    
    const sql1 = `SELECT lessons FROM users_info WHERE tgId=? and lessons IS NOT NULL`;
              const filter = [msg?.chat?.username];
              connection.query(sql1, filter, function(err, results) {
             
                
                if (results.length>0){
                  
                  for (let i = 0; i < JSON.stringify(results).length-16; i++) { 
                
                   //     console.log(i)
                 //   console.log(JSON.stringify(results).length)
                    const sql = `SELECT lessons FROM Lessons WHERE id=?`; 
                    const params = [i+1];
                    connection.query(sql, params,
                          function(err, lessons) {
                            
                         //   console.log(JSON.stringify(lessons))
                          //  console.log(JSON.stringify(lessons).length)
                             bot.sendMessage(chatId, `${i+1}`+ '. ' + `${(JSON.stringify(lessons)).substring(13, JSON.stringify(lessons).length-3)}`);
                          });
                   //   connection.end();
                  }

 
                  
                  }
                  else{
                    bot.sendMessage(chatId, 'У тебя пока нет никаких учебных материалов :( Начни обучение и сам не заметишь, как наберешь целую груду ссылок с полезной информацией! Чтобы начать обучение, нажми "Хочу учиться".');
                  }
              });
  
  
  });


//Регистрация в базе данных и проверка, есть ли такой пользователь

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
   // bot.sendMessage(msg.chat.id,"\n <a href=\"http://www.example.com/\">inline URL</a> \n" ,{parse_mode : "HTML"});

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
              const sql1 = `SELECT * FROM users_info WHERE tgId=?`;
              const filter = [`${msg?.chat?.username}`];
              connection.query(sql1, filter, function(err, results) {
             
              //  console.log(results.length)
                if (results.length<1){
               //   console.log("1")
                  // отдельная переменная для читабельность
                  const sql = "INSERT INTO users_info (name, surname, tgId, knowledge_level) VALUES (?,?,?,?)"; 
                  const params = [data?.name, data?.surname, msg?.chat?.username, data?.knowledge_level];
                  connection.query(sql, params,
                          function(err) {
                              if (err) Promise.reject(new Error('fail')).then(resolved, rejected);
                          });
                   //   connection.end();
                  }
                  else{
                    console.log("такой пользователь уже есть")
                  }
              });
              
              }
                
            await bot.sendMessage(chatId, `Приятно познакомиться с тобой, ${data?.name}! Я рад, что ты пришел учиться одной из самых высокооплачиваемых и востребованных специальностей.`,
                {
                  reply_markup: {
                    remove_keyboard:true
                  },
                  
                })
            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Начни обучение или перейди в меню', {
                  reply_markup: JSON.stringify({
                    inline_keyboard: [
                      [{text: 'Хочу учиться', callback_data: 'learn'}]
                    ]
                  })
                })
            }, 1000)
            } catch (e) {
            console.log(e);
        }
        
    }
    
});

//bot.removeListener("callback_query");
//bot.addListener("callback_query");

//Первый урок

function firstLesson(query, msg) {

  const databot = query.data;
  const chatId = query.message.chat.id;


      if(databot === 'firstLearn'){
         bot.sendMessage(chatId, 'Сначала посмотри это видео, где Дипеж (мой создатель) подробно объясняет тему: \n\nhttps://youtu.be/Wo2TwPi3cNs \n\nКстати, буду очень рад твоей подписке на этот канал :) Там регулярно выходят не только обучающие видео про DevOps, но и разговорные стримы, где можно мило побеседовать о жизни в уютной компании!', {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{text: 'Видео просмотрено!', callback_data: 'videoReady'}]
            ]
          })
        })

        
              const sql = "UPDATE users_info SET lessons = 1 WHERE tgId=?"; 
                  const params = [`${query?.message?.chat?.username}`];
                  connection.query(sql, params,
                    function(err, results) {
                      console.log(results)
                    }
                  )
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

//Второй урок

function secondLesson(query) {

  const databot = query.data;
  const chatId = query.message.chat.id;
  if(databot === 'nextLearn'){
         bot.sendMessage(chatId, 'Отлично, пора переходить ко второй теме: Что такое DevOps?\nОтвет на этот вопрос ты найдешь в следующем уроке: https://youtu.be/OhF5rGsjC98')
         const sql = "UPDATE users_info SET lessons = 12 WHERE tgId=?"; 
         const params = [`${query?.message?.chat?.username}`];
         connection.query(sql, params,
                 function(err) {
                     if (err) Promise.reject(new Error('fail')).then(resolved, rejected);
                 });
                 
        }
      
      
}

//Переход к урокам

function proverka(query, msg) {
  const databot = query.data;
    const chatId = query.message.chat.id;
    if(databot === 'learn'){
       bot.sendMessage(chatId, 'Я тоже уже хочу начать обучение! \n\nИтак, наш первый модуль для изучения - Введение в DevOps. \nЗдесь мы разберем темы: \n1.1. Жизненный цикл разработки ПО и методологии работы \n1.2. Что такое DevOps, основные концепции \n1.3. Система контроля версий Git, модели ветвления: gitflow \n1.4. Знакомство с GitLab, понятие Continuous Integration \n1.5. Continuous Delivery и Continuous Deployment \n\nЯ буду тебе давать информацию на изучение, а ты проходи ее в удобном для тебя темпе. После каждой темы мы будем проверять с помощью опроса качество усвоения материала. Это позволит тебе закрепить знания и структурировать информацию в голове :) \n\nГотов заниматься?', {
        reply_markup: JSON.stringify({
            inline_keyboard: [
            [{text: 'Да, давай начнем!', callback_data: 'firstLearn'}],
            [{text: 'Я уже знаю эту тему, давай перейдем к следующей.', callback_data: 'nextLearn'}]
            ]
        })
    },)
    if(databot === 'firstLearn'){
      //   bot.removeListener("callback_query");
         firstLesson(query, msg);
         
       }
       else if(databot === 'nextLearn'){
         secondLesson(query);
       }
  //  bot.removeListener('callback_query', proverka);
    }
    
  
};

bot.on("callback_query", proverka);
bot.on("callback_query", firstLesson);
bot.on("callback_query", secondLesson);
//bot.on("message", firstLesson);
bot.on("polling_error", console.log);

bot.on('callback_query', async  (query) => {
    const databot = query.data;
    const chatId = query.message.chat.id;
 
   

    switch(databot) {
      case 'help1':  

      await bot.sendMessage(chatId, '@Ann_Ve тебе обязательно поможет со всеми трудностями :)');  
      break;
    
      case 'help2':  
      
      await bot.sendMessage(chatId, 'Опрос пропустить нельзя, так как бот выедает учебные материалы убедившись, что ты все усвоил из предыдущего урока. Если у тебя есть трудности с ответами, то напиши @Ann_Ve о своей проблеме.');   
      break;

      case 'help3':  
      
      await bot.sendMessage(chatId, 'Вы точно получите хорошую базу для дальнейшего изучения сферы DevOps. А если еще дополнительно тренироваться, например с нашим проектом <a href=\"https://deusops.com/classbook\">«DevOps-задачник»</a>, где будут 2 раза в месяц присылаться реальные рабочие DevOps задачи, то оффер не за горами ;)',{parse_mode : "HTML"});  
      break;

      case 'help4':  
      
      await bot.sendMessage(chatId, 'Автором курса является Константин Брюханов - эксперт в области DevOps и преподаватель этой дисциплины в Университете ИТМО.');   
      break;

      case 'help5':  
      // bot.sendMessage(msg.chat.id,"\n <a href=\"http://www.example.com/\">inline URL</a> \n" ,{parse_mode : "HTML"});
      await bot.sendMessage(chatId, 'Всё ваши мысли, отзывы мы будем рады увидеть по этой <a href=\"https://docs.google.com/forms/d/e/1FAIpQLScyERgR_ivF8_VwsvbTqjt9PWynDNEzX0Sm-njMWSKQr4mGXw/viewform\">форме</a>',{parse_mode : "HTML"});    
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
      await bot.sendMessage(chatId, 'Отлично, пора переходить ко второй теме: Что такое DevOps?\nОтвет на этот вопрос ты найдешь в следующем уроке: https://youtu.be/OhF5rGsjC98', {
        reply_markup: {
          remove_keyboard:true
        }
      })
      const sql = "UPDATE users_info SET lessons = 12 WHERE tgId=?"; 
                  const params = [`${msg?.chat?.username}`];
                  connection.query(sql, params,
                          function(err) {
                              if (err) Promise.reject(new Error('fail')).then(resolved, rejected);
                          });
    }
    else
    if (text === 'С помощью Scrum легко планировать крупные проекты' || text === 'Scrum должен сопровождаться подробной документацией, чтобы вносить меньше исправлений' || text === 'При модели Waterfall можно постоянно возвращаться назад, так как эта модель делает упор на качество')
    {
      await bot.sendMessage(chatId, 'Попробуй еще раз.');
    }
}) 
