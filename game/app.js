const Discord = require('discord.js');
const gameplay = require('./gameplay.js');
const map = require("./map.js")
const support = require('../support/support.js')
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
                support.roll(msg, vars)
            }, 2000);
            break;
        case "test":
            gameplay.test(msg, vars);
            break;
        case "combat":
            gameplay.combat(msg);
            break;
        case "kamehameha":
        case "atk":
            gameplay.attack(msg, cmd);
            break;
        case "map":
            map.draw(msg);
            break;
        case "move":
            map.move(msg, vars);
            break;
        case "respawn":
            map.respawn(msg);
            break;
    }
});

client.login(process.env.GAMEMASTER)
