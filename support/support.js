

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

    //
    userprompt: async function (msg) {
        let result = false;
        await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 30000})
            .then(shortmsg => {
                result = shortmsg.first().content;
            }).catch(() => {});      
        return result;
    }
}
