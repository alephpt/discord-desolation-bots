const Discord = require('discord.js');
const fun = require('./master.js');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready' , () => {
    console.log('Master of Worlds: \nLet The Magic Begin!');
});

client.on('message', (msg) => {
    const [, cmd, vars] = msg.content.toLowerCase().match(/^(?:\.(\S+)(?:\s+(.+))?$)?/s);

    switch (cmd) {
// SERVER RELATED FUNCTIONS //
        case "msgme":
            fun.msgme(msg, client);
            break;
        case "addme":
            fun.addme(msg, vars);
            break;
        case "delme":
            fun.delme(msg, vars);
            break;
        case "rolecache":
            fun.rolecache(msg, Discord);
            break;
        case "cmd":
            fun.cmd(msg, vars, client);
            break;
    }
});

client.login(process.env.MOWTOKEN)
