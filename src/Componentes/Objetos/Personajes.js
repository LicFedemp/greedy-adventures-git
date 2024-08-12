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
    vampirismoBase: 0,
    preferenciaDrop: [0, 1, 2, 3, 4],
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
    preferenciaDrop: [1, 0, 2, 3, 4],
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
    preferenciaDrop: [2, 0, 1, 4, 3],
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
    preferenciaDrop: [2, 0, 1, 4, 3],
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
    preferenciaDrop: [3, 0, 4, 1, 2],
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
    maleficioBase: 25,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
    preferenciaDrop: [3, 0, 4, 1, 2],
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
    preferenciaDrop: [4, 0, 1, 3, 2],
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
    curacionBase: 25,
    maleficioBase: 5,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
    preferenciaDrop: [4, 1, 3, 0, 2],
  },

  paladinFenix: {
    vidaBase: 80,
    regeneracionBase: 0,
    energiaMax: 3,
    ataqueBase: 15,
    defensaBase: 20,
    mana: 0,
    manaMax: 1,
    criticoBase: 10,
    esquivarBase: 5,
    curacionBase: 10,
    maleficioBase: 0,
    defensaMagicaBase: 0,
    vampirismoBase: 0,
    preferenciaDrop: [1, 0, 2, 4, 3],
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
    manaBase: value.manaMax,
    ataque: value.ataqueBase,
    defensa: value.defensaBase,
    defensaMagica: value.defensaMagicaBase,
    critico: value.criticoBase,
    esquivar: value.esquivarBase,
    curacion: value.curacionBase,
    maleficio: value.maleficioBase,
    vampirismo: value.vampirismoBase,
    vidaMaximaBonus: 0,
    regeneracionBonus: 0,
    energiaBonus: 0,
    reservaEnergiaBonus: 0,
    ataqueBonus: 0,
    defensaBonus: 0,
    defensaMagicaBonus: 0,
    criticoBonus: 0,
    esquivarBonus: 0,
    curacionBonus: 0,
    maleficioBonus: 0,
    vampirismoBonus: 0,
  };
});
