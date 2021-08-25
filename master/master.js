const fs = require('fs');
const support = require('../support/support.js');

module.exports = {


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
        test = eval(content);
        if (test) {
            try {
            msg.channel.send(test)
            }
            catch(err) {
            msg.channel.send(err);
            }
        }
    }
}
