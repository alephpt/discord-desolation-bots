const enemies = require("../support/json/enemy.json");
const support = require("../support/support.js");
const combat = require("./combat.js");
const cs = require("./cs.js");

module.exports = {
    // combat loop
    combat: async function(msg, vars, client) {
        let defending = false;
        let enemy, enemyName, enemyID;

        // prompt combat status
        if (enemy = msg.mentions.members.first()){
            pingName = enemy.toString();
            if (enemy.nickname === null) {
                enemyName = enemy.user.username
            } else {
                enemyName = enemy.nickname; 
            }
            enemyID = enemy.id;
            console.log(enemyID);
            await msg.channel.send("<@" + msg.author.id + "> has challenged " + pingName + "!!");
            setTimeout
        } else {
            let enemy = await combat.spawn();
            enemyName = enemy.type;
            enemyID = null;
            await msg.channel.send("A " + enemyName + " has crossed your path .. \n What will you do?");
        }
    

        async function combatLoop() {
            let time, defense;
            // see if the challenger is attacking or defending
            // if attacking
            if (!defending) {
                attackername = msg.author.tag;
                attackerid = msg.author.id;
                enemyname = enemyName;
                enemyid = enemyID;

                let attack = await combat.sequence(msg, attackerid, enemyid);
                    if (attack === true) {
                        await msg.channel.send("**" + attackername + "** just attacked **" + enemyname + "**");
                        defending = true;
                    } else
                    if (attack === false) {
                        await msg.channel.send("**" + enemyname + "** just stopped the attack!");
                        defending = true;
                    }
            } else
            if (defending) {
                attackername = enemyName;
                attackerid = enemyID;
                enemyname = msg.author.tag;
                enemyid = msg.author.id;
                
                let attack = await combat.sequence(msg, attackerid, enemyid);
                if (attack === true) {
                    await msg.channel.send("**" + attackername + "** just attacked **" + enemyname + "**");
                    defending = false;
                } else
                if (attack === false) {
                    await msg.channel.send("**" + enemyname + "** just stopped the attack!");
                    defending = false;
                }
            }
        }

        await support.looper(false, combatLoop);
    },

    test: async function(msg, vars, client) {
        let namespace;
        if (namespace = msg.mentions.members.first()){
            console.log(namespace.nickname)
            msg.channel.send("name = " + namespace.nickname)
        }


        /*
        let sendtime = Date.now();
        await msg.channel.send("go time .. " + sendtime);
        let response = await support.userprompt(msg);
        if (response === "now"){
            let elapsed = Date.now() - sendtime
            if(Date.now() < sendtime + 2000) {
                await msg.channel.send("This works .. " + elapsed)
            } else {
                await msg.channel.send("Too slow .. " + elapsed)
            }
        }
        */
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
