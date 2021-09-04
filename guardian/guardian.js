const Discord = require('discord.js');
const player = require('../support/player.js');
const character = require('./character.js');
const chardat = require('../support/json/char.json')
const support = require('../support/support.js');
const db = require('../support/psql/index.js');

module.exports = {

// START CHARACTER CREATION //
    addchar: async function (msg) {
        let player_data = await player.getPlayerData(msg.author.id);
        if (player_data) {
            let char_count = await player.getCharCount(msg.author.id);
            if (char_count < 3) {
                // prompt the user
                await msg.channel.send("Are you ready?");
                let shortmsg = await support.userprompt(msg);

                if (!shortmsg) {
                    await msg.channel.send("Your response time is too slow.. try paying attention this time.");
                    return;
                } else
                if (shortmsg[0].toLowerCase() === 'y') {
                    // instantiate player class
                    let thisChar = new character.Type();

                    // get player id
                    thisChar.player_id = msg.author.id;

                    // get character name
                    thisChar.char_name = await thisChar.getCharName(msg);

                    // get character sex
                    if (thisChar.char_name) { 
                        thisChar.sex = await thisChar.getSex(msg);

                        // get character race
                        if (thisChar.sex) {
                            thisChar.race = await thisChar.getRace(msg);
                            
                            // populate beginner attributes
                            if(thisChar.race) {
                                thisChar.level = 1;
                                thisChar.world = "starter";
                                thisChar.loc = support.locIndex(20, 20);
                                thisChar.discipline = 'none';
                                thisChar.mastery = 'locked';
                                thisChar.alignment = 'neutral';
                                thisChar.group_name = 'none';
                                thisChar.quest_current = ['Genesis'];
                                thisChar.clan = 'none';

                                // UPDATE DATABASE //
                                if (thisChar.char_name != false) {
                                   // add new character to database
                                    await db.addNewChar(thisChar);

                                    // set new character as active character
                                    let activechar = await db.setActiveChar(msg.author.id, thisChar.char_name);

                                    // update players character list
                                    await player.updateCharNames(msg.author.id);

                                    await msg.channel.send("Well, " + thisChar.char_name + ". It is time for you to `.join` the fight!");
                                }
                            }
                        } else {
                            msg.channel.send("Well, we almost got somewhere.\nTry starting over.");
                        }
                    } else {
                        msg.channel.send("You failed the simplest of tasks.\nStart over.");
                    }
                } else if (shortmsg.toLowerCase() === 'no') {
                    msg.channel.send("Stop Wasting My Time.");
                } else {
                    msg.channel.send("That isn\'t an option.");
                }
            } else {
                msg.channel.send("You have too many characters.");
                // delete this channel
                return false;
            }
        } else {
            msg.channel.send("Why are you here?!");
        }

   },

/// TEST FUNCTION ///

    log: async function(msg) {
        let charac = new character.Type();
        await msg.channel.send("go for it");
        let stuff = await charac.getCharName(msg);
        await msg.channel.send("Test: \n" + stuff);
    },


// DB HANDLERS //
    // add new player to database
    addplayer: async function(msg) {
//        let playerdata = await player.addPlayerData(msg.author.id);
        if (await player.addPlayerData(msg.author.id)) {
            msg.channel.send("Player <@" + support.member(msg) + "> added.");
        } else {
            msg.channel.send("Player already exists. No cheating!");
        }
    },

    // get player info from database
    getplayer: async function(msg) {
        embedstring = "";
        let playerdat = await player.getPlayerData(msg.author.id);
        
        // if the player exists
        if (playerdat) {
            embedstring += "```\n";
            // for pair of player data
            for (let keys in playerdat) {
                let charstring = "";
                // if it's the character data
                if (keys === 'characters') {
                    embedstring += keys + ": ";
                    // for characters in character data
                    for (let charid in playerdat[keys]) {
                        //get the character name
                        let charname = await db.charID2Name(playerdat[keys][charid])
                        embedstring += charname.rows[0].char_name + " ";
                    }
                    embedstring += "\n"
                }
                // and as long as it's not the player id, or table id
                // get that info too
                else if (keys !== 'id' && keys !== 'player_id') {
                    embedstring += keys + ": " + playerdat[keys] + "\n"
                } 
            }
            embedstring += "```\n";
            
            embedded = new Discord.MessageEmbed()
               .setTitle(msg.author.tag + " Player Data")
               .setDescription( embedstring );

            msg.channel.send(embedded);    
        } else {
            msg.channel.send("You are not a player");
        }
    },

    // delete player from database
    delplayer: async function(msg) {
        let playerdata = await player.getPlayerData(msg.author.id);
        // if the player exists
        if (playerdata) {
            // delete em
            let something = await db.delPlayer(msg.author.id)
            playerdata = await player.getPlayerData(msg.author.id);
            // if he no longer exists lemme know
            if(!playerdata) {
                msg.channel.send("Player <@" + support.member(msg) + "> deleted.");
            }
        } else {
            msg.channel.send("I don't know who that is.");
        }

    },

    // get character info
    getchar: async function(msg) {
        let pd = await db.getCharacters(msg.author.id);
        embedstring = "";
        
        if (pd.rows[0]) {
            for (let chars in pd.rows){
                embedstring += "```\n";
                for (let keys in pd.rows[chars]) {
                    if (keys !== 'id' && keys !== 'modified' &&
                        keys !== 'player_id' && pd.rows[chars][keys] !== 'locked') {
                        embedstring = embedstring +  keys + ": " + pd.rows[chars][keys] + "\n";
                    }
                }
                embedstring += "```\n";
            }

            embedded = new Discord.MessageEmbed()
                .setTitle(msg.author.tag + " Character Data:")
                .setDescription( embedstring );
 
            msg.channel.send(embedded);
        } else {
            msg.channel.send("You have no character.");
        }
    },

    // delete character
    delchar: async function(msg, vars) {
        let pd = await db.getCharacters(msg.author.id);
        if(pd.rows[0]){
            for (let chars in pd.rows){
                if (pd.rows[chars].char_name === vars){
                    await msg.channel.send("You are about to delete " + vars + ".\nType `YES` in capital letters to continue.\nWarning: This Is Irreversable.");
                    let response = await support.userprompt(msg);
                    if (response === 'YES') {
                        await db.deleteCharacter(msg.author.id, vars);
                        await player.updateCharNames(msg.author.id);
                        await player.updateActiveChar(msg.author.id);
                        msg.channel.send("RIP " + vars);
                    }
                }
            }
        } else {
            await msg.channel.send("I don't know who you're talking about.")
        }
        
    }
}

