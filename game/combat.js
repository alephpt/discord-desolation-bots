const support = require(`../support/support.js`);
const player = require(`../support/player.js`);
const enemies = require(`../support/json/enemy.json`);
const cs = require(`./cs.js`);

const attacks = [`punch`, `slap`, `kick`];
const defenses = [`dodge`, `evade`, `counter`];

module.exports = {

  spawn: async function() {
    let enemy = await enemies[Math.floor(Math.random() * enemies.length)];
    return enemy;
  },

  sequence: async function(msg, attacker, defender) {

    let attack = await cs.combatives(msg, attacker, attacks);

    if (attack) {
      let ctime = Date.now();
      await msg.channel.send(`You performed **` + attack + `**\nNow rolling..`);

      if (await support.elapsed(ctime)) {
        console.log(defender);
        let defense = await cs.combatives(msg, defender, defenses);
        if (defense) {
          return false;
        }
      }
      return true;
    } else {
      return null;
    }
  },

  combatUpdate: async function(msg, attack, attacker, defender, defending) {
    if (attack === true) {
      await msg.channel.send(`**` + attacker + `** just attacked **` + defender + `**`);
      return !defending;
    } else
    if (attack === false) {
      await msg.channel.send(`**` + defender + `** just stopped the attack!`);
      return !defending;
    }
    else { return defending; }
  }
};
