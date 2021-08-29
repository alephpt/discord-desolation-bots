const enemies = require("../support/json/enemy.json");

let enemy = {};

module.exports = {

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

// spawn me an enemy 
    spawn: function(msg) {
        enemy = enemies[Math.floor(Math.random() * enemies.length)];
        msg.channel.send("A wild " + enemy.type + " appeared! Gotta Catch Em All!");
    }

}
