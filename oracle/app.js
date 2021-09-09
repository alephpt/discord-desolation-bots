const Discord = require('discord.js');
const oracle = require('./oracle.js');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready' , () => {
    console.log('The Oracle: \nLet The Magic Begin!');
});

client.on('message', (msg) => {
    const [, cmd, vars] = msg.content.toLowerCase().match(/^(?:\.(\S+)(?:\s+(.+))?$)?/s);

    switch (cmd) {
// SERVER RELATED FUNCTIONS //
        case "start":
            oracle.start(msg, client);
            break;
        case "join":
            oracle.join(msg, client);
            break;
        case "msgme":
            oracle.msgme(msg, client);
            break;
        case "addme":
            oracle.addme(msg, vars);
            break;
        case "delme":
            oracle.delme(msg, vars);
            break;
        case "rolecache":
            oracle.rolecache(msg, Discord);
            break;
        case "cmd":
            oracle.cmd(msg, vars, client);
            break;
        case "chtab":
        case "ftab":
            oracle.stats(msg, cmd, vars);
            break
    }
});

client.login(process.env.ORACLE)
