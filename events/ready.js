// module for ready event of client

//  node.js native file system
const fs = require('fs');
// discord api reference
const Discord = require('discord.js'); 

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
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
    },
};