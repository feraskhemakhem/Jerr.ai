/************************************ CONSTS ************************************/

const Discord = require('discord.js');      // Discord instance
const client = new Discord.Client();        // client instance (me!)
// https://coderrocketfuel.com/article/how-to-load-environment-variables-from-a-.env-file-in-nodejs
require('dotenv').config();                 // for keeping secrets
const express = require('express');         // express for rest api stuff
const bodyParser = require('body-parser');  // for parsing webhook inputs
const fs = require('fs');                   // for accessing the file system

// helper function includes
const { getUpdatesWebhook } = require('./helper_functions/db_helper');
const { templateEmbed } = require('./helper_functions/wb_helper');

// initialize express and port
const app = express();
const PORT = 3000;
app.use(bodyParser.json()); // tell express to use body-parser's json parsing
app.listen(PORT, () => console.log(`🍒 Server running on port ${PORT}`)); // start express on defined port

// for use in all files
client.debug = true;
client.prefix = '!';
client.commands = new Discord.Collection();
client.db_filename = 'testdb.db'; // ALLOWS FOR ALL DATA TO BE WRITTEN IN DIFFERENT FILES FOR TESTING ETC

// test server reference for all guild-related things
client.test_server_id = '625862970135805983';

/************************************ BENCHMARKS ************************************/

// for v1.0.0
// - (DONE) Add roles based on reactions (v0.2.1 - v0.3.3)
// - (DONE) Use Express to check github for updates and intercept webhooks (v0.4.1 - v0.5.0) // https://stackoverflow.com/questions/60675185/how-to-modify-channel-of-discord-webhook-with-python
// - (DONE) Add simple database for persistent data (v0.5.1 - v0.6.0)

/************************************ CLIENT EVENT FUNCTIONS ************************************/


// https://discordjs.guide/event-handling/#individual-event-files
// get all event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// instantiate events from js files in events folder
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

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