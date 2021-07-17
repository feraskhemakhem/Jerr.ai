// NEW HELPER TO HELP CONVERT TO SQLITE
const read_path = `./testdb.db`;
const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');


const accessDB = async function(options) {
    console.log(`options are ${options}`);
    return await open({
        filename: read_path,
        driver: sqlite3.Database,
        mode: options,
    });
}

const readData = async function() {
    return await accessDB(sqlite3.OPEN_READONLY);
}

const readWriteData = async function() {
    return await accessDB(sqlite3.OPEN_READWRITE);
}

module.exports = {
    // creates the db initially
    createDB: async function() {
        console.log(`amogus`);
        return await accessDB(sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
    },
    // returns the data of the file
    readData: readData,
    // function for writing given data to a file
    readWriteData: readWriteData,
    // add the setuproles message instance with channel and message id per guild
    addSetup: async function(guild_id, channel_id, message_id) {
        const db = await readWriteData();
        // add guild, channel, and message id
        db.exec('INSERT OR REPLACE INTO setup_message VALUES(?, ?, ?)', [guild_id, channel_id, message_id], function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Row(s) inserted or replaced from setup_message ${this.changes}`);
        });
        // clear all reaction_roles for provided guild
        db.exec('DELETE FROM reaction_roles WHERE guild=?', guild_id, function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Row(s) deleted from setup_message ${this.changes}`);
        });
          
        db.close();
    },
    // // adds role and reaction pair for guild
    // addReactionRole: function(guild_id, reaction, role_id) {
    //     const data = readData();
    //     data.reaction_roles[guild_id][role_id] = reaction; 
    //     writeData(data);
    // },
    // gets the setup message of provided server
    getSetupMessage: async function(guild_id) {
        const db = await readData();
        // based on https://www.sqlitetutorial.net/sqlite-nodejs/query/
        // get channel and message id and return
        const value = await db.get('SELECT DISTINCT channel as channel_id, message as message_id FROM setup_message WHERE guild = ?', guild_id);
        console.log(`selected {${value.channel_id}, ${value.message_id}} from setup_message`);
        return value;
    },
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