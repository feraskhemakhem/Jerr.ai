const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config(); //https://coderrocketfuel.com/article/how-to-load-environment-variables-from-a-.env-file-in-nodejs

client.debug = true;
client.prefix = '!';

// ready event callback
client.once('ready', () => {
    if (!client.debug) {
        client.guilds.fetch('625862970135805983')
            .then(guild => guild.systemChannel.send(`@everyone Hey! Sorry I'm a little late to the party. What's the deal with parties, anyway? *queues laugh track*`))   ;
    }
    console.log(`les go`);
});

// // message event callback
// client.on('message', message => {
//     // if it starts with prefix, process
//     if (message.startsWith(client.prefix)) {

//     }
// });



// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret