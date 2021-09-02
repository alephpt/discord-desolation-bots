const Discord = require('discord.js');
const support = require('../support/support.js');


const mWidth = 23;
const mHeight = 11;
let Kloc = [10, 2];
let Ploc = [2, 9]


function warp(n, end) {
    if (n < 0) {
        n = n + (end - 1);
        if (n < 0) { warp(n, end) };
    }
    return n
}


function playerlocation(playerloc, dirs) {
    playerloc[0] = warp((playerloc[0] + Number(dirs[0])) % (mWidth - 1), mWidth);
    playerloc[1] = warp((playerloc[1] + Number(dirs[1])) % (mHeight - 1), mHeight);
}

function whoisit(msg) {
    if (support.member(msg).displayName === "0x4A_Kat") {
        return Kloc;
    } else 
    if (support.member(msg).displayName === "pragma") {
        return Ploc;
    }
 }

function drawmap(msg, w, h, playerloc) { 
    let map = "```\n";

    for (let y = 0; y <= h; y++) {
        for (let x = 0; x <= w; x++) {
            // if top left corner
            if ( x === 0 && y === 0 ) {
                map += "┌";
            }
            // if top right corner
            else if ( x === w && y === 0 ) {
                map += "┐";
            }
            // if bottom left corner
            else if ( x === 0 && y === h ) {
                map += "└";
            } 
            // if bottom right side
            else if ( x === w && y === h ) {
                map += "┘";
            }
            // if top or bottom side
            else if ( y === 0 || y === h ) {
                map += "-";
            }
            // if far left or far right side
            else if ( x === 0 || x === w ) {
                map += "|";
            } 
            // if it's a player location
            else if (x === (Kloc[0] + 1) && y === (Kloc[1] + 1)){
                map += "K";
            }
            else if (x === (Ploc[0] + 1) && y === (Ploc[1] + 1)){
                map += "P";
            // if it's a blank space
            } else {
                map += ".";
            }
        }
        map += "\n"
    }
    map += "\n```"
    let embedded = new Discord.MessageEmbed()
        .addFields(
            {
                name: "Map Grid (sumn, sumn) : Dot Mountains",
                value: map,
                inline: true,
            }
        )
        .setFooter("Kat is at " + Kloc[0] + ", " + Kloc[1] + "\nPragma is at " + Ploc[0] + ", " + Ploc[1]);
    msg.channel.send(embedded)
}

module.exports = {
    draw : function(msg) {
        let playerloc = whoisit(msg);
        drawmap(msg, mWidth, mHeight, playerloc);
    },

    move: function(msg, coords) {
        let playerloc = whoisit(msg);
        if (coords) {
            let dirs = coords.split(" ");
            if (dirs[1]) {
                playerlocation(playerloc, dirs)
           }
        }
        drawmap(msg, mWidth, mHeight, playerloc);
    },

    respawn: function(msg) {
        let playerloc = whoisit(msg);
        playerloc[0] = Math.floor(mWidth / 2);
        playerloc[1] = Math.floor(mHeight / 2);
    }
}
