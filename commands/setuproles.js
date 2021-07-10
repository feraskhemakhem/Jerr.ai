const { addSetup } = require("../db_helper");

module.exports = {
    name: 'setuproles',
    minargs: 2,
    usage: '<#channel> <message>',
    description: 'provides message to assign roles to users',
    async execute(message, args) {

        // find the first guild channel mentioned, and remove from args
        const target_channel = message.mentions?.channels?.first();

        if (!target_channel) {
            message.reply('no target channel provided');
            return;
        }

        // remove channe from args
        args.shift();

        // combine all args into a string
        const setup_content = args.join(' ');

        const setup_message = await target_channel.send(setup_content);

        addSetup(message.guild.id, target_channel.id, setup_message.id);
    },
};