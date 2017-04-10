const Telegraf = require('telegraf');

const app     = new Telegraf(process.env.BOT_TOKEN);
const rp      = require('request-promise');
const options = {
    uri : 'https://api.chucknorris.io/jokes/random',
    json: true
};

app.command('start', (ctx) => {
    console.log('start', ctx.from);
    ctx.reply('Welcome! Please use command /r to get random fact.\n' +
              'Bot is in development state.')
});

app.command('r', (ctx) => {
    console.log('username = ' + ctx.message.from.username + ' name = ' + ctx.message.from.first_name + ' ' +
                ctx.message.from.last_name);
    rp(options)
        .then(response => {
            ctx.reply(response.value)
        })
        .catch(function () {
            ctx.reply("Error\n");
        })
});

app.startPolling();