const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const bot = new Telegraf(process.env.BOT_TOKEN)
const rp = require('request-promise')

const logger = require('logzio-nodejs').createLogger({
  token: process.env.LOGZIO_TOKEN,
  host: 'listener.logz.io',
  type: process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? 'chuck_norris_bot' : 'chuck_norris_bot_dev'
})

//register logz.io and console loggers
bot.use((ctx, next) => {
  return next(ctx).then(() => {
    console.log(ctx.message)
    logger.log(ctx.message)
  })
})

bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})

const randomInlineButtonMarkup = Extra.HTML().markup(
  (m) => m.inlineKeyboard([m.callbackButton('Give me a random fact', 'random')]))

const options = {
  uri: 'https://api.chucknorris.io/jokes/random',
  json: true
}

bot.command('start', (ctx) => {
  console.log('start', ctx.from)
  ctx.reply('Welcome!\n Bot is in development state.')
    .then(ctx.reply('Wanna random fact about Chuck Norris?', randomInlineButtonMarkup))
})

bot.action('random', (ctx) => {
  console.log('username = ' + ctx.from.username + ' name = ' + ctx.from.first_name + ' ' + ctx.from.last_name)
  rp(options)
    .then(response => {
      ctx.editMessageReplyMarkup(randomInlineButtonMarkup, undefined)
      ctx.reply(response.value, randomInlineButtonMarkup)
    })
    .catch(function () {
      ctx.reply('Error\n')
    })
})

bot.startPolling()