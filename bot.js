/************************************ CONSTS ************************************/

const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config(); //https://coderrocketfuel.com/article/how-to-load-environment-variables-from-a-.env-file-in-nodejs
const fetch = require('node-fetch');

client.debug = true;
client.prefix = '!';

const test_server_id = '625862970135805983';

/************************************ EVENT FUNCTIONS ************************************/

// for v1.0.0
// - Add roles based on reactions
// - Use REST API to check github for updates on list of repos

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

    // ignore all messages unless it is from the creator himself with a prefix
    if (!message.content.startsWith(client.prefix) || message.author.id !== client.my_maker.id) return;

    // get args and command (command without prefix)
	const args = message.content.slice(client.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    console.log(`command ${command} received from index ${client.prefix.length}`);

    // parrot for telling you what to say
    if (command === 'parrot') {
        const reply = message.content.substring(message.content.indexOf(' '));
        client.guilds.fetch(test_server_id)
            .then(guild => guild.systemChannel.send(reply));
    }
    // TEST CODE FOR REST API WITH RANDOM CAT EXAMPLE
    else if (command === 'cat') {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        message.reply(file);
    }
});



// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret