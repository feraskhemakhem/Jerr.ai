// command for adding a role to setup roles message and saving to db

const { TeamMember } = require("discord.js");
const { addReactionRole, getSetupMessage } = require("../db_helper");

module.exports = {
    name: 'addrole',
    args: 2,
    usage: '<@role> <emoji>',
    description: 'add role and reaction to setup message',
    async execute(message, args) {
        // guild is used a lot, so save that (and if not available, don't do anything)
        const { guild, client } = message;
        if (!guild.available) return;

        // extract the first role mentioned
        const role = message.mentions.roles.first();

        // find the emoji in the message
        console.log(`the emoji is ${args[1]}`);
        const emoji = args[1];

        // add to db
        addReactionRole(guild.id, emoji, role.id);

        // create reaction for message
        let setup_data;
        if (!(setup_data = getSetupMessage(guild.id))) { // if no setup message, let the user know
            message.reply('error in addrole: setup data not found');
            return;
        }

        // use a destructable BABYYY
        const { channel_id, message_id } = setup_data;

        console.log(`data is ${channel_id} and ${message_id}`);

        // find the setup roles message from the guild
        const setup_message = guild.channels?.resolve(channel_id).messages?.resolve(message_id);

        // if message not found, throw error
        if (!setup_message) {
            message.reply('error in addrole: setup message not found');
            return;
        }

        // react with this emoji to the message
        setup_message.react(emoji);

        // create callback for when someone reacts (ripped from MatchMaker cuz it's p similar)
        // reaction collector for setting roles
        const collector_filter = (reaction, user) => reaction.emoji.toString() === emoji && user.id !== client.user.id;
        // also create reaction collector for assigning roles
        const elo_collector = setup_message.createReactionCollector(collector_filter);
        // collect role reactions
        elo_collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            // provide role to member in question
            guild.members.fetch(user)
            .then(member => {
                member.roles.add(role);
            }); 
        });

    },
};