const support = require('./support.js');
const commander = require('./commands.json');
const marks = require('../cmdrmarks/marks.js');



async function check(cmd) {
    let botName, state;

    Object.keys(commander).forEach((bot) => {
        Object.keys(commander?.[bot]).forEach((cat) => {
            Object.keys(commander?.[bot]?.[cat]).forEach((command) => {
                if (cmd === command) {
                    botName = bot;
                    state = true;
                }   
            });
        });
    });

    if (state) {
        return [botName, cmd, state];
    } else {
        return ["marks", cmd, false];
    }
}

module.exports.check = check;
