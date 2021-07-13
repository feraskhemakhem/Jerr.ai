const { getWebhook } = require("../database/db_helper");

module.export = {
    fetchWebhookHelper: function(guild_id) {
        const webhook_id = getWebhook(guild_id);

        if (!webhook_id) {
            console.log(`error in fetchWebhookHelper : webhook id is undefined`);
            return;
        }

        const target_webhook = await client.fetchWebhook(webhook_id);
        // console.log(`target webhook url is ${target_webhook.url} and other info is : ${JSON.stringify(target_webhook)}`);
        return target_webhook;
    },
};