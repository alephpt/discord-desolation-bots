const db = require ('../support/psql/index.js');


module.exports = {
    getPlayerData: async function (id) {
        let playerdata = await db.getPlayer(id);
        if ( playerdata.rows[0]?.player_id === id ) {
            //return JSON.stringify(playerdata.rows);
            return JSON.stringify(playerdata.rows[0]);
        } else {
            return false;
        }
    },
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
    }
}
