// NEW HELPER TO HELP CONVERT TO SQLITE
const read_path = `./testdb.db`;
const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');


const accessDB = async function(options) {
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
        return await accessDB(sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    },
    // returns the data of the file
    readData: readData,
    // function for writing given data to a file
    readWriteData: readWriteData,
    // add the setuproles message instance with channel and message id per guild
    addSetup: async function(guild_id, channel_id, message_id) {
        const db = await readWriteData();
        console.log(`addSetup: values in addsetup are ${guild_id}, ${channel_id}, and ${message_id}`);
        // add guild, channel, and message id
        db.run('INSERT OR REPLACE INTO setup_message VALUES(?, ?, ?)', [guild_id, channel_id, message_id], function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Row(s) inserted or replaced from setup_message ${this.changes}`);
        });
        // clear all reaction_roles for provided guild
        // db.run('DELETE FROM reaction_roles WHERE guild=?', guild_id, function(err) {
        //     if (err) {
        //       return console.error(err.message);
        //     }
        //     console.log(`Row(s) deleted from setup_message ${this.changes}`);
        // });
          
        db.close();
    },
    // adds role and reaction pair for guild
    addReactionRole: async function(guild_id, reaction, role_id) {
        console.log(`addReactionRole: inserting data: ${guild_id}, ${reaction}, ${role_id}`);
        const db = await readWriteData();
        // write reaction_role to reaction_roles in database
        db.run('INSERT INTO reaction_roles VALUES(?, ?, ?)', [guild_id, reaction, role_id]);
        db.close();
    },
    // gets the setup message of provided server
    getSetupMessage: async function(guild_id) {
        const db = await readData();
        // based on https://www.sqlitetutorial.net/sqlite-nodejs/query/
        // get channel and message id and return
        const value = await db.get('SELECT DISTINCT channel as channel_id, message as message_id FROM setup_message WHERE guild = ?', guild_id);
        // if message exists, print em something
        if (value) console.log(`selected {${value.channel_id}, ${value.message_id}} from setup_message`);
        db.close();
        return value;
    },
    addUpdateWebhook: async function(guild_id, channel_id, webhook_id) {
        const db = await readWriteData();
        db.run('INSERT INTO updates_webhook VALUES(?, ?, ?)', webhook_id, channel_id, guild_id);
        db.close();
    },
    getUpdateWebooks: async function() { 
        const db = await readData();
        // get all webhooks
        const values = await db.all('SELECT DISTINCT webhook as webhook_id, guild as guild_id FROM updates_webhook ORDER BY guild');
        if (value) console.log(`list of update webhooks is ${JSON.stringify(value)}`);
        db.close();
        return values;
    },
    getGuildUpdateWebhook: async function(guild_id) {
        const db = await readData();
        // get first webhook that has guild id
        const value = await db.get('SELECT DISTINCT webhook as webhook_id, channel as channel_id FROM updates_webhook WHERE guild = ?', guild_id);
        // if value exists, print it accordingly
        if (value) console.log(`update webhook for guild ${guild_id} is ${value.webhook_id} from channel ${value.channel_id}`);
        db.close();
        return value;
    },
};