const db = require (`./psql/index.js`);


module.exports = {
  Type : class {
    constructor (player_id, active_char,) {
      this.player_id = player_id;
      this.active_char = active_char;

    }
  },

  // returns player json obj from player_data if it exists
  async getPlayerData(id) {
    let playerdata = await db.getPlayer(id);
    if ( playerdata.rows[0]?.player_id === id ) {
      return playerdata.rows[0];
    } else {
      return false;
    }
  },

  // inserts player data into player_data
  async addPlayerData (id) {
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
  },

  async updateActiveChar (id) {
    let result;
    let activeChar = await db.getActiveChar(id);
    let chars = await db.getCharacters(id);
    let char_count = await chars.rowCount;

    if (char_count === 0) {
      result = await db.setActiveChar(id, null);
    } else {
      let charname = await db.charID2Name(chars.rows[0].id);
      result = await db.setActiveChar(id, charname.rows[0].char_name);
    }
    return result;
  }
};
