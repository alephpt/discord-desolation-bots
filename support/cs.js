const support = require('./support.js');
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

async function getBreeds(msg){
    let random = Math.floor((Math.random() * 100) / 2);
    let race1, race2, genetics1, genetics2, genetics3;

    if (random < 22) {
        await msg.channel.send("Give me your races you mutt!");
    } else {
        await msg.channel.send("Choose your breed.");
    }
    let racial = await support.userprompt(msg);

    if (racial) {
        let discrimination = racial.split(" ");
        // if the first word is wood/dark then concat the first and second words into a variable
        if (discrimination[0]?.toLowerCase() === 'wood' || discrimination[0]?.toLowerCase() === 'dark'){
            genetics1 = discrimination[0] + " " + discrimination[1];
        }
        // if the second word is wood/dark then concat the second and third into genetics 2
        if (discrimination[1]?.toLowerCase() === 'wood' || discrimination[1]?.toLowerCase() === 'dark'){
            genetics2 = discrimination[1] + " " + discrimination[2];
        }
        // if the third word is wood/dark then concat third and fourth into genetics 3
        if (discrimination[2]?.toLowerCase() === 'wood' || discrimination[2]?.toLowerCase() === 'dark'){
            genetics3 = discrimination[2] + " " + discrimination[3];
        }
        
        // if the first two words are concatenated
        if (genetics1) {
            // if it's in the list of races, store it in race1
            race1 = await support.compare(genetics1, character.info.race);
            // if the second two words are concatonated
            if (genetics3) {
                // if they are in the in list of races, store in race1
                race2 = await support.compare(genetics3, character.info.race);
            } else {
                // else check that the 3rd word is in the list
                race2 = await support.compare(discrimination[2], character.info.race);
            }
        // and if the first word is a single word
        } else {
            // see if it's in the list of races
            race1 = await support.compare(discrimination[0], character.info.race);
            // if the second two words are concatenated
            if (genetics2) {
                // see if it's valid and store in race 2
                race2 = await support.compare(genetics2, character.info.race);
            } else {
                // else check the second word
                race2 = await support.compare(discrimination[1], character.info.race);
            }
        }
    } else {
        "too slow";
    }

    // if race 1 and race 2 are valid and not the same
    if (race1 && race2 && race1 != race2) {
        return [race1, race2];
    } else {
        msg.channel.send("Invalid options. Try again.");
        return false;
    }
}

module.exports.getBreeds = getBreeds;
module.exports.halfBlood = halfblood;
