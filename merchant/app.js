const Discord = require('discord.js');
const market = require('./merchant.js');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready' , () => {
    console.log('Merchant: \nYou cannot buy peace of mind.');
});

client.on('message', (msg) => {
    const [, cmd, vars] = msg.content.toLowerCase().match(/^(?:\.(\S+)(?:\s+(.+))?$)?/s);

    switch (cmd) {
        case "wtb":
            market.buy(msg,vars);
            break;
        case "wts":
            market.sell(msg, vars);
            break;
    }
});

client.login(process.env.MERCHANT);
