const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const text = require('./const')
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

  connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM information", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
      await bot.sendMessage(chatId, 'Привет! Я учебный бот по DevOps. Вместе мы пройдем с тобой непростой путь по освоению этой сферы, но я уверен, что все получится!Давай зарегистрируем тебя в нашей базе - это нужно будет для сбора обратной связи и статистики, ведь я хочу постоянно развиваться!')
      setTimeout(async () => {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl }}]
                ]
            }
        })
      }, 3000)
    }
    
//console.log(msg.chat.username)
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
                
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 1000)
        } catch (e) {
            console.log(e);
        }
        
    }
});


