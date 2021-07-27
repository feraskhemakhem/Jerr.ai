// module for message event of client

const sqlite_helper = require('../helper_functions/sqlite_helper');

module.exports = {
	name: 'message',
	async execute(message, client) {
        // ignore all messages unless it is from the creator himself with a prefix
        if (!message.content.startsWith(client.prefix) || message.author.id !== client.my_maker.id) return;

        // get args and command (command without prefix)
        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

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
    },
};