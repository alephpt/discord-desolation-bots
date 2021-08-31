const map = {
    "width" : 100,
    "height" : 50
};

module.exports = {
    // gimme roles
    roles: function (roleit) {
        if (roleit === "pergatory") { return "877428007663448074"; }
        else if (roleit === "alive") { return "877418521196392458"; }
        else if (roleit === "birth") { return "877418367387058236"; }
        else { return null; }
    },

    // returns member object from message author
    member: function (msg) {
        member = msg.guild.members.cache.find(({user: {username, discriminator}}) =>
                `${username}#${discriminator}` === msg.author.tag,)
        return member
    },

    // awaits a message from a user and returns the content of the message
    userprompt: async function (msg) {
        let result = false;
        await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 30000})
            .then(async shortmsg => {
                result = await shortmsg.first().content;
            }).catch(() => {});      
        return result;
    },

    reactprompt: async function (msg) {
        let result = await msg.awaitReactions(m => m, {max: 1, time: 30000})
            .then(collected => {
                let reaction = collected.first();
                if (reaction) {
                    return reaction._emoji.name;
                } else {
                    return false;
                }
            }).catch(() => {});
        return result;
    },

    // ROLL THE DIE //
    roll: function(msg, die) {
        if (!die) {
            die = "2d6";
        }
        if (die) {
            dieCount = parseInt(die.slice(0, 1), 10);
            dieSides = parseInt(die.slice(2, die.length), 10);

            diestring = "You rolled "
            lowest = dieSides;
            totalroll = 0;

            for (var i = 0; i < dieCount; ++i) {
                roll = Math.floor(Math.random() * dieSides) + 1;

                if (roll < lowest) { lowest = roll; };

                totalroll += roll;
                if (i < dieCount - 1 ) { diestring = diestring + roll + ", "; }
                else { diestring = diestring + "and " + roll; }
            }

            msg.channel.send(diestring);
            msg.channel.send("Roll Total: " + totalroll + "\nTop " + (dieCount - 1) + " Total: " + (totalroll - lowest));
        } else {
        msg.channel.send("Please enter a valid input i.e. `3d8`, `2d6`, `7d4`, etc.");
        }
    },

    // create channel for character creation
    createChannel: function(msg) {
        channelName = msg.author.tag + " Character Creation"
        channelID = msg.guild.channels.create(channelName, {
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
        return channelID
    },

    locIndex: function(x, y) {
        return (y * map.width + x);
    },

    xyVals: function (index) {
        return [(Math.floor(index % map.width)), (Math.floor(index / map.width))];
    },

    looper: async function (func) {
        let res = false;
        while (!res) { res = await func(); }
        return res;
    },

    compare: function (input, list) {
        for (let i = 0; i < list.length; i++){
            if (input.toLowerCase() == list[i].toLowerCase()) {
                return input;
            }
        }
        return false;
    }
}
