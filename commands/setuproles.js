module.exports = {
    name: 'setuproles',
    minargs: 2,
    usage: '<#channel> <message>',
    description: 'provides message to assign roles to users',
    execute(message, args) {

        // find the first guild channel mentioned, and remove from args
        const target_channel = message.mentions?.channels?.first();

        if (!target_channel) {
            message.reply('no target channel provided');
            return;
        }

        args.shift();

        // combine all args into a string
        const setup_message = args.join(' ');

        await target_channel.send(setup_message);
    },
};