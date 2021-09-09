
const Discord = require('discord.js');
const support = require('../support/support.js');
const player = require('../support/player.js');
const chardata = require('../support/json/char.json');
const focus = require('../support/json/focus.json');


embedstring = "";

// spans through json data to print all nested object types by key:value pairs
function spanner(chardat, nest) {
    nest = nest + "-";

    Object.keys(chardat).forEach((key) => {
        if (typeof chardat[key] == 'string') {
            embedstring = embedstring + "\n " + nest + " __" + key.toUpperCase() + "__: " + chardat[key];
        } else {
            embedstring = embedstring + "\n\n " + nest + " **"  + key.toUpperCase() + "**: "
            spanner(chardat[key], nest);
        }
    })
}


module.exports = {

// START CHARACTER CREATION //
    // creates creation channel and player object in db
    start: async function(msg, client) {
        let welcome = "";

        let channelID = support.charCreateChannel(msg);
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

// OUTPUT ROLE DATA //
    rolecache: function(msg) {
        msg.channel.send(JSON.stringify(msg.guild.roles.cache));
    },

// ADD ROLE TO USER //
    addme: function(msg, content) {
        if (support.roles(content) != null) {
            member = support.member(msg);
            member.roles.add(support.roles(content));
            msg.channel.send(content + ' added');
        }
    },

// DELETE ROLE FROM USER //
    delme: function(msg, content) {
        if (support.roles(content) != null) {
            member = support.member(msg);
            member.roles.remove(support.roles(content));
            msg.channel.send(content + ' removed');
        } 
    },
    
// SENDS DM FOR ABSOLUTELY NO REASON //
    msgme: function(msg, client) {
        client.users.cache.get(msg.author.id).send('hello <@' + msg.author.id + '>');
    },

// RUN A COMMAND FOR ABSOLUTELY NO REASON //
    cmd: function(msg, content, client) {
        try {
            test = eval(content);
            if (typeof test != 'object' && typeof test != 'undefined') { msg.channel.send(test); }
        } catch(err) {
            msg.channel.send(err);
        }
    },

// GIVE ME PLAYER DATA //
    stats: function(msg, cmd, userInput) {
        let statdat = {};
        let Title = "";
        if (cmd == "chtab") {
            statdat = chardata;
            Title = "Character Sheet";
            }
        if (cmd == "ftab") {
            statdat = focus;
            Title = "Focus Tree";
        }


        // intialize embed string to blank state
        embedstring = "";
        let header;
        let body, footer, statdata;
        let nest = "";

        if (userInput) {
            let section = userInput.split(" ");
            if(header = section[0]) {
                if (statdat?.[section[1]] || statdat?.[header]?.[section[1]]) {
                body = section[1];
                    if (statdat?.[body]?.[section[2]]) {
                        footer = section[2];
                    }
                }
                if (header === "help") {
                    if (body) {
                        embedstring = "The available " + body + " sections are:"
                        if (footer) {
                            statdata = statdat[body][footer];
                        } else {
                            statdata = statdat[body];
                        }
                        for(key in statdata) {
                            embedstring = embedstring + "\n  **" + key.toUpperCase() + "**";
                        }
                    } else {
                        embedstring = "The available " + cmd + " sections are:"
                        for (key in statdat) {
                            embedstring = embedstring + "\n - **" + key.toUpperCase() + "**";
                        }
                    }
                }
                else if (statdat[header]) {
                    if(statdat?.[header]?.[body]) {
                        spanner(statdat[header][body], nest);
                        header += " " + body;
                    } else {
                        spanner(statdat[header], nest);
                    }
                }
                if (header === "help" || statdat[header] || body){
                     embedded = new Discord.MessageEmbed()
                        .setTitle(header.toUpperCase())
                        .setDescription( embedstring );
                   msg.channel.send(embedded)
                } else {
                    msg.channel.send("Invalid Player Input.")
                }
            }
        } else {
            spanner(statdat, nest);
            embedded = new Discord.MessageEmbed()
                .setTitle(Title)
                .setDescription( embedstring );
            msg.channel.send(embedded)

        }
    }
    
}
