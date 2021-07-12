// command for adding a role to setup roles message and saving to db

const { TeamMember } = require("discord.js");
const { addReactionRole, getSetupMessage } = require("../db_files/db_helper");

module.exports = {
    name: 'findsetup',
    description: 'find reference to setup message',
    async execute(message, args) {
        // guild is used a lot, so save that (and if not available, don't do anything)
        const { guild, client } = message;
        if (!guild.available) return;

        // create reaction for message
        let setup_data;
        if (!(setup_data = getSetupMessage(guild.id))) { // if no setup message, let the user know
            message.reply('error in addrole: setup data not found');
            return;
        }

        // use a destructable BABYYY
        const { channel_id, message_id } = setup_data;

        console.log(`channel id is ${channel_id} and message id is ${message_id}`);

        // find the setup roles message from the guild
        const setup_channel = guild.channels?.resolve(channel_id);

        console.log(`setup channel is ${JSON.stringify(setup_channel)}`);
        
        const message_cache = setup_channel.messages;

        console.log(`messages are ${JSON.stringify(message_cache)}`);

        const pinned_messages = await message_cache.fetchPinned(); // will also add to cache

        setup_message = pinned_messages.get(message_id);

        // if message not found, throw error
        if (!setup_message) {
            message.reply('error in findsetup : setup message not found');
            return;
        }

        console.log(setup_message.content);

    },
};