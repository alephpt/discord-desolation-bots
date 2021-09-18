const support = require('./support.js');
const stats = require('./stats.js');
const character = require('./json/char.json');
const races = require('./json/races.json');
const cs = require('./cs.js');


module.exports = {
    Type : class {
        constructor(player_id, char_name, world, loc, race, sex, lvl, exp, cond, atk, def, 
                focus, align, stats, stat_mod, g_name, active_q, total_q, clan) {
            this.player_id = player_id;
            this.char_name = char_name;
            this.world = world;
            this.loc = loc;
            this.race = race;
            this.sex = sex;
            this.lvl = lvl;
            this.exp = exp;
            this.cond = cond;
            this.atk = atk;
            this.def = def;
            this.focus = focus;
            this.align = align;
            this.stats = stats;
            this.stat_mod = stat_mod;
            this.g_name = g_name;
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
                    let confirmed = await support.compare(response[0], 'y');
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
                if (race) { 
                    if ( race != 'Half-Blood' ) {
                        return race; 
                    } else {
                        let hybrid = await cs.getBreeds(msg);
                        return [race, hybrid];
                    }
                }
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
                return 'melee';
            } else
            if (focus == "🏹") {
                return 'ranged';
            } else
            if (focus == "🪄") {
                return 'magic';
            } else {
                return false;
            }
            return focus;
        }

        // get players stats of choice
        async getStats(msg, racedata) {
            await msg.channel.send("We have to figure out your stats. \nWould you like to proceed with defaults, or play by chance?\nType `YES` for defaults or `ROLL` to test your luck.");

            let choice = await support.userprompt(msg);

            if(!choice) { 
                await msg.channel.send("Well, I'm not waiting forever. Come back when you are better prepared.")
                return false;
            }

            let stat = new stats.Type();

            if (racedata) {
                // if the player chooses to chance it
                if (choice.toLowerCase() === "roll"){
                    // populate list of options 
                    let statsList = await ["Strength", "Dexterity", "Stamina", "Intelligence"]
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

                        await setTimeout( async function() {
                            await msg.channel.send("You rolled a " + roll + ". Choose a stat to apply it to.\n"
                                + "Your options are " + statString);
                        }, 2000);
                        
                        let statchoice = await support.userprompt(msg); 
                        if (!statchoice) {
                            await msg.channel.send("We don't have all day sweet cheeks.") 
                        }

                        statchoice = await support.compare(statchoice, statsList);
                        if (statchoice) {
                            let chosen = false;

                            if (statchoice === "Strength" && !stat.str) {
                                stat.str = await roll;
                                chosen = true;
                                roll = false;
                            } else
                            if (statchoice === "Dexterity" && !stat.dex) {
                                stat.dex = await roll;
                                chosen = true;
                                roll = false;
                            } else
                            if (statchoice === "Stamina" && !stat.sta) {
                                stat.sta = await roll;
                                chosen = true;
                                roll = false;
                            } else
                            if (statchoice === "Intelligence" && !stat.intel) {
                                stat.int = await roll;
                                chosen = true;
                                roll = false;
                            } 

                            if (chosen) {
                                let index = await statsList.indexOf(statchoice);
                                if (index !== -1) {
                                    await statsList.splice(index, 1)
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
                    stat.str = await racedata?.stats_level.str;
                    stat.dex = await racedata?.stats_level.dex;
                    stat.sta = await racedata?.stats_level.sta;
                    stat.intel = await racedata?.stats_level.intel;
                } 

                stat.m_hp = await racedata?.stats_level.m_hp;
                stat.c_hp = await stat.m_hp;
                stat.m_ep = await racedata?.stats_level.m_ep;
                stat.c_ep = await stat?.m_ep;
            }
            if(stat.str && stat.dex && stat.sta && stat.intel) { return stat; }
        }

        // get player alignment
        async getAlign (msg, race) {
            const racedata = await races[race];
            let alignment = await racedata?.alignment_modifier;
            return alignment;
        }
    }
}

