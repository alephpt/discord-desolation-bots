const support = require('../support/support.js');

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
      /*  async getCharName(msg) {
            if (!this.nameset) {
                await msg.channel.send('What should we call you?').then(async () => {
                    support.userprompt(msg).then(async char_name => {
                        this.char_name = await char_name;
                        await msg.channel.send("Well Hello, " + this.char_name + ". Are you happy with this name?")
                            .then( async () => {
                                support.userprompt(msg).then(async answer => {
                                    if (answer.toLowerCase() === 'yes') {
                                        this.nameset = true;
                                    } else {
                                        this.getCharName(msg);
                                    }
                                })        
                        });
                    })
                })
            }
        }*/
        async  getCharName(msg) {
            await msg.channel.send('What should we call you?')
            let char_name = await support.userprompt(msg)
            if (!char_name) {
                await msg.channel.send('Timed out...')
                return false
            }
            await msg.channel.send("Well Hello, " + char_name + ". Can you live with this name?\nThere's no going back after this.")
            let shortmsg = await support.userprompt(msg)
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
    }
}
