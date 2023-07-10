const statsBase = {
  warriorBersek: {
    vidaBase: 140,
    regeneracionBase: 0,
    energiaMax: 3,
    ataqueBase: 20,
    defensaBase: 10,
    ira: 0,
    iraMax: 5,
    criticoBase: 5,
    esquivarBase: 5,
    curacionBase: 5,
    maleficioBase: 0,
    defensaMagicaBase: 0,
    vampirismoBase: 50,
  },
  warriorProtec: {
    vidaBase: 120,
    regeneracionBase: 0,
    energiaMax: 3,
    ataqueBase: 10,
    defensaBase: 20,
    ira: 0,
    iraMax: 5,
    criticoBase: 5,
    esquivarBase: 5,
    curacionBase: 5,
    maleficioBase: 0,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
  },
  rogueSicario: {
    vidaBase: 100,
    regeneracionBase: 0,
    energiaMax: 3,
    ataqueBase: 15,
    defensaBase: 5,
    comboMax: 5,
    combo: 0,
    criticoBase: 25,
    esquivarBase: 15,
    curacionBase: 5,
    maleficioBase: 0,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
  },
  rogueMalabarista: {
    vidaBase: 100,
    regeneracionBase: 0,
    energiaMax: 5,
    ataqueBase: 10,
    defensaBase: 5,
    comboMax: 5,
    combo: 0,
    criticoBase: 15,
    esquivarBase: 25,
    curacionBase: 5,
    maleficioBase: 0,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
  },
  warlockMasas: {
    vidaBase: 140,
    regeneracionBase: 0,
    energiaMax: 3,
    ataqueBase: 15,
    defensaBase: 1,
    mana: 0,
    manaMax: 5,
    criticoBase: 10,
    esquivarBase: 5,
    curacionBase: 5,
    maleficioBase: 15,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
  },
  warlockDestruccion: {
    vidaBase: 120,
    regeneracionBase: 0,
    energiaMax: 3,
    ataqueBase: 15,
    defensaBase: 1,
    mana: 0,
    manaMax: 5,
    criticoBase: 20,
    esquivarBase: 5,
    curacionBase: 5,
    maleficioBase: 35,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
  },
  mageArcano: {
    vidaBase: 80,
    regeneracionBase: 0,
    energiaMax: 3,
    ataqueBase: 15,
    defensaBase: 1,
    mana: 0,
    manaMax: 5,
    criticoBase: 20,
    esquivarBase: 5,
    curacionBase: 15,
    maleficioBase: 15,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
  },

  mageSanador: {
    vidaBase: 80,
    regeneracionBase: 0,
    energiaMax: 3,
    ataqueBase: 10,
    defensaBase: 1,
    mana: 0,
    manaMax: 5,
    criticoBase: 15,
    esquivarBase: 5,
    curacionBase: 30,
    maleficioBase: 5,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
  },
};
export const STATS_AUTOMATICO = {};
Object.entries(statsBase).forEach(([key, value]) => {
  STATS_AUTOMATICO[key] = {
    ...value,
    vida: value.vidaBase,
    vidaMaxima: value.vidaBase,
    regeneracion: value.regeneracionBase,
    energia: value.energiaMax,
    reservaEnergia: 0,
    ataque: value.ataqueBase,
    defensa: value.defensaBase,
    defensaMagica: value.defensaMagicaBase,
    critico: value.criticoBase,
    esquivar: value.esquivarBase,
    curacion: value.curacionBase,
    maleficio: value.maleficioBase,
    vampirismo: value.vampirismoBase,
  };
});
