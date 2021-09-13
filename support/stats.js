//STATS 
module.exports = {
    Type : class {
        constructor (exp, cond, c_hp, m_hp, c_ep, m_ep, atk, def, str, dex, sta, intel) {
            this.exp = exp;
            this.cond = cond;
            this.c_hp = c_hp;
            this.m_hp = m_hp;
            this.c_ep = c_ep;
            this.m_ep = m_ep;
            this.atk = atk;
            this.def = def;
            this.str = str;
            this.dex = dex;
            this.sta = sta;
            this.intel = intel;
        }
    }
}
