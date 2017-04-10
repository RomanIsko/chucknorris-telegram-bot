const Telegraf = require('telegraf');
const Extra    = require('telegraf/lib/helpers/extra');
const app      = new Telegraf(process.env.BOT_TOKEN);
const rp       = require('request-promise');

const randomInlineButtonMarkup = Extra.HTML().markup(
    (m) => m.inlineKeyboard([m.callbackButton('Give me a random fact', 'random')]));

const options = {
    uri : 'https://api.chucknorris.io/jokes/random',
    json: true
};

app.command('start', (ctx) => {
    console.log('start', ctx.from);
    ctx.reply('Welcome!\n' +
              'Bot is in development state.');
    ctx.reply('Wanna random Chuck Norris fact?', randomInlineButtonMarkup)
});

app.action('random', (ctx) => {
    console.log('username = ' + ctx.from.username + ' name = ' + ctx.from.first_name + ' ' + ctx.from.last_name);
    rp(options)
        .then(response => {
            ctx.reply(response.value, randomInlineButtonMarkup)
        })
        .catch(function () {
            ctx.reply("Error\n");
        })
});

app.startPolling();