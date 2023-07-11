export const DADOS = {
  D1: {
    A: { EFECTO: "DA1", DECRIPCION: "Avanza 1" },
    B: { EFECTO: "DB1", DECRIPCION: "Inflige daño x1" },
  },
  D2: {
    A: { EFECTO: "DA2", DECRIPCION: "Retrocede 1" },
    B: { EFECTO: "DB2", DECRIPCION: "Recibe 10 daño" },
  },
  D3: {
    A: { EFECTO: "DA3", DECRIPCION: "Camino sin salida (pierdes el turno) " },
    B: { EFECTO: "DB3", DECRIPCION: "" },
  },
  D4: {
    A: { EFECTO: "DA4", DECRIPCION: "Lanza D4, avanza el resultado" },
    B: { EFECTO: "DB4", DECRIPCION: "Drop lvl1" },
  },
  D5: {
    A: { EFECTO: "DA5", DECRIPCION: "+2 Energia" },
    B: { EFECTO: "DB5", DECRIPCION: `Te curas ${`state.personaje.curacion`}` },
  },
  D6: {
    A: {
      EFECTO: "DA6",
      DECRIPCION:
        "Lanzas D6, avanzas 1 si el resultado es menor a 6, sino retrocedes 6",
    },
    B: {
      EFECTO: "DB6",
      DECRIPCION:
        "Lanzas D6, infliges daño x0.5 si resultado es menor a 6, sino recibes daño x2",
    },
  },

  D7: {
    A: {
      EFECTO: "DA7",
      DECRIPCION: "Haz retroceder 2 casilleros a otro jugador",
    },
    B: { EFECTO: "DB7", DECRIPCION: "" },
  },
  D8: {
    A: { EFECTO: "DA8", DECRIPCION: "+1 Energia & +1 Dado" },
    B: { EFECTO: "DB8", DECRIPCION: "Drop lvl2" },
  },
  D9: {
    A: {
      EFECTO: "DA9",
      DECRIPCION: "Lider: todos se te acercan 2 casilleros. +1 ataque perma",
    },
    B: {
      EFECTO: "DB9",
      DECRIPCION:
        "Hediondo: todos se alejan 2 casilleros. +1 p. Habilidad perma ",
    },
  },
  D10: {
    A: {
      EFECTO: "DA10",
      DECRIPCION: "Laberinto: +/- 2 casilleros segun coinflip (50/50)",
    },
    B: { EFECTO: "DB10", DECRIPCION: "Laberinto" },
  },
  D11: {
    A: { EFECTO: "DA11", DECRIPCION: "Escudo Divino: anula efectos negativos" },
    B: { EFECTO: "DB11", DECRIPCION: "" },
  },
  D12: {
    A: { EFECTO: "DA12", DECRIPCION: "" },
    B: { EFECTO: "DB12", DECRIPCION: "" },
  },

  D13: {
    A: { EFECTO: "DA13", DECRIPCION: "" },
    B: { EFECTO: "DB13", DECRIPCION: "" },
  },
  D14: {
    A: { EFECTO: "DA14", DECRIPCION: "" },
    B: { EFECTO: "DB14", DECRIPCION: "" },
  },
  D15: {
    A: { EFECTO: "DA15", DECRIPCION: "" },
    B: { EFECTO: "DB15", DECRIPCION: "" },
  },
  D16: {
    A: { EFECTO: "DA16", DECRIPCION: "" },
    B: { EFECTO: "DB16", DECRIPCION: "" },
  },
  D17: {
    A: { EFECTO: "DA17", DECRIPCION: "" },
    B: { EFECTO: "DB17", DECRIPCION: "" },
  },
  D18: {
    A: { EFECTO: "DA18", DECRIPCION: "" },
    B: { EFECTO: "DB18", DECRIPCION: "" },
  },
  D19: {
    A: { EFECTO: "DA19", DECRIPCION: "" },
    B: { EFECTO: "DB19", DECRIPCION: "" },
  },
  D20: {
    A: { EFECTO: "DA20", DECRIPCION: "" },
    B: { EFECTO: "DB20", DECRIPCION: "" },
  },
};
