

module.exports = {
    roles: function (roleit) {
        if (roleit === "pergatory") { return "877428007663448074"; }
        else if (roleit === "alive") { return "877418521196392458"; }
        else if (roleit === "birth") { return "877418367387058236"; }
        else { return null; }
    },

// returns member data from message author
    member: function (msg) {
        member = msg.guild.members.cache.find(({user: {username, discriminator}}) =>
                `${username}#${discriminator}` === msg.author.tag,)
        return member
    }

}
