const Telegraf = require('telegraf');
const Extra    = require('telegraf/lib/helpers/extra');
const bot      = new Telegraf(process.env.BOT_TOKEN);
const rp       = require('request-promise');

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
});

const randomInlineButtonMarkup = Extra.HTML().markup(
    (m) => m.inlineKeyboard([m.callbackButton('Give me a random fact', 'random')]));

const options = {
    uri : 'https://api.chucknorris.io/jokes/random',
    json: true
};

bot.command('start', (ctx) => {
    console.log('start', ctx.from);
    ctx.reply('Welcome!\n Bot is in development state.')
        .then(ctx.reply('Wanna random fact about Chuck Norris?', randomInlineButtonMarkup));
});

bot.action('random', (ctx) => {
    console.log('username = ' + ctx.from.username + ' name = ' + ctx.from.first_name + ' ' + ctx.from.last_name);
    rp(options)
        .then(response => {
            ctx.editMessageReplyMarkup(randomInlineButtonMarkup, undefined);
            ctx.reply(response.value, randomInlineButtonMarkup)
        })
        .catch(function () {
            ctx.reply("Error\n");
        })
});

bot.startPolling();