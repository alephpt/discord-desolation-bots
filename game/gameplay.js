const enemies = require("../support/json/enemy.json");
const support = require("../support/support.js");
const combat = require("./combat.js");


module.exports = {
    // combat loop
    combat: async function(msg, vars) {
        let challenger = msg.author.id;
        let enemy;

        // if combat mentions a member
        if (msg.mentions.members.first()){
            e = await msg.mentions.members.first()
            enemy = await e.toString();
            await msg.channel.send("<@" + challenger + "> has challenged " + enemy + "!!");
        } else {
            let e = await combat.spawn();
            enemy = e.type;
        }
    
        await msg.channel.send("A " + enemy + " has crossed your path .. \n What will you do?");

        async function combatLoop() {
            let defending = false;
            
            // see if the challenger is attacking
            if (!defending) {
                let damage = await combat.attackTurn(msg, challenger, enemy);
                if (damage) {
                    await msg.channel.send("You did " + damage + "dmg to " + enemy)
                }
            }

        }

        await support.looper(false, combatLoop);
    },

    test: function(msg, vars) {
        msg.channel.send("hello <@" + msg.mentions.members.first() + ">")
    },


// attack function
    attack: function(msg, cmd) {
        let atkdmg = 150;
        if (cmd == 'kamehameha') {
            atkdmg = 2000;
        }

        // if there is an enemy
        if (enemy.type) {
            // initialize health and critical hit status to none
            let critstring = "";
            // if the enemies health is is greater than 0
            if (enemy.health > 0) {
                msg.channel.send("You attacked a " + enemy.type + "!");
                let critcheck = Math.floor(Math.random() * 100);
                
                setTimeout(function() {
                    if (critcheck > 85) {
                        attackdmg = atkdmg + Math.floor(Math.random() * (atkdmg / 4));
                        critstring = "Critical Hit!\n";
                    } else {
                        attackdmg = atkdmg + Math.floor(Math.random() * (atkdmg / 4)) - Math.floor(Math.random() * (atkdmg / 4));
                    }

                    if ( attackdmg > enemy.health ) { attackdmg = enemy.health }
                    enemy.health = JSON.stringify(enemy.health - attackdmg);

                    msg.channel.send(critstring + "You dealt " + attackdmg + " dmg. \nThe " + enemy.type + " has " + enemy.health + " hp.");

                    if (enemy.health <= 0) {
                        msg.channel.send("You Killed a " + enemy.type + " and gained " + enemy.exp + ", and found "
                            + enemy.items + "!");
                        enemy = {};
                    }
                }, 1000);
            }
        } else {
            msg.channel.send("Find an enemy before trying to attack!");
        }
    },
}
