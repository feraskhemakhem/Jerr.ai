// command for adding a role to setup roles message and saving to db

const { getWebhook } = require("../db_files/db_helper");

module.exports = {
    name: 'findwebhook',
    args: 0,
    usage: '',
    description: 'finds webhook of guild',
    async execute(message, args) {
        // get the id of the webhook from db then extract webhook from client
        const { client } = messsage;
        const webhook_id = getWebhook(message.guild.id);
        const target_webhook = client.fetchWebhook(webhook_id);
        console.log(`target webhook is : ${JSON.stringify(target_webhook)}`);
    },
};