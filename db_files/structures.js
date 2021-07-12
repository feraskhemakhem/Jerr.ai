const { Sequelize } = require("sequelize/types");

/*
 * guild, role, reaction
 */
const ReactionRoles = sequelize.define('reactionRoles', {
    guild: {
        type: Sequelize.STRING, // string of numbers
        unique: true, // one per guild
    },
	role: Sequelize.STRING, // string of numbers
    reaction: Sequelize.TEXT, // identifier

});
