const MODELO_EQUIPO = {
  ARMA: {
    nombre: "",
    ataque: 0,
    defensa: 0,
    critico: 0,
    maleficio: 0,
    curacion: 0,
    vampirismo: 0,
  },
  ARMADURA: {
    nombre: "",
    defensa: 0,
    esquivar: 0,
    maleficio: 0,
    curacion: 0,
    regeneracion: 0,
  },
  JOYA: {
    nombre: "",
    ataque: 0,
    defensa: 0,
    esquivar: 0,
    critico: 0,
    maleficio: 0,
    curacion: 0,
    regeneracion: 0,
  },
};
export const arrayEquipo = [
  [],
  [
    [
      //ataque
      [
        {
          nombre: "Espada Maltrecha",
          ataque: 5,
          defensa: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
      ],
      [
        {
          nombre: "Armadura de Caballero",
          ataque: 0,
          defensa: 5,
          esquivar: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      ],
      [
        {
          nombre: "Foto Familiar",
          ataque: 1,
          defensa: 1,
          esquivar: 0,
          critico: 0,
          maleficio: 0,
          curacion: 1,
          regeneracion: 0,
        },
      ],
    ],
    [
      //defensa
      [
        {
          nombre: "Espada Maltrecha",
          ataque: 5,
          defensa: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
      ],
      [
        {
          nombre: "Placas Incompletas",
          ataque: 0,
          defensa: 10,
          esquivar: -5,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      ],
      [
        {
          nombre: "Brazalete de Metal",
          ataque: 0,
          defensa: 5,
          esquivar: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      ],
    ],
    [
      //agilidad
      [
        {
          nombre: "Daga Oxidada",
          ataque: 3,
          defensa: 0,
          critico: 3,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
      ],
      [
        {
          nombre: "Armadura de Cuero",
          ataque: 0,
          defensa: 1,
          esquivar: 5,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      ],
      [
        {
          nombre: "Anillo Oxidado",
          ataque: 1,
          defensa: 0,
          esquivar: 2,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      ],
    ],
    [
      //maleficio
      [
        {
          nombre: "Varita de Roble",
          ataque: 0,
          defensa: 0,
          critico: 0,
          maleficio: 5,
          curacion: 0,
          vampirismo: 0,
        },
      ],
      [
        {
          nombre: "Vestiduras Oscuras",
          ataque: 0,
          defensa: 1,
          esquivar: 0,
          maleficio: 5,
          curacion: 0,
          regeneracion: 0,
        },
      ],
      [
        {
          nombre: "Anillo de Brujo",
          ataque: 0,
          defensa: 0,
          esquivar: 0,
          critico: 2,
          maleficio: 2,
          curacion: 0,
          regeneracion: 0,
        },
      ],
    ],
    [
      // curacion
      [
        {
          nombre: "Baculo del Sanador",
          ataque: 0,
          defensa: 0,
          maleficio: 0,
          curacion: 5,
        },
      ],
      [
        {
          nombre: "Tunicas del Sanador",
          ataque: 0,
          defensa: 1,
          maleficio: 0,
          curacion: 5,
        },
      ],
      [
        {
          nombre: "Collar del Chamán",
          ataque: 0,
          defensa: 0,
          maleficio: 0,
          curacion: 5,
        },
      ],
    ],
  ],
  [
    //lvl2
    [
      // ataque
      [
        {
          nombre: "Espadon Pesado",
          ataque: 20,
          defensa: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
        {
          nombre: "Espada Larga",
          ataque: 12,
          defensa: 0,
          critico: 5,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
        {
          nombre: "Espada Carmesi",
          ataque: 15,
          defensa: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          vampirismo: 5,
        },
      ],
      [
        {
          nombre: "Armadura de Guerra",
          ataque: 5,
          defensa: 15,
          esquivar: 0,
          critico: 0,
          maleficio: 0,
          curacion: 5,
          regeneracion: 1,
        },
        {
          nombre: "Armadura Carmesi",
          ataque: 5,
          defensa: 10,
          esquivar: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          regeneracion: 3,
          vampirismo: 5,
        },
      ],
      [
        {
          nombre: "Tecnicas de lucha I",
          ataque: 3,
          defensa: 3,
          esquivar: 3,
          critico: 3,
          maleficio: 0,
          curacion: 0,
          regeneracion: 2,
          vampirismo: 0,
        },
      ],
    ],
    [
      // defensa
      [
        {
          nombre: "Escudo afilado",
          ataque: 5,
          defensa: 10,
          critico: 3,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
      ],
      [
        {
          nombre: "Armadura de Vitalidad",
          ataque: 0,
          defensa: 20,
          esquivar: 0,
          critico: 0,
          maleficio: 0,
          curacion: 5,
          regeneracion: 3,
          vidaMaxima: 10,
        },
      ],
      [
        {
          nombre: "Manual: escudero I",
          ataque: 0,
          defensa: 10,
          esquivar: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      ],
    ],
    [
      [
        {
          nombre: "Bisturí de Guerra",
          ataque: 5,
          defensa: 0,
          critico: 20,
          maleficio: 0,
          curacion: 5,
          vampirismo: 0,
        },
        {
          nombre: "Daga Sacatripas",
          ataque: 13,
          defensa: 0,
          critico: 10,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
        {
          nombre: "Cuchillo de Bota",
          ataque: 3,
          defensa: 0,
          critico: 20,
          esquivar: 10,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
      ],
      [
        {
          nombre: "Armadura de Escamas",
          ataque: 0,
          defensa: 5,
          critico: 10,
          esquivar: 5,
          maleficio: 0,
          curacion: 0,
          regeneracion: 3,
        },
        {
          nombre: "Mallas de aluminio",
          ataque: 0,
          defensa: 5,
          critico: 5,
          esquivar: 10,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      ],
      [
        {
          nombre: "Cola de mono",
          ataque: 0,
          defensa: 0,
          esquivar: 10,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
        {
          nombre: "Manual de cirugía I",
          ataque: 3,
          defensa: 0,
          esquivar: 0,
          critico: 10,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      ],
    ],
    [
      [
        {
          nombre: "Baculo de Obsidiana",
          ataque: 5,
          defensa: 0,
          critico: 5,
          maleficio: 20,
          curacion: 0,
          vampirismo: 0,
        },
        {
          nombre: "Abosrbealmas",
          ataque: 10,
          defensa: 0,
          critico: 0,
          maleficio: 5,
          curacion: 5,
          vampirismo: 10,
        },
      ],
      [
        {
          nombre: "Tunica Cosechaoscura",
          ataque: 5,
          defensa: 5,
          esquivar: 0,
          maleficio: 5,
          curacion: 5,
          vampirismo: 5,
        },
        {
          nombre: "Aura Oscura",
          ataque: 0,
          defensa: -5,
          esquivar: 0,
          maleficio: 25,
          curacion: 0,
          regeneracion: 0,
        },
      ],
      [
        {
          nombre: "Talisman maldito",
          ataque: 0,
          defensa: 0,
          esquivar: 0,
          critico: 5,
          maleficio: 10,
          curacion: 0,
          regeneracion: 0,
        },
        {
          nombre: "Cristal oscuro",
          ataque: 3,
          defensa: 0,
          esquivar: 0,
          critico: 0,
          maleficio: 5,
          curacion: 5,
          vampirismo: 5,
        },
      ],
    ],
    [
      [
        {
          nombre: "Lucero del Alba",
          ataque: 10,
          defensa: 0,
          maleficio: 0,
          curacion: 15,
        },
        {
          nombre: "Manos curativas",
          ataque: 3,
          defensa: 0,
          maleficio: 0,
          curacion: 30,
        },
      ],
      [
        {
          nombre: "Aura de luz",
          ataque: 0,
          defensa: 1,
          maleficio: 0,
          curacion: 30,
        },
        {
          nombre: "Placas de Templario",
          ataque: 0,
          defensa: 15,
          maleficio: 0,
          curacion: 15,
        },
      ],
      [
        {
          nombre: "Libro Sagrado",
          ataque: 5,
          defensa: 0,
          maleficio: 0,
          curacion: 15,
        },
        {
          nombre: "Remedio Casero",
          ataque: 0,
          defensa: 0,
          maleficio: 0,
          curacion: 20,
        },
      ],
    ],
  ],
  [],
];
//NIVEL-SPEC-TIPO-OBJETO
export const EQUIPO = {
  LVL1: {
    ATAQUE: {
      ARMA: {
        ESPADA_MALTRECHA: {
          nombre: "Espada Maltrecha",
          ataque: 5,
          defensa: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
      },
      ARMADURA: {
        ARMADURA_CABALLERO: {
          nombre: "Armadura de Caballero",
          defensa: 5,
          esquivar: 0,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      },
      JOYA: {
        FOTO_FAMILIAR: {
          nombre: "Foto Familiar",
          ataque: 1,
          defensa: 1,
          esquivar: 0,
          critico: 0,
          maleficio: 0,
          curacion: 1,
          regeneracion: 0,
        },
      },
    },
    AGILIDAD: {
      ARMA: {
        DAGA_OXIDADA: {
          nombre: "Daga Oxidada",
          ataque: 3,
          defensa: 0,
          critico: 3,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
      },
      ARMADURA: {
        ARMADURA_CUERO: {
          nombre: "Armadura de Cuero",
          defensa: 1,
          esquivar: 5,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      },
      JOYA: {
        ANILLO_OXIDADO: {
          nombre: "Anillo Oxidado",
          ataque: 1,
          defensa: 0,
          esquivar: 2,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      },
    },
    DEFENSA: {
      ARMA: {
        ESPADA_MALTRECHA: {
          nombre: "Espada Maltrecha",
          ataque: 5,
          defensa: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          vampirismo: 0,
        },
      },
      ARMADURA: {
        PLACAS_LVL1: {
          nombre: "Placas Incompletas",
          defensa: 10,
          esquivar: -5,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      },
      JOYA: {
        BRAZALETE_METAL: {
          nombre: "Brazalete de Metal",
          ataque: 0,
          defensa: 5,
          esquivar: 0,
          critico: 0,
          maleficio: 0,
          curacion: 0,
          regeneracion: 0,
        },
      },
    },
    MALEFICIO: {
      ARMA: {
        VARITA_ROBLE: {
          nombre: "Varita de Roble",
          ataque: 0,
          defensa: 0,
          critico: 0,
          maleficio: 5,
          curacion: 0,
          vampirismo: 0,
        },
      },
      ARMADURA: {
        VESTIDURAS_OSCURAS: {
          nombre: "Vestiduras Oscuras",
          defensa: 1,
          esquivar: 0,
          maleficio: 5,
          curacion: 0,
          regeneracion: 0,
        },
      },
      JOYA: {
        ANILLO_BRUJO: {
          nombre: "Anillo de Brujo",
          ataque: 0,
          defensa: 0,
          esquivar: 0,
          critico: 2,
          maleficio: 2,
          curacion: 0,
          regeneracion: 0,
        },
      },
    },
    CURACION: {
      ARMA: {
        BACULO_SANADOR: {
          nombre: "Baculo del Sanador",
          ataque: 0,
          defensa: 0,
          maleficio: 0,
          curacion: 5,
        },
      },
      ARMADURA: {
        TUNICA_SANADOR: {
          nombre: "Tunicas del Sanador",
          ataque: 0,
          defensa: 1,
          maleficio: 0,
          curacion: 5,
        },
      },
      JOYA: {
        COLLAR_CHAMAN: {
          nombre: "Collar del Chamán",
          ataque: 0,
          defensa: 0,
          maleficio: 0,
          curacion: 5,
        },
      },
    },
  },
  LVL2: {
    ATAQUE: { ARMA: {}, ARMADURA: {}, JOYA: {} },
    DEFENSA: { ARMA: {}, ARMADURA: {}, JOYA: {} },
    MALEFICIO: { ARMA: {}, ARMADURA: {}, JOYA: {} },
    CURACION: { ARMA: {}, ARMADURA: {}, JOYA: {} },
  },
  LVL3: {
    ATAQUE: { ARMA: {}, ARMADURA: {}, JOYA: {} },
    DEFENSA: { ARMA: {}, ARMADURA: {}, JOYA: {} },
    MALEFICIO: {
      ARMA: {},
      ARMADURA: {},
      JOYA: {
        COLLAR_OBSIDIANA: {
          nombre: "Collar de Obsidiana",
          ataque: 15,
          defensa: 0,
          maleficio: 30,
          curacion: 0,
        },
      },
    },
    CURACION: { ARMA: {}, ARMADURA: {}, JOYA: {} },
  },
};
