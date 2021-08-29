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
        case "begin":
            gate.create(msg, client);
            break;
        case "start":
            gate.birth(msg, client);
            break;
        case "player":
        case "focus":
            gate.stats(msg, cmd, vars);
            break;
        case "add":
            gate.addchar(msg);
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
        case "delchar":
            gate.delchar(msg, vars);
            break;
 
    }
});

client.login(process.env.GKTOKEN)
