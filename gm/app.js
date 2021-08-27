const Discord = require('discord.js');
const gameplay = require('./gameplay.js');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready' , () => {
    console.log('Game Master: \nPlay Stupid Games, Get Stupid Prizes!');
});

client.on('message', (msg) => {
    const [, cmd, vars] = msg.content.toLowerCase().match(/^(?:\.(\S+)(?:\s+(.+))?$)?/s);

    switch (cmd) {
// GAMEPLAY COMMANDS //
        case "roll":
            msg.channel.send("Rolling...")
            setTimeout(function () {
                gameplay.throwdie(msg, vars)
            }, 2000);
            break;
        case "kamehameha":
        case "atk":
            gameplay.attack(msg, cmd);
            break;
        case "spawn":
            gameplay.spawn(msg);
            break;

    }
});

client.login(process.env.GMTOKEN)
