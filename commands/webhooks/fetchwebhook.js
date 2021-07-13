// command for adding a role to setup roles message and saving to db

const { getWebhook } = require("../../helpers/database/db_helper");

module.exports = {
    name: 'fetchwebhook',
    args: 0,
    usage: '',
    description: 'finds webhook of guild',
    async execute(message, args) {
        // get the id of the webhook from db then extract webhook from client
        const { client } = message;
        const webhook_id = getWebhook(message.guild.id);

        if (!webhook_id) {
            console.log(`error in fetchwebhook : webhook id is undefined`);
            return;
        }

        const target_webhook = await client.fetchWebhook(webhook_id);
        console.log(`target webhook url is ${target_webhook.url} and other info is : ${JSON.stringify(target_webhook)}`);
    },
};