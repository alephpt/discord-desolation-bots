const { Pool, Client } = require("pg");

const creds = {
    user: "sister",
    host: "localhost",
    database: "desolation",
    password: "desolate",
    port: 5432,
};

const pool = new Pool(creds);

/*
async function poolDemo(){
    const now = await pool.query("SELECT NOW()");
    await pool.end();

    return now;
}

async function clientDemo(){
    const client = new Client(creds);
    await client.connect();
    const now = await client.query("SELECT NOW()");
    await client.end();

    return now;
}
*/

module.exports = {
    addPlayer: function (player) {
        const text = `
            INSERT INTO players (player_id, char_name, level, race, focus, mastery, discipline, quest)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;

        const values = [player.player_id, player.char_name, player.level, player.race, 
            player.focus, player.mastery, player.discipline, player.quest];
        return pool.query(text, values);
    },

    getPlayer: function (playerid) {
        const text = `SELECT * FROM players WHERE player_id = $1`;
        const values = [playerid];
        return pool.query(text, values);
    },

    changePlayerName: function (playerid, newname) {
        const text = `UPDATE players SET char_name = $2 WHERE player_id = $1`;
        const values = [personID, fullname];
        return pool.query(text, values);
    },

    deletePlayer: function (playerid) {
        const text = `DELETE FROM players WHERE id $1`;
        const values = [playerid];
        return pool.query(text, values);
    },
};
