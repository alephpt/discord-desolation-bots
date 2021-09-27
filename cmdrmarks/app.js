const Discord = require('discord.js');
const marks = require('./marks.js');
const extra = require('../support/extra.js');
const bot = "marks";
require('dotenv').config();

const client = new Discord.Client();

client.on('ready' , () => {
    console.log('CMDR Marks: \nReporting for Service!');
});

client.on('message', async (msg) => {
    const [, cmd, vars] = msg.content.toLowerCase().match(/^(?:\.(\S+)(?:\s+(.+))?$)?/s);
    if (msg.author == client.user || msg.author.bot) {return};
    
    let commander, command, result;
    if (cmd) {
        [commander, command, result] = await extra.check(cmd);
    }

    switch (cmd) {
        case "help":
            marks.helper(msg, vars);
            break;       
        case command:
            marks.clogger(msg, client, commander, cmd, result);
            break;

    }
});

client.login(process.env.CMDR);
