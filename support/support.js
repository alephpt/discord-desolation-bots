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
        let member = msg.guild.members.cache.find(({user: {username, discriminator}}) =>
                `${username}#${discriminator}` === msg.author.tag,)
        return member
    },

    username: function (msg, usr, dsc) {
        let username = msg.guild.members.cache.find((u => u.id === id))
        return username
    },

    // awaits a message from a user and returns the content of the message
    userprompt: async function (msg) {
        let result = false;
        await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 60000})
            .then(async shortmsg => {
                result = await shortmsg.first().content;
            }).catch(() => {});      
        return result;
    },

    // awaits a message from a user and makes sure the input is valid
    combatprompt: async function (msg, writer) {
        let result = false;
        await msg.channel.awaitMessages(m => m.author.id === writer, {max: 1, time: 1500})
            .then(async shortmsg => {
                result = await shortmsg.first().content;
            }).catch(() => {});
        return result;
    },

    reactprompt: async function (msg) {
        let result = await msg.awaitReactions(m => m, {max: 1, time: 60000})
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
    roll: function(die) {
        if (!die) {
            die = "4d6";
        }
        if (die) {
            dieCount = parseInt(die.slice(0, 1), 10);
            dieSides = parseInt(die.slice(2, die.length), 10);

            lowest = dieSides;
            totalroll = 0;

            for (var i = 0; i < dieCount; ++i) {
                roll = Math.floor(Math.random() * dieSides) + 1;

                if (roll < lowest) { lowest = roll; };

                totalroll += roll;
            }

            return (totalroll - lowest);
        } else {
        }
    },

    // create channel for character creation
    charCreateChannel: function(msg) {
        channelName = msg.author.tag + " Character Creation"
        channelID = msg.guild.channels.create(channelName, {
            type: 'text',
            parent: '877407686700982362',
            permissionOverwrites:[
            { // everyone
                id: '876270357236023316',
                deny:['VIEW_CHANNEL']
            },
            { // moderator
                id: '876288940351553558',
                allow: ['VIEW_CHANNEL']
            },
            { // guardian
                id: '879862149097332776',
                allow: ['VIEW_CHANNEL']
            },
            { // oracle
                id: '876270934183542825',
                allow: ['VIEW_CHANNEL']
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

    // condition holds the func function in the loop
    // if condition is false, while the function returns false
    // loop function until it returns a !false value
    looper: async function (condition, func) {
        let count = 5;
        let time = Date.now();
        while (!condition) { 
            condition = await func(); 
            count = count - 1;
            if (count === 0) { return false; }
        };
        return condition;
    },

    // if the input is a string or int compare it to items in the list
    // otherwise iterate through the input items and look for a math
    // or return false
    compare: async function (input, target) {
        if (target) {
            if (typeof input === 'string' || typeof input === 'int') {
                for (let i = 0; i < target.length; i++){
                    if (input.toLowerCase() === target[i].toLowerCase()) {
                        return await target[i];
                    }
                }
            } else {
                for (let j = 0; j < input.length; input++){
                    for (let i = 0; i < target.length; i++){
                        if (input[j].toLowerCase() === target[i].toLowerCase()){
                            return await target[i];
                        }
                    }
                }
            }
            return false;
        }
    },

    // returns current time
    elapsed: function (time) {
        if (Date.now() < time + 1500) {
            return true;
        } else {
            return false;
        }
    }
}
