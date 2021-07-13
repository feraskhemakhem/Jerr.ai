// command for adding a role to setup roles message and saving to db

const { addReactionRole, getSetupMessage, addWebhook } = require("../db_files/db_helper");

module.exports = {
    name: 'createwebhook',
    minargs: 3,
    usage: '<#channel> <avatar> <username>',
    description: 'creates webhook with given avatar in provided channel',
    async execute(message, args) {
        // extract channel and avatar from inputs
        const target_channel = message.mentions.channels.first();
        const target_avatar = args[1];
        // username is every arg after the first 2
        const target_username = args.splice(2).join(' ');
        

        // based on: https://discordjs.guide/popular-topics/webhooks.html#creating-webhooks-through-server-settings
        // create webhook   
        const new_webhook = target_channel.createWebhook(target_username, {avatar: target_avatar});

        // save webhook id
        addWebhook(message.guild.id, new_webhook.id);
    },
};