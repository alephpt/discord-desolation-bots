

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
            .then(shortmsg => {
                result = shortmsg.first().content;
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
    }
}
