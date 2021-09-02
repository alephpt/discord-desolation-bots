const support = require('../support/support.js');
const character = require('../support/json/char.json');


module.exports = {
    Type : class {
        constructor(player_id, char_name, level, sex, race, world, loc, discipline,
                mastery, alignment, group_name, quest_current, quest_complete, clan) {
            this.player_id = player_id;
            this.char_name = char_name;
            this.level = level;
            this.sex = sex;
            this.race = race;
            this.world = world;
            this.loc = loc;
            this.discipline = discipline;
            this.mastery = mastery;
            this.alignment = alignment;
            this.group_name = group_name;
            this.quest_current = quest_current;
            this.quest_complete = quest_complete;
            this.clan = clan;
        }
    

        // get character name
        async getCharName(msg) {
            async function getname(){
                await msg.channel.send('Hello, What should we call you?');
                let char_name = await support.userprompt(msg);
                if (!char_name) {
                    await msg.channel.send('Timed out...');
                    return false;
                }
    
                await msg.channel.send("So it's " + char_name + "..? \nDid I get that right?");
                let response = await support.userprompt(msg);

                if (!response) {
                    await msg.channel.send('Timed out...');
                    return false;
                } else {
                    let confirmed = await support.compare(response[0].toLowerCase(), 'y');
                    if (confirmed) {
                        return char_name;
                    }
                }
            }
            let result = support.looper(false, getname);
            return result;
       }
  
        async getSex(msg){
            const filter = (reaction, user) => user.id == msg.author.id;
            
            let sexting = await msg.channel.send("What is your Sex?", {fetchReply:true});
            await sexting.react('♂️');
            await sexting.react('♀️');

            let sex = await support.reactprompt(sexting); 

            if (!sex) {
               await msg.channel.send('Too slow...'); 
            }
            if (sex == '♂️') {
                return 'Male';
            } else 
            if (sex === '♀️') {
                return 'Female';
            } else {
                return false;
            }
            return sex;
        }

        // get player race
        async getRace(msg){
            // format list of races
            let racestring = "";
            for (let races of character.info.race) { racestring = racestring + " - " + races + "\n"};

            msg.channel.send("In this world, there are many types of creatures .. ");
            
            async function test(){ 
                await msg.channel.send("```" + racestring + "``` Which are you?");
                let response = await support.userprompt(msg);
                let race = await support.compare(response, character.info.race);
                if (race) { return race; } 
                else { 
                    msg.channel.send("That's not right. Try again."); 
                    return false;
                }
            }

            let result = await support.looper(false, test);
            return result;
        }

    }
}
