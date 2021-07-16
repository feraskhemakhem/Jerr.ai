// command for adding a role to setup roles message and saving to db

const { addWebhook } = require("../../helper_functions/db_helper");

module.exports = {
    name: 'createwebhook',
    minargs: 3,
    usage: '<#channel> <updates?> <username>',
    description: 'creates webhook with given avatar in provided channel',
    async execute(message, args) {
        // extract channel and avatar from inputs
        const target_channel = message.mentions.channels.first();
        // check for updates bool
        let updates = false;
        if (args[1].toLowerCase() === 'true')
            updates = true;
        // username is every arg after the first 2
        const target_username = args.splice(2).join(' ');
        

        // based on: https://discordjs.guide/popular-topics/webhooks.html#creating-webhooks-through-server-settings
        // create webhook   
        target_channel.createWebhook(target_username, {avatar: message.client.user.displayAvatarURL()})
        .then(webhook => addWebhook(message.guild.id, webhook.id, updates)); // save webhook id
    },
};