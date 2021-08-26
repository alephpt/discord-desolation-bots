const Discord = require('discord.js');
const gate = require('./gatekeeper.js');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready' , () => {
    console.log('Game Keeper: \nNone Shall Pass!');
});

client.on('message', (msg) => {
    const [, cmd, vars] = msg.content.toLowerCase().match(/^(?:\.(\S+)(?:\s+(.+))?$)?/s);

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
            gate.stats(msg, cmd, vars, Discord);
            break;
        case "add":
            gate.addplayer(msg);
            break;
 
    }
});

client.login(process.env.GKTOKEN)
