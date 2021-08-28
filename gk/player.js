const support = require('../support/support.js');
const character = require('../support/json/char.json');

module.exports = {
    Type : class {
        // VARIABLES 
        nameset = false;
        
        constructor(player_id, char_name, level, race, alignment, mastery, discipline, quest) {
            this.player_id = player_id;
            this.char_name = char_name;
            this.level = level;
            this.race = race;
            this.alignment = alignment;
            this.mastery = mastery;
            this.discipline = discipline;
            this.quest = quest;
        }
    

        // get character name
        async  getCharName(msg) {
            await msg.channel.send('What should we call you?');
            let char_name = await support.userprompt(msg);
            if (!char_name) {
                await msg.channel.send('Timed out...');
                return false;
            }
            await msg.channel.send("Well Hello, " + char_name + ". Can you live with this name .. ?\nThere is no going back after this.");
            let shortmsg = await support.userprompt(msg);
            if (!shortmsg) {
                await msg.channel.send('Timed out...')
                return false
            }
            if (shortmsg.toLowerCase() === 'yes') {
                return char_name  
            } else if (shortmsg.toLowerCase() === 'quit') {
                await msg.channel.send(":ban:")
                return false
            } else {
                char_name = await this.getCharName(msg)
                return char_name
            }
        }

        // get player race
        async getRace(msg){
            // format list of races
            let racestring = "";
            for (let races of character.info.race) { racestring = racestring + " - " + races + "\n"};

            await msg.channel.send("In this world, there are many types of creatures .. \n```" + racestring + "``` Which are you?");
            let response = await support.userprompt(msg);
            if(!response) {
                await msg.channel.send('Time Out!');
            } else {
                await msg.channel.send("Well then, " + this.char_name + " the " + response + ".\nType `.start` to finish your character.");
            }
            return response;
        }
    }
}
