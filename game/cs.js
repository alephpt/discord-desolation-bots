const support = require('../support/support.js');
const player = require('../support/player.js');

// COMBAT SUPPORT FUNCTIONS //

const attacks = ['punch', 'slap', 'kick'];
const defenses = ['evade', 'dodge', 'parry'];

module.exports = {
    combatives: async function (msg, combatant, moves) {
        let combat = false;
        if (player.getPlayerData(combatant)){
            let combatPrompt = await support.combatprompt(msg, combatant)
            if (combatPrompt) {
                combat = await support.compare(combatPrompt, moves)
            }
        }
        return combat;
    },

     memberName: async function (target) {
        let nickname;
        
        if (target?.author?.id){
            target = await support.member(target)
        }

        if (target.nickname === null) {
            nickname = target.user.username
        } else {
            nickename = target.nickname
        }
    }

}


