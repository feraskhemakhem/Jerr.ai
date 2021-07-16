// NEW HELPER TO HELP CONVERT TO SQLITE
const read_path = `./testdb.db`;
const fs = require('fs');

const sqlite = require('sqlite3').verbose();

const accessDB = function(options) {
    return new sqlite.Database(read_path, options);
}

const readData = function() {
    return accessDB(sqlite.OPEN_READONLY);
}

const readWriteData = function() {
    return accessDB(sqlite.OPEN_READWRITE);
}

module.exports = {
    // creates the db initially
    createDB: function() {
        return accessDB(sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
    },
    // returns the data of the file
    readData: readData,
    // function for writing given data to a file
    readWriteData: readWriteData,
    // add the setuproles message instance with channel and message id per guild
    // addSetup: function(guild_id, channel_id, message_id) {
    //     const data = readData();
    //     data.setup_message[guild_id] = {channel_id, message_id};
    //     // clear/create field for guild in reaction_roles
    //     data.reaction_roles[guild_id] = {};
    //     writeData(data);
    // },
    // // adds role and reaction pair for guild
    // addReactionRole: function(guild_id, reaction, role_id) {
    //     const data = readData();
    //     data.reaction_roles[guild_id][role_id] = reaction; 
    //     writeData(data);
    // },
    // // gets the setup message of provided server
    // getSetupMessage: function(guild_id) {
    //     const data = readData();
    //     return data.setup_message[guild_id];
    // },
    // addWebhook: function(guild_id, webhook_id, updates) {
    //     const data = readData();
    //     data.webhook[guild_id] = webhook_id;
    //     if (updates)
    //         data.updatesWebhook = webhook_id;
    //     writeData(data);
    // },
    // getWebhook: function(guild_id) {
    //     const data = readData();
    //     return data.webhook[guild_id];
    // },
    // getUpdatesWebhook: function() {
    //     const data = readData();
    //     return data.updatesWebhook;
    // }
};