module.exports = {


    menuOptions : {
        reply_markup: JSON.stringify({
            inline_keyboard: [
            [{text: 'Хочу учиться', callback_data: 'learn'}],
            [{text: 'Библиотека', callback_data: 'library'}],
            [{text: 'Помощь', callback_data: 'help'}],
            [{text: 'Остановить бота', callback_data: 'stop'}]
            ]
        })
    },

    helpOptions : {
        reply_markup: JSON.stringify({
            inline_keyboard: [
            [{text: 'К кому можно обратиться в случае вопросов? ', callback_data: 'help1'}],
            [{text: 'Можно ли пропустить опрос по изученным материалам?', callback_data: 'help2'}],
            [{text: 'Смогу ли я устроиться на работу, если пройду этого бота?', callback_data: 'help3'}],
            [{text: 'Кто автор всех учебных материалов?', callback_data: 'help4'}],
            [{text: 'Как можно оставить обратную связь?', callback_data: 'help5'}]
            ]
        })
    },

    

   

    poll1Options : {
       // one_time_keyboard: true,
        reply_markup: JSON.stringify({
            keyboard: [
            [{text: '5-1-3-2-4'}],
            [{text: '2-3-5-1-4'}],
            [{text: '1-2-4-3-5'}],
            [{text: '3-2-5-1-4'}]
            ]
        })
    },

    poll2Options : {
        reply_markup: {
            resize_keyboard: true,
          //  one_time_keyboard: true,
            keyboard: [
                [{text: 'С помощью Scrum легко планировать крупные проекты'}],
                [{text: 'Scrum должен сопровождаться подробной документацией, чтобы вносить меньше исправлений'}],
                [{text: 'Методика Scrum может быть внедрена на этапе разработки при модели Waterfall'}],
                [{text: 'При модели Waterfall можно постоянно возвращаться назад, так как эта модель делает упор на качество'}]
            ]
        }
    }

}