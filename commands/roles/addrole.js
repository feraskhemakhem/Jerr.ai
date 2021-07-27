// command for adding a role to setup roles message and saving to db

const { TeamMember } = require("discord.js");
const { addReactionRole, getSetupMessage } = require("../../helper_functions/sqlite_helper");

module.exports = {
    name: 'addrole',
    args: 2,
    usage: '<@role> <emoji>',
    description: 'add role and reaction to setup message',
    async execute(message, args) {
        console.log(`addRole function called`);
        // guild is used a lot, so save that (and if not available, don't do anything)
        const { guild, client } = message;
        if (!guild.available) return;

        // extract the first role mentioned
        const role = message.mentions.roles.first();

        // find the emoji in the message
        console.log(`addrole: the emoji is ${args[1]}`);
        const emoji = args[1];

        // create reaction for message
        let setup_data;
        if (!(setup_data = await getSetupMessage(guild.id))) { // if no setup message, let the user know
            message.reply('error in addrole : setup data not found');
            return;
        }

        // use a destructable BABYYY
        let { channel_id, message_id } = setup_data;

        // channel_id = parseInt(channel_id);
        // message_id = parseInt(message_id);

        console.log(`addrole: channel id is ${channel_id} and message id is ${message_id}`);

        // find the setup roles message from pinned messages of channel, and add message to cache
        const pinned_messages = await guild.channels?.resolve(channel_id).messages?.fetchPinned();
        
        // console.log(`pinned messages are ${JSON.stringify(pinned_messages)}`);

        const setup_message = pinned_messages.get(message_id);

        // if message not found, throw error
        if (!setup_message) {
            message.reply('error in addrole : setup message not found');
            return;
        }

        console.log(`addRole: about to add reaction role!`);

        // if message exists, add to db
        await addReactionRole(guild.id, emoji, role.id);

        console.log(`addRole: reaction role successful!`);

        // react with this emoji to the message
        setup_message.react(emoji);

        // create callback for when someone reacts (ripped from MatchMaker cuz it's p similar)
        // reaction collector for setting roles
        const collector_filter = (reaction, user) => reaction.emoji.toString() === emoji && user.id !== client.user.id;
        // also create reaction collector for assigning roles
        const elo_collector = setup_message.createReactionCollector(collector_filter);
        // collect role reactions
        elo_collector.on('collect', (reaction, user) => {
            try {
                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                // provide role to member in question
                const member = guild.members.resolve(user);
                if (!guild.me.hasPermission('MANAGE_ROLES')) {
                    console.log(`addrole : no permission to add role`);
                    return;
                }
                if (member.roles?.cache.get(role.id)) {// if role exists, remove
                    console.log(`removing role`);
                    member.roles.remove(role);
                }
                else {// else add
                    console.log(`adding role`);
                    member.roles.add(role).catch(error => console.log(error));
                }
                // finally, remove reaction
                // messagereaction -> reaction user manager -> remove()
                reaction.users.remove(user).catch(error => console.log(error));
            }
            catch (err) {console.log(`addrole : ${err}`);}
        });

        // finally, update messsage to incude emoji and role
        if (setup_message.content.split(/\r\n|\r|\n/).length === 1) { // if only 1 line long, add to newlines
            setup_message.edit(`${setup_message.content}\n\n${emoji}\t${role}`);
        }
        else { // if reactions already added, add 1 newline
            setup_message.edit(`${setup_message.content}\n${emoji}\t${role}`);
        }

    },
};