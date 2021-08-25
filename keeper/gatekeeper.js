const support = require('../support/support.js');
const character = require('../support/json/char.json');
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

// CREATE PLAYER DATA //
    create: function(msg, client) {
        channelName = msg.author.tag + " Character Creation"
        channelid = msg.guild.channels.create(channelName, {
            type: 'text',
            parent: '877407686700982362',
            permissionOverwrites:[
            { // everyone
                id: '876270357236023316',
                deny:['VIEW_CHANNEL'],
            },
            { // moderator
                id: '876288940351553558',
                allow: ['VIEW_CHANNEL'],
            },
            { // user
                id: msg.author.id,
                allow: ['VIEW_CHANNEL']
            }]
        });

        member = support.member(msg);
        member.roles.add(support.roles("birth"));

        channelid.then(function(result) {
            client.channels.cache.get(result.id).send("<@" + msg.author.id + ">.. Let us begin our journey!");
        })
    },

// FINISH CREATION //
    birth: function(msg, client) {
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

// GIVE ME PLAYER DATA //
    stats: function(msg, cmd, userInput, Discord) {
        let statdat = {};
        let Title = "";
        if (cmd == "player") {
            statdat = character;
            Title = "Character Sheet";
            }
        if (cmd == "focus") {
            statdat = focus;
            Title = "Focus Tree";
        }


        // intialize embed string to blank state
        embedstring = "";
        let header;
        let body;
        let nest = "";

        if (userInput) {
            section = userInput.split(" ")
            if(header = section[0]) {
                if (statdat?.[section[1]] || statdat?.[header]?.[section[1]]) {
                body = section[1];
                }
                if (header === "help") {
                    if (body) {
                        embedstring = "The available " + body + " sections are:"
                        for(key in statdat[body]) {
                            embedstring = embedstring + "\n - **" + key.toUpperCase() + "**";
                        }
                    } else {
                        embedstring = "The available " + cmd + " sections are:"
                        for (key in statdat) {
                            embedstring = embedstring + "\n - **" + key.toUpperCase() + "**";
                        }
                    }
                }
                else if (statdat[header]) {
                    if(body) {
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
