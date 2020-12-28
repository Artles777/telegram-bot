const TelegramBot = require('node-telegram-bot-api')
      request = require('request')

const token = '1476504611:AAFtlwQvUIKQghxGjEuWDqct0O8Mru33WAs'

const bot = new TelegramBot(token, {
  polling: true
})

bot.onText(/\/curse/, (msg) => {

  const chatId = msg.chat.id

  bot.sendMessage(chatId, 'Выберите, какой курс валюты вы хотите видеть', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '$ - USD',
            callback_data: 'USD'
          },
          {
            text: '€ - EUR',
            callback_data: 'EUR'
          },
          {
            text: '₽ - RUR',
            callback_data: 'RUR'
          },
          {
            text: '₿ - BTC',
            callback_data: 'BTC'
          }
        ]
      ]
    }
  })
})

bot.on('callback_query', query => {
  const chatId = query.message.chat.id
  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function(error, response, body) {
    const data = JSON.parse(body)
    const res = data.filter(currency => currency.ccy === query.data)[0]
    const flags = {
      'USD': '🇱🇷',
      'EUR': '🇪🇺',
      'RUR': '🇷🇺',
      'BTC': '₿',
      "UAH" : '🇺🇦'
    }
    const md = `
      *${flags[res.ccy]} ${res.ccy} 💱 ${res.base_ccy} ${flags[res.base_ccy]}*
      Продажа: _${res.buy}_
      Покупка: _${res.sale}_
    `
    bot.sendMessage(chatId, md, {
      parse_mode: 'Markdown'
    })
  })
})