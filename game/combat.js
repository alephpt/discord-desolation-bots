const support = require('../support/support.js');
const player = require('../support/player.js');
const enemies = require('../support/json/enemy.json');


module.exports = {

    attackTurn: async function (msg, attacker, defender) {
        // if the attacker is a player
        if(player.getPlayerData(attacker)) {
            let attackPrompt = await support.combatprompt(msg, attacker)
            if (attackPrompt === 'punch') {
                return 20 + support.roll();
            }
        } 
        else // it's the npc
        {

        }

        return false; 
    },

    spawn: async function() {
        let enemy = await enemies[Math.floor(Math.random() * enemies.length)];
        return enemy;
    }
}
