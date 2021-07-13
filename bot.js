/************************************ CONSTS ************************************/

const Discord = require('discord.js');  // Discord instance
const client = new Discord.Client();    // client instance (me!)
// https://coderrocketfuel.com/article/how-to-load-environment-variables-from-a-.env-file-in-nodejs
require('dotenv').config();             // for keeping secrets
const express = require('express');     // express for rest api stuff
const bodyParser = require('body-parser');// for parsing webhook inputs
const fs = require('fs');               // for accessing the file system
const Sequelize = require('sequelize'); // for database access
const { getUpdatesWebhook } = require('./helpers/database/db_helper');
const { templateEmbed } = require('./helpers/webhooks/wb_helper');

// initialize express and port
const app = express();
const PORT = 3000;
app.use(bodyParser.json()); // tell express to use body-parser's json parsing
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); // start express on defined port

// for use in all files
client.debug = true;
client.prefix = '!';
client.commands = new Discord.Collection();

// test server reference for all guild-related things
const test_server_id = '625862970135805983';

// // create instance of sequelize
// const sequelize = new Sequelize('database', 'user', 'password', {
// 	host: 'localhost',  // db resides within the app (not dedicated)
// 	dialect: 'sqlite',  // using sqlite
// 	logging: false,     // verbose false
// 	// SQLite only setting
// 	storage: 'database.sqlite',
// });

/************************************ BENCHMARKS ************************************/

// for v1.0.0
// - (DONE) Add roles based on reactions (v0.2.1 - v0.3.3)
// - (DONE) Use Express to check github for updates and intercept webhooks (v0.4.1 - v0.5.0) // https://stackoverflow.com/questions/60675185/how-to-modify-channel-of-discord-webhook-with-python
// - Add simple database for persistent data (v0.5.1 - v0.6.0) 

/************************************ CLIENT EVENT FUNCTIONS ************************************/

// ready event callback
client.once('ready', async () => {
    // set bot status
    if (client.debug) // makes it obvious if the bot is in debug mode or not when on
        client.user.setActivity(`what's with debug mode, anyway?`, {type: 'PLAYING'});
    else
        client.user.setActivity(`ya like jazz?`, {type: 'PLAYING'});

    // wait for a reference to author's user to save
    const app = await client.fetchApplication();
    client.my_maker = app.owner;

    // add all commands in command folder to list of commands
    // read all the sub-folders of commands
    const commandFolders = fs.readdirSync('./commands');

    // for each subfolder, get all the files ending in js
    for (const folder of commandFolders) {
        if (folder.endsWith('js')) continue; // if a file and not a folder, skip
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        // for each file, add the command to client.commands
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            // key is command name, value is actual command
            client.commands.set(command.name, command);
        }
    }

    // queue that you're ready
    console.log(`les go`);
});

// message event callback
client.on('message', async message => {

    // ignore all messages unless it is from the creator himself with a prefix
    if (!message.content.startsWith(client.prefix) || message.author.id !== client.my_maker.id) return;

    // get args and command (command without prefix)
	const args = message.content.slice(client.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    console.log(`command ${commandName} received in bot.js`);

    // parrot for telling you what to say
    if (commandName === 'parrot') {
        const reply = message.content.substring(message.content.indexOf(' '));
        client.guilds.fetch(test_server_id)
            .then(guild => guild.systemChannel.send(reply));
    }
    // TEST CODE FOR REST API WITH RANDOM CAT EXAMPLE
    else if (commandName === 'cat') {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        message.reply(file);
    }
    else {
        // if no command is registered, ignore
        if (!client.commands.has(commandName)) return;

        // otherwise, access the command
        const command = client.commands.get(commandName);

        // check for valid arg # 
        if (command.args && command.args !== args.length) return;
        if (command.minargs && command.minargs > args.length) return;

        try {
            command.execute(message, args); // run command with args and database reference
        } catch (error) { // if there's an error, print it as well as a message in the chat
            console.error(error);
            message.reply('there was an error trying to execute this command :/');
        }
    }
});

// when webhook is updated
client.on('webhookUpdate', channel => {
    console.log(`channel has a webhook update`);
});

/************************************ EXPRESS ENDPOINTS ************************************/

// https://blog.bearer.sh/consuming-webhooks-with-node-js-and-express/
// this is DOPE ^^

// for new endpoint "github"
app.post("/github", async (req, res) => {
    res.status(200).end(); // ACKing quickly is important

    // if our event is a release
    if (req.headers['x-github-event'] === 'release' && req.body.action === 'created') {
        const webhook_id = getUpdatesWebhook();
        console.log(`webhook id is ${webhook_id}`);
        const webhook = await client.fetchWebhook(webhook_id);

        // send webhook message regarding the provided data
        const embed_message = await templateEmbed(client);
        embed_message
        .setTitle(`${req.body.release.name} Release`)
        .setDescription(`${req.body.repository.name} released ${req.body.release.name} with details:\n${req.body.release.body}`);

        webhook.send({
            username: 'Jerr.ai',
            embeds: [embed_message],
        });
    }
});



// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret