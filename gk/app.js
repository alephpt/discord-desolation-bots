const Discord = require('discord.js');
const gate = require('./gatekeeper.js');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready' , () => {
    console.log('Gate Keeper: \nNone Shall Pass!');
});

client.on('message', (msg) => {
    let [, cmd, vars] = msg.content.match(/^(?:\.(\S+)(?:\s+(.+))?$)?/s);
    
    if (cmd) { cmd = cmd.toLowerCase() }

    switch (cmd) {
// CHARACTER CREATION PROCESS//
        case "start":
            gate.create(msg, client);
            break;
        case "create":
            gate.addchar(msg);
            break;       
        case "join":
            gate.join(msg, client);
            break;
        case "getplayer":
            gate.getplayer(msg);
            break;
        case "addplayer":
            gate.addplayer(msg);
            break;
        case "delplayer":
            gate.delplayer(msg);
            break;
        case "getchar":
            gate.getchar(msg);
            break;
        case "delchar":
            gate.delchar(msg, vars);
            break;
        case "log":
            gate.log(msg);
            break;
    }
});

client.login(process.env.GKTOKEN)
