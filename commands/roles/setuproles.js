// command for creating setup roles message and saving to db

const { addSetup, getSetupMessage } = require("../../helpers/db_helper");
const setup_content = 'React with the following to gain role access:\n';

module.exports = {
    name: 'setuproles',
    args: 1,
    usage: '<#channel>',
    description: 'provides message to assign roles to users',
    async execute(message, args) {

        const { guild } = message;

        // find the first guild channel mentioned, and remove from args
        const target_channel = message.mentions?.channels?.first();

        if (!target_channel) {
            message.reply('error in setuproles : no target channel provided');
            return;
        }
        
        // if old setup message exists, delete it before sending new one
        let setup_data;
        if (setup_data = getSetupMessage(guild.id)) {
            // if setup data exists, delete it

            // use a destructable BABYYY (*queues jschlatt video*)
            const { channel_id, message_id } = setup_data;

            // find the setup roles message from pinned messages of channel, and add message to cache
            const pinned_messages = await guild.channels?.resolve(channel_id).messages?.fetchPinned();
            const old_message = pinned_messages.get(message_id);

            // if message found, delete it
            if (old_message) {
                old_message.delete({reason : 'Jerr.ai: new setup message to replace this one'});
            }
        }

        const setup_message = await target_channel.send(setup_content);

        addSetup(guild.id, target_channel.id, setup_message.id);

        // pin new setup message to channel
        setup_message.pin({reason : 'Jerrai: setup message for assigning roles'})
        .then(stpmsg => {
            // delete PIN_ADD ("pinned a message to this channel")
            guild.channels?.resolve(target_channel)?.bulkDelete(1);
        });
    },
};