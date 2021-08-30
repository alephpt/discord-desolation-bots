const { Pool, Client } = require("pg");

const creds = {
    user: "sister",
    host: "localhost",
    database: "desolation",
    password: "desolate",
    port: 5432,
};

const pool = new Pool(creds);
const client = new Client(creds);

module.exports = {
    addPlayer: async function (player) {
        const text = `
            INSERT INTO player_data (player_id, char_count, join_date)
            VALUES ($1, $2, NOW()::DATE)
        `;
        const values = [player.id, player.char_count];
        let newplayer = await pool.query(text, values);
        return newplayer;
    },

    getPlayer : async function (playerid) {
        const text = `SELECT * FROM player_data WHERE player_id = $1`;
        const player = [playerid];
        const playerdata = await pool.query(text, player);
        return playerdata;
    },

    delPlayer : async function (playerid) {
        const text = `DELETE FROM player_data WHERE player_id = $1`;
        const player = [playerid];
        const playerdata = await pool.query(text, player);
        return playerdata;
    },

    addNewChar: function (c) {
        const text = `
            INSERT INTO char_data (player_id, char_name, level, sex, race, world, location,
                discipline, mastery, alignment, group_name, quest_current, clan)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id
        `;

        const values = [c.player_id, c.char_name, c.level, c.sex, c.race, c.world, c.loc, 
            c.discipline, c.mastery, c.alignment, c.group_name, [c.quest_current], c.clan];
        return pool.query(text, values);
    },
/*
 *
 * DOESN'T WORK RIGHT AND SHOULDN'T BE USED ANYWAY
 *
    getCount: async function (playerid, table, column) {
        const text = `SELECT cardinality($3) FROM $2 WHERE player_id = $1`;
        const player = [playerid, table, column];
        const count = await pool.query(text, player);
        return count;
    },
*/
    getCharacters: async function (playerid) {
        const text = `SELECT * FROM char_data WHERE player_id = $1`;
        const player = [playerid];
        const chardata = await pool.query(text, player);
        return chardata;
    },

    changeCharacterName: function (playerid, newname) {
        const text = `UPDATE char_data SET char_name = $2 WHERE player_id = $1`;
        const values = [playerid, newname];
        return pool.query(text, values);
    },

    updateCharNames: async function (playerid, chars) {
        const text = `UPDATE player_data SET characters = $2 WHERE player_id = $1`;
        const values = [playerid, chars];
        const update = await pool.query(text, values);
        return update;
    },

    deleteCharacter: function (playerid, charname) {
        const text = `DELETE FROM char_data WHERE player_id = $1 AND char_name = $2`;
        const player = [playerid, charname];
        return pool.query(text, player);
    },
    
    getCharID: async function (playerid, charname) {
        const text = `SELECT id FROM char_data WHERE player_id = $1 AND char_name = $2`;
        const player = [playerid, charname];
        let charid = await pool.query(text, player);
        return charid;
    },
    
    setActiveChar: async function (playerid, charname) {
        const text = `UPDATE player_data SET active_char = $2 WHERE player_id = $1`;
        const player = [playerid, charname];
        let activechar = await pool.query(text, player);
        return activechar;
    }/*,

    addCurrentQuest: function (playerid, questname) {
        const text = `UPDATE char_data SET quest_current = array_append($2) WHERE player_id = $1`;
        const player = [playerid, questname];
        return pool.query(text, player)
    },

    addCompleteQuest: async function (playerid, questname) {
        const remtext = `UPDATE char_data SET quest_current = array_remove($2) WHERE player_id = $1`;
        const addtext = `UPDATE char_data SET quest_complete = array_append($2) WHERE player_id = $1`;
        const player = [playerid, questname];
        let remadd = await pool.query(remtext, player);
        remadd = await pool.query(addtext, player);
        return remadd;
    }
*/

};
