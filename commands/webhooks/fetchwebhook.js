// command for adding a role to setup roles message and saving to db

const { getGuildUpdateWebhook } = require("../../helper_functions/sqlite_helper");

module.exports = {
    name: 'fetchwebhook',
    args: 0,
    usage: '',
    description: 'finds webhook of guild',
    async execute(message, args) {
        // get the id of the webhook from db then extract webhook from client
        const { client } = message;

        const webhook_info = await getGuildUpdateWebhook(message.guild.id);

        if (!webhook_info) {
            console.log(`error in fetchwebhook : webhook id is undefined`);
            return;
        }

        console.log(`fetchwebhook: webhook is ${webhook_info.webhook_id} from channel ${webhook_info.channel_id}`);

        const target_webhook = await client.fetchWebhook(webhook_info.webhook_id);
        message.channel.send(`fetchwebhook: target webhook url is ${target_webhook.url}\nand other info is:\n${JSON.stringify(target_webhook)}`);
    },
};