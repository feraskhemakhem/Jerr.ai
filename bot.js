/************************************ CONSTS ************************************/

const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config(); //https://coderrocketfuel.com/article/how-to-load-environment-variables-from-a-.env-file-in-nodejs
const fetch = require('node-fetch');
const fs = require('fs');

client.debug = true;
client.prefix = '!';
client.commands = new Discord.Collection();

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

    // add all commands in command folder to list of commands
    const commandFiles = fs.readdirSync('./commands');

    // add just /v for now
    for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.name, command);
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

    console.log(`command ${commandName} received from index ${client.prefix.length}`);

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
    // else if (command === 'setup') { // based on https://www.youtube.com/watch?v=-KDQqWNK3Tw
    //     const { version } = await fetch(`https://api.github.com`).then();
    // }
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



// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret