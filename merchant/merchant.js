const Discord = require(`discord.js`);
//const items = require('../support/json/items.js')


module.exports = {
  buy: function (msg, vars){
    if (vars) {
      msg.channel.send(`I do not have any items to sell you right now.`);
    } else {
      msg.channel.send(`What do you want?!`);
    }
  },

  sell: function (msg, vars) {
    msg.channel.send(`shops closed. \nI'm not buying! Go away!`);

  }

};


