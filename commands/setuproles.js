// command for creating setup roles message and saving to db

const { addSetup } = require("../db_files/db_helper");
const setup_content = 'React with the following to gain role access:\n';

module.exports = {
    name: 'setuproles',
    args: 1,
    usage: '<#channel>',
    description: 'provides message to assign roles to users',
    async execute(message, args) {

        // find the first guild channel mentioned, and remove from args
        const target_channel = message.mentions?.channels?.first();

        if (!target_channel) {
            message.reply('no target channel provided');
            return;
        }

        const setup_message = await target_channel.send(setup_content);

        addSetup(message.guild.id, target_channel.id, setup_message.id);
    },
};