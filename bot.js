const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config(); //https://coderrocketfuel.com/article/how-to-load-environment-variables-from-a-.env-file-in-nodejs

client.debug = true;
client.prefix = '!';

const test_server_id = '625862970135805983';

// for v1.0.0
// - Add roles based on reactions
// - Check github for updates on list of repos

// ready event callback
client.once('ready', async () => {
    // set bot status
    client.user.setActivity(`ya like jazz?`, {type: 'PLAYING'});

    // wait for a reference to author's user to save
    const app = await client.fetchApplication();
    client.my_maker = app.owner;

    // queue that you're ready
    console.log(`les go`);
});

// message event callback
client.on('message', async message => {
    // ignore all messages unless it is from the creator himself
    if (message.author.id !== client.my_maker.id) return;

    // if it starts with prefix, process
    if (message.content.startsWith(client.prefix)) {

        // parrot for telling you what to say
        if (message.content.startsWith('!parrot')) {
            const reply = message.content.substring(message.content.indexOf(' '));
            client.guilds.fetch(test_server_id)
                .then(guild => guild.systemChannel.send(reply));
        }
    }
});



// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret