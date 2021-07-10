// all helper functions for the database (taken from MatchMaker bc it's the same :))
const read_path = './temp/temp_db.json';
const write_path = './temp/temp_db.json';
const fs = require('fs');

const readData = function() {
    return require(read_path);
}

const writeData = function(data) {
    fs.writeFile(write_path, JSON.stringify(data), err => {
            
        // Checking for errors
        if (err) console.log(`error storing to database in writeData function with error ${err}`);
    
        // if you've reached this point, update db successfully
        else console.log('db update complete'); 
    });
}

module.exports = {
    // returns the data of the file
    readData: readData,
    // function for writing given data to a file
    writeData: writeData,
    // updates the setuproles message instance with channel and message id per guild
    updateSetup: function(guild_id, channel_id, message_id) {
        const data = readData();
        data.setup_message[guild_id] = {channel_id, message_id};
        writeData(data);
    },
    // adds role and reaction pair for guild
    addReactionRole: function(guild_id, reaction, role_id) {
        const data = readData();
        data.reactionRole[guild_id][role_id] = reaction; 
        writeData(data);
    },
};