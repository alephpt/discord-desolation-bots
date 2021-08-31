const Discord = require('discord.js');
const player = require('./player.js');
const character = require('./character.js');
const chardat = require('../support/json/char.json')
const support = require('../support/support.js');
const db = require('../support/psql/index.js');

module.exports = {
// CREATE CHARACTER DATA //
    create: async function(msg, client) {
        let welcome = "";

        let channelID = support.createChannel(msg);
        let member = support.member(msg);
        member.roles.add(support.roles("birth"));
        
        if (!(await player.getPlayerData(msg.author.id))) {
            await player.addPlayerData(msg.author.id);
            welcome = "<@" + msg.author.id + ">, Welcome to the World of Desolation!\n"; 
        }

        channelID.then(function(result) {
            client.channels.cache.get(result.id).send(welcome + "Type `.create` to create your player.");
        })
    },

// FINISH CREATION //
    // deletes character creation channel
    join: function(msg, client) {
        member = support.member(msg);
        chan = client.channels.cache.get(msg.channel.id);
        // checks if channel has the appropriate role and user privileges set
        if (chan.permissionOverwrites.get(msg.author.id)){
            member.roles.add(support.roles("alive"));
            member.roles.remove(support.roles("birth"));

            client.channels.cache.get('876317525971980368').send("Welcome <@" + msg.author.id + "> to The World of Desolation");
            chan.delete();
        }

    },

// TESTIES //)
    addchar: async function (msg) {
        let player_data = await player.getPlayerData(msg.author.id);
        if (player_data) {
            let char_count = await player.getCharCount(msg.author.id);
            if (char_count < 3) {
                // start character creation
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
                                let char_id = await db.getCharID(msg.author.id, thisChar.char_name);
                                if (char_id) {
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

    log: async function(msg) {
        let charac = new character.Type();
        await msg.channel.send("go for it");
        let stuff = await charac.getRace(msg);
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

    // get player info from databa)e
    getplayer: async function(msg) {
        embedstring = "";
        let playerdat = await player.getPlayerData(msg.author.id);
        
        if (playerdat) {
            embedstring += "```\n";
            for (let keys in playerdat) {
                let charstring = "";
                if (keys === 'characters') {
                    embedstring += keys + ": ";
                    for (let charid in playerdat[keys]) {
                        let charname = await db.charID2Name(playerdat[keys][charid])
                        embedstring += charname.rows[0].char_name + " ";
                    }
                    embedstring += "\n"
                }
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
        if (playerdata) {
            let something = await db.delPlayer(msg.author.id)
            playerdata = await player.getPlayerData(msg.author.id);
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
                    msg.channel.send("Are you sure?");
                    let response = await support.userprompt(msg);
                    if (response === 'yes') {
                        await db.deleteCharacter(msg.author.id, vars);
                        await player.updateCharNames(msg.author.id);
                        msg.channel.send("RIP " + vars);
                    }
                }
            }
        } else {
            msg.channel.send("I don't know who you're talking about.")
        }
        
    }
}

