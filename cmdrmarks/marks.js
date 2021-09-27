const Discord = require('discord.js');
const commander = require('../support/commands.json');
const support = require('../support/support.js');

embedstring = "";

// spans through json data to print all nested object types by key:value pairs
function spanner(commands, nest, mod) {
    nest = nest + "-";
     
    Object.keys(commands).forEach((command) => {
        if (mod || (command != "staff" && command != "broken")) {
            if (typeof commands[command] == 'string') {
                embedstring = embedstring + "\n " + nest + " __" + command + "__: " + commands[command];
            } else {
                if (command != "user" || mod) {
                    embedstring = embedstring + "\n " + nest + " **"  + command.toUpperCase() + "**  - "
                }
                spanner(commands[command], nest, mod);
                embedstring = embedstring + "\n";
            }
        }
    });
}

module.exports = {
    // command list
    async helper (msg, vars) {
        let nest = "";
        embedstring = "";
        let mod = support.mod(support.member(msg));

        if (commander?.[vars]) {
            spanner(commander?.[vars], nest, mod);
        } else {
            spanner(commander, nest, mod);
        }

        if (mod){
            embedstring = "PLEASE **DO NOT** USE **BROKEN** OR **STAFF** COMMANDS!\n" + embedstring;
        }

        let embedded = new Discord.MessageEmbed()
            .setTitle("COMMANDS")
            .setDescription(embedstring);
  
//        console.log(mod?.hoist)
        msg.channel.send(embedded);
//        msg.channel.send("mod: " + mod);
    },

    // command logger 
    async clogger(msg, client, bot, command, result) {
        if(command) {
            let statusColor = '#ff0000';
            let bot_data = await support.bot(msg, bot);

            if (result) { 
                if (result === 'okay') {
                    statusColor = '#557722'
                } else {
                    statusColor = '#0fff7f'; 
                }
            }

            let embedded = new Discord.MessageEmbed()
                .setColor(statusColor)
                .setTitle(command + "@" + msg.channel.name)
                .setThumbnail(bot_data.user.avatarURL())
                .setAuthor(msg.author.tag + " via " + bot_data.user.username, msg.author.avatarURL())
                .setURL(msg.url)
                .setDescription('Command: ' + msg.content);
            
            client.channels.cache.get('891703465598935071').send(embedded);
        }
    }
}


