const db = require ('../support/psql/index.js');


module.exports = {
    // returns player json obj from player_data if it exists
    getPlayerData: async function (id) {
        let playerdata = await db.getPlayer(id);
        if ( playerdata.rows[0]?.player_id === id ) {
            //return JSON.stringify(playerdata.rows);
            return JSON.stringify(playerdata.rows[0]);
        } else {
            return false;
        }
    },
    
    // inserts player data into player_data
    addPlayerData: async function (id) {
        let playerdata = await db.getPlayer(id);
        if ( playerdata.rows[0]?.player_id !== id ) {
            let playerdata = {
                "id" : id,
                "char_count" : 0
            };
            let newplayer = await db.addPlayer(playerdata);
            return newplayer;
        } else {
            return false;
        }
    },

    // get character count
    async getCharCount(id){
        let char_count = await db.getCharacters(id);
        return char_count.rowCount;
    },

/*
    // returns specific count of arbitrary constraints
    async getCount(id, table, column){
        let values = await db.getCount(id, table, column);
        if(values?.rows[0]?.cardinality) {
            return values.rows[0].cardinality;
        } else {
            return false;
        }
    },
*/
    // update character list in player_data
    async updateCharNames (id) {
        let charr = [];

        // get characters object
        let chars = await db.getCharacters(id);
        let char_count = await chars.rowCount;
        
        // for 3 count add character id or null to array
        for (let counter = 0; counter < 3; counter++) {
            if (counter < char_count) {
                if (chars?.rows[counter]?.id) {
                    charr[counter] = chars.rows[counter].id;
                } else {
                    charr[counter] = null;
                }
            }
        }
        let update = await db.updateCharNames(id, charr);
        return update;
    }
}
