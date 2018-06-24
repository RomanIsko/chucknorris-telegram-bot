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

bot.command('start', (ctx) => {
  ctx.reply('Welcome!\n Bot is in development state.')
    .then(() => {return ctx.reply('Wanna random fact about Chuck Norris?', randomInlineButtonMarkup)})
})

bot.action('random', (ctx) => {
  rp('https://api.chucknorris.io/jokes/random', {json: true})
    .then(response => {
      ctx.editMessageReplyMarkup(randomInlineButtonMarkup, undefined)
      return ctx.reply(response.value, randomInlineButtonMarkup)
    })
    .catch(function () {
      return ctx.reply('Error\n')
    })
})

bot.startPolling()