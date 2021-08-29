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
            INSERT INTO player_data (player_id, char_count, join_date) OVERRIDING SYSTEM VALUE
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

    addNewChar: function (character) {
        const text = `
            INSERT INTO char_data (id, char_name, level, race, alignment, mastery, discipline, group_name, quest)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;

        const values = [player.player_id, player.char_name, player.level, player.race, 
            player.alignment, player.mastery, player.discipline, player.group, player.quest];
        return pool.query(text, values);
    },

    getChars: async function (playerid) {
        const text = `SELECT * FROM char_data WHERE player_id = $1`;
        let player = [playerid];
        const chardata = await pool.query(text, player);
        return chardata;
    },

    changeCharacterName: function (playerid, newname) {
        const text = `UPDATE players SET char_name = $2 WHERE id = $1`;
        const values = [playerid, newname];
        return pool.query(text, values);
    },

    deleteCharacter: function (playerid, charname) {
        const text = `DELETE FROM players WHERE id = $1 AND char_name = $2`;
        const player = [playerid, charname];
        return pool.query(text, player);
    },

    addQuest: function (playerid, questname) {
        const text = `UPDATE players SET quest = array_append($2) WHERE id = $1`;
        const player = [playerid, questname];
        return pool.query(text, player)
    }
};
