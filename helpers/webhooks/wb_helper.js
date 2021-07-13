const { getWebhook } = require("../database/db_helper");
const Discord = require('discord.js');

module.exports = {
    fetchWebhookHelper: async function(guild_id) {
        const webhook_id = getWebhook(guild_id);

        if (!webhook_id) {
            console.log(`error in fetchWebhookHelper : webhook id is undefined`);
            return;
        }

        const target_webhook = await client.fetchWebhook(webhook_id);
        // console.log(`target webhook url is ${target_webhook.url} and other info is : ${JSON.stringify(target_webhook)}`);
        return target_webhook;
    },
    templateEmbed: async function(client) {
        return commands_embed = await new Discord.MessageEmbed()
        .setColor('#ffb7c5') // cherry blossom pink
        .setAuthor('Jerr.ai', client.user.displayAvatarURL(), 'https://www.youtube.com/watch?v=W31e9meX9S4') // link to every time they say bee it gets faster
        .setTimestamp(); // to distinguish between embeds
    }
};