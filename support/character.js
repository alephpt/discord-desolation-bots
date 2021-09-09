const support = require('./support.js');
const stats = require('./stats.js');
const character = require('./json/char.json');
const races = require('./json/races.json');

// put to races together
async function halfblood(race1, race2) {
    // get first and second race data and grab empty half-blood object
    let f_race = await races[race1];
    let s_race = await races[race2];
    let half_blood = await races["Half-Blood"];

    // iterate through each section of the half-blood object
    Object.keys(half_blood).forEach((key) => {
        // if it's the description, concatonate and modify
        if (key === "description") {
            half_blood.description = f_race.description + " " + s_race.description + "This is what happens when the two meet.";
        } else 
        // if it's racial abilities, pick random abilities from each race randomly 
        if (key === "racial_abilities") {
            half_blood.racial_abilities = {};
            let key, value; // blank object
            let itsNew = true;

            // lengths for each races abilities and sum of both
            fRaceLength = Object.keys(f_race.racial_abilities).length;
            sRaceLength = Object.keys(s_race.racial_abilities).length;
            abilityLength = Math.floor((fRaceLength + sRaceLength) / 2);
            
            // for each ability
            for (let abilityCount = 0; abilityCount < abilityLength; abilityCount++) {  
                // choose random numbers
                let ability = Math.floor(Math.random() * abilityLength + 1);
                let racist = Math.floor(Math.random() * 100 + 1);
                
                // grab the ability within the length of the random races ability list
                if (racist % 2 === 0) {
                    key = Object.keys(f_race.racial_abilities)[ability % fRaceLength];
                    value = f_race.racial_abilities[key];
                } else {
                    key = Object.keys(s_race.racial_abilities)[ability % sRaceLength];
                    value = s_race.racial_abilities[key];
                }
                
                // make sure the ability already hasn't been chosen, and decrease abilityCount if so
                for (let newAbilities = 0; newAbilities < abilityCount; newAbilities++){
                    if (Object.keys(half_blood.racial_abilities)[newAbilities] !== key) {
                        itsNew = true;
                    } else {
                        abilityCount--;
                    }
                }

                if(itsNew){
                    half_blood.racial_abilities[key] = value;
                    itsNew = false;
                }
            }
        } else
        // combine stats
        if (key === "stats_level") {
            Object.keys(half_blood.stats_level).forEach((stat) => {
                half_blood.stats_level[stat] = Math.round((Number(f_race.stats_level[stat]) + Number(s_race.stats_level[stat])) / 2).toString();
            })
        } else
        if (key === "stats_modifier") {
            Object.keys(half_blood.stats_modifier).forEach((stat) => {
                half_blood.stats_modifier[stat] = Math.round((Number(f_race.stats_modifier[stat]) + Number(s_race.stats_modifier[stat])) / 2).toString();
            })
        } else
        // randomly pick which race is dominant and pull alignment points from both
        if (key === "alignment_modifier") {
            half_blood.alignment_modifier = {};
            let randomNum = Math.floor(Math.random() * 100 + 1);

            if (randomNum < 50) {
                firstAlign =  f_race.alignment_modifier;
                segundaAlign = s_race.alignment_modifier;
            } else {
                firstAlign =  s_race.alignment_modifier;
                segundaAlign = f_race.alignment_modifier;
            }

            // for each alignment group
            Object.keys(firstAlign).forEach((align1) => {
                let match = false;
                Object.keys(segundaAlign).forEach((align2) => {
                    // if the alignments are a match then pull the sum, or else cut them in half and floor
                    if (align2 === align1) {
                        half_blood.alignment_modifier[align1] = Math.round((Number(firstAlign[align1]) + Number(segundaAlign[align2])) / 2).toString();
                        match = true;
                    } else { 
                        let determinant = Math.floor(Number(segundaAlign[align2]) / 2);
                        if (determinant > 0) {
                            half_blood.alignment_modifier[align2] = determinant.toString();
                        }
                    }
                })
                // primary race gets + 1 / 2 and floored (basically they 1 point from the first set nomatter what
                if (!match) {
                    let determinant = Math.floor((Number(firstAlign[align1]) + 1) / 2);
                    if (determinant > 0) {
                        half_blood.alignment_modifier[align1] = determinant.toString();
                    }
                }
            })       
        } else
        if (key === "focus_modifier") {
            Object.keys(half_blood.focus_modifier).forEach((focus) => {
                half_blood.focus_modifier[focus] = Math.round((Number(f_race.focus_modifier[focus]) + Number(s_race.focus_modifier[focus])) / 2).toString();
            })
        }

    })

    return half_blood;
}

module.exports = {
    Type : class {
        constructor(player_id, char_name, world, loc, lvl, race, sex, focus, align, stats, 
                group_name, active_q, total_q, clan) {
            this.player_id = player_id;
            this.char_name = char_name;
            this.world = world;
            this.loc = loc;
            this.lvl = lvl;
            this.race = race;
            this.sex = sex;
            this.focus = focus;
            this.align = align;
            this.stats = stats;
            this.group_name = group_name;
            this.active_q = active_q;
            this.total_q = total_q;
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

        // get player focus of choice
        async getFocus(msg){
            let focusing = await msg.channel.send("Which discipline do you intend  to follow?", {fetchReply:true});
            await focusing.react('⚔️');
            await focusing.react('🏹');
            await focusing.react('🪄');

            let focus = await support.reactprompt(focusing);

            if(!focus) {
                await msg.channel.send('You won\'t fair well in combat. Start over.');
            }
            if (focus == "⚔️") {
                return 'Melee';
            } else
            if (focus == "🏹") {
                return 'Ranged';
            } else
            if (focus == "🪄") {
                return 'Magic';
            } else {
                return false;
            }
            return focus;
        }

        // get players stats of choice
        async getStats(msg, race) {
            await msg.channel.send("We have to figure out your stats. \nWould you like to proceed with defaults, or play by chance?\nType `YES` for defaults or `ROLL` to test your luck.");

            let choice = await support.userprompt(msg);

            if(!choice) { 
                await msg.channel.send("Well, I'm not waiting forever. Come back when you are better prepared.")
                return false;
            }

            let stat = new stats.Type();
            if (race.toLowerCase() != "half-blood"){
                let racedata = races[race];

                // if the player chooses to chance it
                if (choice.toLowerCase() === "roll"){
                    // populate list of options 
                    let statsList = ["Strength", "Dexterity", "Stamina", "Intelligence"]
                    let roll;
                    // function to present options
                    async function chance() {
                        let statString = "";
                        // get list of remaining stats
                        for (let i = 0; i < statsList.length; i++){
                            statString += statsList[i]
                            if (i < statsList.length - 1){
                                statString += ", "
                            } else {
                                statString += "."
                            }
                        }

                        // roll if you haven't 
                        if (!roll) { 
                            roll = await support.roll();
                            await msg.channel.send("Rolling..")
                        }

                        await setTimeout( function() {
                            msg.channel.send("You rolled a " + roll + ". Choose a stat to apply it to.\n"
                                + "Your options are " + statString);
                        }, 2000);
                        
                        let statchoice = await support.userprompt(msg); 
                        if (!statchoice) {
                            msg.channel.send("We don't have all day sweet cheeks.") 
                        }

                        statchoice = await support.compare(statchoice, statsList);
                        if (statchoice) {
                            let chosen = false;

                            if (statchoice === "Strength" && !stat.strength) {
                                stat.strength = roll;
                                chosen = true;
                                roll = false;
                            } else
                            if (statchoice === "Dexterity" && !stat.dexterity) {
                                stat.dexterity = roll;
                                chosen = true;
                                roll = false;
                            } else
                            if (statchoice === "Stamina" && !stat.stamina) {
                                stat.stamina = roll;
                                chosen = true;
                                roll = false;
                            } else
                            if (statchoice === "Intelligence" && !stat.intelligence) {
                                stat.intelligence = roll;
                                chosen = true;
                                roll = false;
                            } 

                            if (chosen) {
                                let index = await statsList.indexOf(statchoice);
                                if (index !== -1) {
                                    statsList.splice(index, 1)
                                }
                            } else {
                                await msg.channel.send("Invalid Option. Try Again.");
                            }
                        } else {
                            await msg.channel.send("Choose from the list of options.");
                        }
                        if (statsList.length === 0) { return true; }
                    }
                    let choicestatus = await support.looper(false, chance)
                } else
                if (choice.toLowerCase() === "yes"){
                    // get stats from race
                    stat.strength = racedata?.stats_level.STRENGTH;
                    stat.dexterity = racedata?.stats_level.DEXTERITY;
                    stat.stamina = racedata?.stats_level.STAMINA;
                    stat.intelligence = racedata?.stats_level.INTELLIGENCE;
                } 

                stat.max_health = racedata?.stats_level.MAX_HEALTH;
                stat.current_health = stat.max_health;
                stat.max_energy = racedata?.stats_level.MAX_ENERGY;
                stat.current_energy = stat?.max_energy;
            }
    
            stat.exp = 100;
            stat.condition = 'good'

            stat.attack = 0
            stat.defense = 0
            
            return stat
        }

        // get player alignment
        async getAlign (msg, race) {
            const racedata = await races[race];
            let alignment = await racedata?.alignment_modifier;
            return alignment;
        }
    }
}

module.exports.halfblood = halfblood;
