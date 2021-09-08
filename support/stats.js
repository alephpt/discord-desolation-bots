//STATS 
module.exports = {
    Type : class {
        constructor (exp, conditions, current_health, max_health, current_energy, max_energy, attack, 
            defense, strength, dexterity, stamina, intelligence) {
            this.exp = exp;
            this.conditions = conditions;
            this.current_health = current_health;
            this.max_health = max_health;
            this.current_energy = current_energy;
            this.max_energy = max_energy;
            this.attack = attack;
            this.defense = defense;
            this.strength = strength;
            this.dexterity = dexterity;
            this.stamina = stamina;
            this.intelligence = intelligence;
        }

    }

}
