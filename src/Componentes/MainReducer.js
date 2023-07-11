import { useReducer } from "react";
import { STATS_AUTOMATICO } from "./Objetos/Personajes";
import { efectosPSec } from "./Objetos/EfectosPS";
import { EQUIPO, arrayEquipo } from "./Objetos/Equipo";

const estadoRoll = {
  numero: 0,
  modo: true,
  lock: false,
  activo: false,
  especial: false,
  estado: 1,
};
const FUNCIONES = {
  OVERHEALING: "overhealing",
  CURACION: "curacion",
};
export const ACCIONES = {
  SELECCION_PERSONAJE: "seleccion-personaje",
  PODER_DADO: "poder-dado",
  NUM_DADO: "num-dado",
  PODER_DADO_CASILLERO: "poder-dado-casillero",
  ROLL_ALL: " roll-all",
  ESPECIAL: "especial",
  LOCK: "lock",
  STATS: {
    MOD_VIDA: "mod-vida",
    EXCESO_ENERGIA: "exceso-energia",
    BONUS_VIDA: "bonus-vida",
  },
  PORCENTAJE_VIDA: "porcentaje-vida",
  MOD_CASILLERO: "mod-casillero",
  MODO_DADO: "modo-dado",
  ACTIVACION_DADO: "activacion-dado",
  TOGGLE_TURNO: "toggle-turno",
  IRA_DADOS: "ira-dados",
  AUTOMATICO: "automatico",
  DESPLEGABLE: "desplegable",
  MOD_DESPLEGABLE: "mod-desplegable",
  CALCULAR_STATS: "calcular-stats",
  MODIFICAR_EQUIPO: "modificar-equipo",
  ACTIVAR_SKILL: "activar-skill",
  EFECTOS_PS: "efectos-ps",
  NEGATIVO: "negativo",
};
const convertirObjetoEnArray = (objeto) => {
  return Object.keys(objeto).map((clave) => {
    if (typeof objeto[clave] === "object") {
      return { [clave]: convertirObjetoEnArray(objeto[clave]) };
    } else {
      return { [clave]: objeto[clave] };
    }
  });
};
const arrayAnidado = convertirObjetoEnArray(EQUIPO);
const estadoInicial = {
  numeroClase: 200,
  numeroSpec: 2,
  estadoTurno: true,
  casillero: 0,
  casilleroPrevio: 0,
  casillerosMovidos: 0,
  nivelDado: 1,
  poderDado: 6,
  numDado: 5,
  dadoExtra: 0,
  personaje: {
    ...STATS_AUTOMATICO.rogueMalabarista,
  },
  bonus: { vida: 0, dadosTemporales: 0, dadosPermanentes: 0 },
  porcentajeVida: 100,
  regeneracion: 0,
  automatico: false,
  mostrarDesplegable: false,
  modDesplegable: 1,
  ataqueAcumulado: 0,

  roll1: { ...estadoRoll },
  roll2: { ...estadoRoll },
  roll3: { ...estadoRoll },
  roll4: { ...estadoRoll },
  roll5: { ...estadoRoll },
  rollFlag: false,
  dadosObligados: [2, 3, 10, 13, 17],
  equipo: {
    codigoDrop: [],
    bolsa: { arma: [], armadura: [], joya: [] },
    actual: {
      arma: [],
      armadura: [],
      joya: [],
    },
  },
  arrayEquipo: [...arrayEquipo],
  efectosPorSec: { ...efectosPSec },
  cantidadPersonajes: 6,
  accion: false,
  algunNegativo: false,
};
const randomNumber = (numeroMaximo) => {
  const random = Math.floor(Math.random() * numeroMaximo) + 1;
  return random;
};
const reducer = (state, action) => {
  const P = {
    vida: state.personaje.vida,
    vidaMaxima: state.personaje.vidaMaxima,
    regeneracion: state.personaje.regeneracion,
    energia: state.personaje.energia,
    reservaEnergia: 0,
    ataque: state.personaje.ataque,
    defensa: state.personaje.defensa,
    defensaMagica: state.personaje.defensaMagica,
    critico: state.personaje.critico,
    esquivar: state.personaje.esquivar,
    curacion: state.personaje.curacion,
    maleficio: state.personaje.maleficio,
    vampirismo: state.personaje.vampirismo,
    vidaBase: state.personaje.vidaBase,
    regeneracionBase: state.personaje.regeneracionBase,
    energiaMax: state.personaje.energiaMax,
    ataqueBase: state.personaje.ataqueBase,
    defensaBase: state.personaje.defensaBase,
    mana: state.personaje.mana,
    manaMax: state.personaje.manaMax,
    comboMax: state.personaje.comboMax,
    combo: state.personaje.combo,
    ira: state.personaje.ira,
    iraMax: state.personaje.iraMax,
    criticoBase: state.personaje.criticoBase,
    esquivarBase: state.personaje.esquivarBase,
    curacionBase: state.personaje.curacionBase,
    maleficioBase: state.personaje.maleficioBase,
    defensaMagicaBase: state.personaje.defensaMagicaBase,
    vampirismoBase: state.personaje.vampirismoBase,
  };

  const randomEsquivar = randomNumber(100) <= P.esquivar ? true : false;
  const randomCritico = randomNumber(100) <= P.critico ? true : false;
  console.log(
    `Esquivar:(%${P.esquivar}) ${randomEsquivar}// Crit:(%${P.critico}) ${randomCritico}`
  );
  const calcularHealing = (cambio, funcion) => {
    const curacion = P.vida + cambio;
    const overhealing = curacion > P.vidaMaxima ? true : false;
    switch (funcion) {
      case FUNCIONES.CURACION:
        return curacion;
      case FUNCIONES.OVERHEALING:
        return overhealing;
      default:
        return;
    }
  };

  let algunNegativo = false;
  for (let x = 1; x < 6; x++) {
    const dado = `roll${x}`;
    if (state[dado].estado == 3) {
      algunNegativo = true;
    }
  }
  console.log(algunNegativo);
  let danoInfligido = 0;
  let vampirismo = danoInfligido * (P.vampirismo / 10);
  switch (action.type) {
    case ACCIONES.SELECCION_PERSONAJE:
      if (action.caso === "clase") {
        return { ...state, numeroClase: action.valor };
      } else if (action.caso === "spec") {
        return { ...state, numeroSpec: action.valor };
      } else if (action.caso === "personaje") {
        const numero = parseInt(
          parseInt(state.numeroClase) + parseInt(state.numeroSpec)
        );
        switch (numero) {
          case 101:
            return {
              ...state,
              personaje: { ...STATS_AUTOMATICO.warriorBersek },
            };
          case 102:
            return {
              ...state,
              personaje: { ...STATS_AUTOMATICO.warriorProtec },
            };
          case 201:
            return {
              ...state,
              personaje: { ...STATS_AUTOMATICO.rogueSicario },
            };
          case 202:
            return {
              ...state,
              personaje: { ...STATS_AUTOMATICO.rogueMalabarista },
            };
          case 301:
            return {
              ...state,
              personaje: { ...STATS_AUTOMATICO.warlockMasas },
            };
          case 302:
            return {
              ...state,
              personaje: { ...STATS_AUTOMATICO.warlockDestruccion },
            };
          case 401:
            return { ...state, personaje: { ...STATS_AUTOMATICO.mageArcano } };
          case 402:
            return { ...state, personaje: { ...STATS_AUTOMATICO.mageSanador } };
          default:
            return {
              ...state,
              personaje: { ...STATS_AUTOMATICO.warriorBersek },
            };
        }
      }
    case ACCIONES.AUTOMATICO:
      return { ...state, automatico: !state.automatico };
    case ACCIONES.DESPLEGABLE:
      return { ...state, mostrarDesplegable: !state.mostrarDesplegable };
    case ACCIONES.TOGGLE_TURNO:
      console.log(STATS_AUTOMATICO);
      console.log(`length de actual arma: ${state.equipo.actual.arma.length}`);
      console.log(`length de bolsa arma: ${state.equipo.bolsa.arma.length}`);
      const venenoTickTurno =
        state.efectosPorSec.veneno > 0 && state.efectosPorSec.tickVeneno > 0
          ? parseInt(
              state.efectosPorSec.veneno / (state.efectosPorSec.tickVeneno * 2)
            )
          : 0;
      let arrayCritVeneno = [false, false];
      for (let i = 0; i < arrayCritVeneno.length; i++) {
        const critico =
          Math.floor(state.efectosPorSec.veneno * 0.25) >= randomNumber(100)
            ? true
            : false;
        arrayCritVeneno[i] = critico;
      }
      const venenoInicial = arrayCritVeneno[0]
        ? venenoTickTurno * 2
        : venenoTickTurno;
      const venenoFinal = arrayCritVeneno[1]
        ? venenoTickTurno * 2
        : venenoTickTurno;

      if (state.estadoTurno) {
        const turnoHealing = P.vida + P.vidaMaxima * 0.15;
        const turnoFinalHealing =
          turnoHealing > P.vidaMaxima ? P.vidaMaxima : turnoHealing;
        const fraccionTick = 4;
        const hemoTickTurno =
          state.efectosPorSec.hemo > 0 && state.efectosPorSec.tickHemo > 0
            ? parseInt(
                state.efectosPorSec.hemo /
                  (state.efectosPorSec.tickHemo * fraccionTick)
              )
            : 0;

        let cambioVidaFinalTurno =
          P.energia == P.energiaMax && !state.accion
            ? turnoFinalHealing
            : P.vida;
        cambioVidaFinalTurno =
          cambioVidaFinalTurno - hemoTickTurno - venenoFinal;

        return {
          ...state,
          estadoTurno: false,
          bonus: { ...state.bonus, dadosTemporales: 0 },
          personaje: {
            ...state.personaje,
            combo: 0,
            ira: 0,
            vida: cambioVidaFinalTurno,
          },
          efectosPorSec: {
            ...state.efectosPorSec,
            hemo:
              state.efectosPorSec.tickHemo == 1
                ? 0
                : state.efectosPorSec.hemo - hemoTickTurno,
            tickHemo:
              state.efectosPorSec.tickHemo > 0
                ? state.efectosPorSec.tickHemo - 1
                : 0,
            veneno: state.efectosPorSec.veneno - venenoTickTurno * 2,
            tickVeneno:
              state.efectosPorSec.tickVeneno > 0
                ? state.efectosPorSec.tickVeneno - 1
                : 0,
          },
          roll1: { ...state.roll1, numero: 0, estado: 1, lock: false },
          roll2: { ...state.roll2, numero: 0, estado: 1, lock: false },
          roll3: { ...state.roll3, numero: 0, estado: 1, lock: false },
          roll4: { ...state.roll4, numero: 0, estado: 1, lock: false },
          roll5: { ...state.roll5, numero: 0, estado: 1, lock: false },
        };
      } else if (!state.estadoTurno) {
        const rejuInicioTurno =
          state.efectosPorSec.reju > 0 && state.efectosPorSec.tickReju > 0
            ? parseInt(state.efectosPorSec.reju / state.efectosPorSec.tickReju)
            : 0;
        let cambioVidaInicioTurno =
          isFinite(P.regeneracion) && P.regeneracion > 0
            ? P.vida - venenoInicial + rejuInicioTurno + P.regeneracion
            : P.vida - venenoInicial + rejuInicioTurno;
        return {
          ...state,
          estadoTurno: true,
          accion: false,
          personaje: {
            ...state.personaje,
            energia: P.energiaMax,
            vida:
              cambioVidaInicioTurno > P.vidaMaxima
                ? P.vidaMaxima
                : cambioVidaInicioTurno,
          },

          efectosPorSec: {
            ...state.efectosPorSec,
            reju:
              state.efectosPorSec.tickReju == 1
                ? 0
                : state.efectosPorSec.reju - rejuInicioTurno,
            tickReju:
              state.efectosPorSec.tickReju > 0
                ? state.efectosPorSec.tickReju - 1
                : 0,
          },
        };
      }
    case ACCIONES.NUM_DADO:
      const valor = parseInt(action.valor);
      return { ...state, numDado: state.numDado + valor };
    case ACCIONES.PODER_DADO:
      const nivel = state.nivelDado < 3 ? state.nivelDado + 1 : 1;
      let poder = 6;
      switch (nivel) {
        case 1:
          poder = 6;
          break;
        case 2:
          poder = 12;
          break;
        case 3:
          poder = 20;
          break;
        default:
          break;
      }
      return { ...state, nivelDado: nivel, poderDado: poder };
    case ACCIONES.PODER_DADO_CASILLERO:
      const casillero = state.casillero;
      return {
        ...state,
        poderDado: casillero > 19 ? 20 : casillero > 9 ? 12 : 6,
        nivelDado: casillero > 19 ? 3 : casillero > 9 ? 2 : 1,
      };
    case ACCIONES.LOCK:
      if (state[action.dado].estado != 0) {
        return {
          ...state,
          [action.dado]: {
            ...state[action.dado],
            lock: !state[action.dado].lock,
          },
        };
      } else {
        return {
          ...state,
          [action.dado]: {
            ...state[action.dado],
            lock: false,
          },
        };
      }
    case ACCIONES.NEGATIVO:
      console.log("entra al negativo");
      return { ...state, algunNegativo: algunNegativo };
    case ACCIONES.ROLL_ALL:
      let arrayNumero = [0, 0, 0, 0, 0];
      const arrayPrimera = [0, 1, 3, 7];
      let numModificadorFinal = 1;

      for (let i = 0; i < state.numDado; i++) {
        const aleatorioPrimero = randomNumber(arrayPrimera[state.nivelDado]);
        if (aleatorioPrimero > arrayPrimera[2]) {
          numModificadorFinal = 13;
        } else if (aleatorioPrimero > 1) {
          numModificadorFinal = 7;
        } else {
          numModificadorFinal = 1;
        }
        console.log(
          `El primer aleatorio es ${aleatorioPrimero}, con base en ${
            arrayPrimera[state.nivelDado]
          }, numModificadorFinal = ${numModificadorFinal}`
        );
        const primerModificador = aleatorioPrimero > 3 ? 8 : 6;
        let aleatorio =
          Math.floor(Math.random() * primerModificador) + numModificadorFinal;

        const lockActual = state[`roll${i + 1}`].lock;
        if (lockActual) {
          arrayNumero[i] = state[`roll${i + 1}`].numero;
        } else {
          if (
            (aleatorio == 3 && state.nivelDado == 1) ||
            (aleatorio == 10 && state.nivelDado == 2)
          ) {
            const puerta = randomNumber(2);
            while (
              (puerta == 2 && aleatorio == 3) ||
              (puerta == 2 && aleatorio == 10)
            ) {
              if (state.nivelDado == 1) {
                console.log(`se evito el 3`);
                aleatorio = randomNumber(6) + 1;
              } else if (state.nivelDado == 2) {
                console.log(`se evito el 10`);
                aleatorio = randomNumber(12) + 1;
              }
            }
          }
          arrayNumero[i] = aleatorio;
        }
      }
      //console.clear();

      return {
        ...state,
        rollFlag: !state.rollFlag,
        accion: true,
        roll1: { ...state.roll1, numero: arrayNumero[0] },
        roll2: { ...state.roll2, numero: arrayNumero[1] },
        roll3: { ...state.roll3, numero: arrayNumero[2] },
        roll4: { ...state.roll4, numero: arrayNumero[3] },
        roll5: { ...state.roll5, numero: arrayNumero[4] },
        personaje: {
          ...state.personaje,
          energia: P.energia - 1,
        },
      };
    case ACCIONES.ESPECIAL:
      let arrayBase = action.arrayBase;
      const arrayCoincidente = action.valorCoincidente;
      let arrayEspecial = [1, 1, 1, 1, 1];
      let arrayOcupados = [];
      let iteraciones = 0;
      let puntoInicio = 0;

      outerLoop: for (const valorCoincidente of arrayCoincidente) {
        iteraciones++;
        //condicional regulador de iterador externo.
        if (iteraciones > arrayCoincidente.length) {
          break outerLoop;
        } else {
          let iteracionesAnidadas = -1;
          innerLoop: for (const elemento of arrayBase) {
            iteracionesAnidadas++;
            if (arrayOcupados.includes(iteracionesAnidadas)) {
              continue innerLoop;
            }

            if (valorCoincidente === elemento) {
              //definir punto de inicio
              if (arrayOcupados.length > 0) {
                if (arrayOcupados.length === 1) {
                  puntoInicio = parseInt(arrayOcupados[0] + 1);
                } else {
                  puntoInicio = parseInt(
                    arrayOcupados[arrayOcupados.length - 1] + 1
                  );
                }
              }
              /*Definir indice que se ignorara luego en la comparacion y 
              punto de inicio para buscar el indice para modificar el array 
              especial*/
              const indice = arrayBase.indexOf(elemento, puntoInicio);
              arrayEspecial[indice] = 2;
              arrayOcupados.push(indice);
              continue outerLoop;
            }
          }
        }
      }
      for (let x = 0; x < arrayEspecial.length; x++) {
        if (state.dadosObligados.includes(state[`roll${x + 1}`].numero)) {
          arrayEspecial[x] = 3;
        }
      }
      return {
        ...state,
        roll1: { ...state.roll1, estado: arrayEspecial[0] },
        roll2: { ...state.roll2, estado: arrayEspecial[1] },
        roll3: { ...state.roll3, estado: arrayEspecial[2] },
        roll4: { ...state.roll4, estado: arrayEspecial[3] },
        roll5: { ...state.roll5, estado: arrayEspecial[4] },
      };
    case ACCIONES.MODO_DADO:
      return {
        ...state,
        [action.dado]: {
          ...state[action.dado],
          modo: !state[action.dado].modo,
        },
      };
    case ACCIONES.MOD_CASILLERO:
      const casillerosFinales = state.casillero + action.valor;

      return {
        ...state,
        casillero: casillerosFinales < 0 ? 0 : casillerosFinales,
        personaje: {
          ...state.personaje,
          vida:
            casillerosFinales < 0 ? P.vida - casillerosFinales * -10 : P.vida,
          ira:
            state.numeroClase == 100 && action.valor < 0 && P.ira < P.iraMax
              ? P.ira + 1
              : P.ira,
        },
      };
    case ACCIONES.MOD_DESPLEGABLE:
      const cambio = action.direccion == "der" ? 1 : -1;
      let nuevoModo = state.modDesplegable + cambio;
      if (nuevoModo > 4) {
        nuevoModo = 1;
      } else if (nuevoModo < 1) {
        nuevoModo = 4;
      }

      return { ...state, modDesplegable: nuevoModo };

    case ACCIONES.EFECTOS_PS:
      const tipo = isNaN(action.tipo) ? action.tipo : parseInt(action.tipo);
      switch (tipo) {
        case 1:
          //hemo
          console.log(`recibido hemo`);
          return {
            ...state,
            efectosPorSec: {
              ...state.efectosPorSec,
              hemo: state.efectosPorSec.hemo + action.valor,
              tickHemo:
                state.efectosPorSec.tickHemo > 0
                  ? parseInt((state.efectosPorSec.tickHemo + action.ticks) / 2)
                  : action.ticks,
            },
          };
        case "hemoAccion":
          const hemoTickRoll =
            state.efectosPorSec.hemo > 0 && state.efectosPorSec.tickHemo > 0
              ? parseInt(
                  state.efectosPorSec.hemo / (state.efectosPorSec.tickHemo * 4)
                )
              : 0;

          return {
            ...state,
            personaje: {
              ...state.personaje,
              vida: P.vida - hemoTickRoll,
            },
          };
        case 2:
          return {
            ...state,
            efectosPorSec: {
              ...state.efectosPorSec,
              veneno: state.efectosPorSec.veneno + action.valor,
              tickVeneno:
                state.efectosPorSec.tickVeneno > 0
                  ? parseInt(
                      (state.efectosPorSec.tickVeneno + action.ticks) / 2
                    )
                  : action.ticks,
            },
          };
        case 3:
          console.log(`recibido rej`);
          //rej
          return {
            ...state,
            efectosPorSec: {
              ...state.efectosPorSec,
              reju: state.efectosPorSec.reju + action.valor * -1,
              tickReju:
                state.efectosPorSec.tickReju > 0
                  ? parseInt((state.efectosPorSec.tickReju + action.ticks) / 2)
                  : action.ticks,
            },
          };

        default:
          break;
      }
      return { ...state };
    case ACCIONES.PORCENTAJE_VIDA:
      console.log(`Nuevo porcentaje = ${(P.vida / P.vidaMaxima) * 100}% `);
      return {
        ...state,
        porcentajeVida: Math.floor((P.vida / P.vidaMaxima) * 100),
        personaje: {
          ...state.personaje,
          vida: P.vida > P.vidaMaxima ? P.vidaMaxima : P.vida,
        },
      };
    case ACCIONES.STATS.MOD_VIDA:
      const danoFiltrado =
        action.valor > P.defensa
          ? action.valor - P.defensa
          : action.valor < 1
          ? action.valor
          : 0;
      return {
        ...state,
        personaje: {
          ...state.personaje,
          vida:
            P.vida - danoFiltrado > P.vidaMaxima
              ? P.vidaMaxima
              : P.vida - danoFiltrado,
          ira:
            state.numeroClase == 100 && P.ira < P.iraMax && danoFiltrado > 0
              ? P.ira + 1
              : P.ira,
        },
      };
    case ACCIONES.STATS.EXCESO_ENERGIA:
      switch (action.caso) {
        case "exceso":
          return {
            ...state,
            personaje: {
              ...state.personaje,
              energia: P.energiaMax,
              reservaEnergia: action.valor,
            },
          };
      }
    case ACCIONES.ACTIVAR_SKILL:
      switch (action.personaje) {
        case 301:
        case 302:
          return { ...state, personaje: { ...state.personaje, mana: 0 } };
        case 401:
          return {
            ...state,
            casillero:
              state.casillero +
              Math.floor(P.mana + P.mana * (P.maleficio / 200)),
            personaje: { ...state.personaje, mana: 0 },
          };
        case 402:
          const healing = calcularHealing(
            Math.floor(P.mana * (P.curacion / 3)),
            FUNCIONES.CURACION
          );
          const overhealingBool = calcularHealing(
            healing,
            FUNCIONES.OVERHEALING
          );
          const bonusVidaMaxima = overhealingBool
            ? Math.floor((healing - P.vidaMaxima) / 10)
            : 0;
          return {
            ...state,
            personaje: {
              ...state.personaje,
              mana: 0,
              vida: overhealingBool ? P.vidaMaxima : healing,
              vidaMaxima: P.vidaMaxima + bonusVidaMaxima,
            },
            bonus: { ...state.bonus, vida: state.bonus.vida + bonusVidaMaxima },
          };

        default:
          return { ...state };
      }
    case ACCIONES.IRA_DADOS:
      const totalDados = P.ira + state.dadoExtra + 2;

      if (state.numeroSpec == 2) {
        console.log(`Entra a ira y se ha seleciconado warrior protec`);
      }
      return {
        ...state,
        numDado: totalDados > 5 ? 5 : totalDados,
      };
    //combo= esquivar /critico
    /*case ACCIONES.CALCULAR_ESQUIVAR:
      return {
        ...state,
        personaje: { ...state.personaje, esquivar: esquivarTotal },
      };
    case ACCIONES.CALCULAR_CRITICO:
      return {
        ...state,
        personaje: { ...state.personaje, critico: criticoTotal },
      };

    case ACCIONES.CALCULAR_ATAQUE:
      console.log(`Array equipo= ${arrayEquipoAtaque}`);
      console.log(`Ataque del arma = ${state.equipo.actual.arma[0]?.ataque}`);
      console.log(`Indice del arma= ${state.equipo.actual.arma[0]?.indice}`);

      return {
        ...state,
        personaje: { ...state.personaje, ataque: totalAtaque },
      };
    case ACCIONES.CALCULAR_DEFENSA:
      return {
        ...state,
        personaje: { ...state.personaje, defensa: totalDefensa },
      };*/
    case ACCIONES.CALCULAR_STATS:
      //DEFENSA
      const comboCritico =
        state.numeroClase == 200 && state.numeroSpec == 1 ? P.combo * 5 : 0;
      const comboEsquivar =
        state.numeroClase == 200 && state.numeroSpec == 2 ? P.combo * 5 : 0;

      const arrayStats = [
        "defensa",
        "ataque",
        "critico",
        "esquivar",
        "maleficio",
        "curacion",
        "vampirismo",
        "defensaMagica",
        "regeneracion",
        "vidaMaxima",
      ];
      let arrayStatsValores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < arrayStats.length; i++) {
        const arrayEquipoActual = [
          state.equipo.actual.arma[0]?.[arrayStats[i]],
          state.equipo.actual.armadura[0]?.[arrayStats[i]],
          state.equipo.actual.joya[0]?.[arrayStats[i]],
        ];
        arrayEquipoActual.forEach((element) => {
          if (typeof element === "number") {
            arrayStatsValores[i] = arrayStatsValores[i] + element;
          }
        });
      }
      const iraModDefensa =
        state.numeroSpec == 2 && state.numeroClase == 100
          ? Math.floor((arrayStatsValores[0] + P.defensaBase) * (P.ira * 0.1))
          : 0;
      const iraModAtaque =
        state.numeroSpec == 1 && state.numeroClase == 100
          ? Math.floor((arrayStatsValores[1] + P.ataqueBase) * (P.ira * 0.1))
          : 0;

      const totalDefensa = parseInt(
        P.defensaBase + iraModDefensa + arrayStatsValores[0]
      );
      const totalAtaque = parseInt(
        P.ataqueBase + iraModAtaque + arrayStatsValores[1]
      );
      const criticoTotal = P.criticoBase + arrayStatsValores[2] + comboCritico;
      const esquivarTotal =
        P.esquivarBase + arrayStatsValores[3] + comboEsquivar;
      const maleficioTotal = P.maleficioBase + arrayStatsValores[4];
      const curacionTotal = P.curacionBase + arrayStatsValores[5];
      const vampirismoTotal = P.vampirismo + arrayStatsValores[6];
      const defMagicaFromDefensa =
        Math.floor(totalDefensa / 50) > 0 ? Math.floor(totalDefensa / 50) : 0;
      const defensaMagicaTotal =
        P.defensaMagica + arrayStatsValores[7] + defMagicaFromDefensa;
      const regeneracionTotal = P.regeneracionBase + arrayStatsValores[8];
      const vidaMaximaTotal =
        P.vidaBase + arrayStatsValores[9] + state.bonus.vida;
      console.log(`Bonus vida maxima = ${state.bonus.vida} `);

      return {
        ...state,
        personaje: {
          ...state.personaje,
          esquivar: esquivarTotal,
          critico: criticoTotal,
          ataque: totalAtaque,
          defensa: totalDefensa,
          maleficio: maleficioTotal,
          curacion: curacionTotal,
          vampirismo: vampirismoTotal,
          defensaMagica: defensaMagicaTotal,
          regeneracion: regeneracionTotal,
          vidaMaxima: vidaMaximaTotal,
        },
      };

    case ACCIONES.MODIFICAR_EQUIPO:
      console.log(`Entra al reducer de modificacion de equipo`);
      switch (action.tipo) {
        case "arma":
          const nuevoArma = { ...state.equipo.bolsa.arma[action.indice] };
          console.log(`Nuevo arma = ${state.equipo.bolsa.arma[action.indice]}`);

          return {
            ...state,
            equipo: {
              ...state.equipo,
              actual: {
                ...state.equipo.actual,
                arma: [
                  {
                    ...nuevoArma,
                  },
                ],
              },
            },
            personaje: {
              ...state.personaje,
              energia: P.energia - 1,
            },
          };
        case "armadura":
          const nuevoArmadura = {
            ...state.equipo.bolsa.armadura[action.indice],
          };
          console.log(
            `Nueva armadura = ${state.equipo.bolsa.arma[action.indice]}`
          );

          return {
            ...state,
            equipo: {
              ...state.equipo,
              actual: {
                ...state.equipo.actual,
                armadura: [
                  {
                    ...nuevoArmadura,
                  },
                ],
              },
            },
            personaje: {
              ...state.personaje,
              energia: P.energia - 1,
            },
          };
        case "joya":
          const nuevaJoya = { ...state.equipo.bolsa.joya[action.indice] };
          return {
            ...state,
            equipo: {
              ...state.equipo,
              actual: {
                ...state.equipo.actual,
                joya: [
                  {
                    ...nuevaJoya,
                  },
                ],
              },
            },
            personaje: {
              ...state.personaje,
              energia: P.energia - 1,
            },
          };
        default:
          return { ...state };
      }
    case ACCIONES.ACTIVACION_DADO:
      if (!algunNegativo || state[action.dado].estado == 3) {
        if (state[action.dado].estado != 0 && state.estadoTurno) {
          const ESTADO_SHORTCOUT = {
            ...state[action.dado],
            estado: 0,
            lock: false,
          };
          let gastoEnergia = 0;
          const estadoActual = parseInt(state[action.dado].estado);
          switch (estadoActual) {
            case 1:
              gastoEnergia = 1;
              break;
            case 2:
            case 3:
              gastoEnergia = 0;
              break;
          }
          console.log(`energia = ${gastoEnergia}`);
          if (action.modo && gastoEnergia <= P.energia) {
            switch (action.n) {
              case 1:
                const avanzarCasillero = 1 + Math.floor(P.ataque / 50);
                return {
                  ...state,
                  casillero: state.casillero + avanzarCasillero,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    combo: P.combo < P.comboMax ? P.combo + 1 : P.combo,
                  },
                };
              case 2:
                if (randomEsquivar) {
                  window.alert(`Has esquivado el efecto negativo!`);
                  if (state.numeroClase == 200) {
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia:
                          P.energia < P.energiaMax ? P.energia + 1 : P.energia,
                      },
                    };
                  } else if (state.numeroClase != 200) {
                    return { ...state, [action.dado]: ESTADO_SHORTCOUT };
                  }
                } else {
                  const vidaFinal = state.casillero > 0 ? P.vida : P.vida - 10;
                  const casilleroFinal =
                    state.casillero > 0 ? state.casillero - 1 : 0;
                  return {
                    ...state,
                    casillero: casilleroFinal,
                    [action.dado]: ESTADO_SHORTCOUT,
                    personaje: {
                      ...state.personaje,
                      vida: vidaFinal,
                      ira:
                        state.numeroClase == 100 && P.ira < 5
                          ? P.ira + 1
                          : P.ira,
                      mana:
                        state.numeroClase == 300 && P.mana < P.manaMax
                          ? P.mana + 1
                          : P.mana,
                    },
                  };
                }

              case 3:
                window.alert(`Camino sin salida!Pierdes un turno`);
                return { ...state };
              case 4:
                if (state.automatico) {
                  const avancePotenciado = 4 + Math.floor(P.ataque / 50);
                  const avanceRandom = randomNumber(avancePotenciado);
                  window.alert(`Avanzas ${avanceRandom} casilleros.`);
                  return {
                    ...state,
                    casillero: state.casillero + avanceRandom,
                    casilleroPrevio: state.casillero,
                    [action.dado]: ESTADO_SHORTCOUT,

                    personaje: {
                      ...state.personaje,
                      energia: P.energia - gastoEnergia,
                      combo:
                        state.numeroClase == 200 && P.combo < P.comboMax
                          ? P.combo + 1
                          : P.combo,
                    },
                  };
                } else if (!state.autoatico) {
                  return {
                    ...state,
                    mostrarDesplegable: true,
                    [action.dado]: ESTADO_SHORTCOUT,

                    personaje: {
                      ...state.personaje,
                      energia: P.energia - gastoEnergia,
                      combo:
                        state.numeroClase == 200 && P.combo < P.comboMax
                          ? P.combo + 1
                          : P.combo,
                    },
                  };
                }
                return { ...state };
              case 5:
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia:
                      P.energia + state[action.dado].estado - gastoEnergia,
                  },
                };
              case 6:
                if (state.automatico) {
                  if (state[action.dado].estado == 4) {
                    if (
                      window.confirm(
                        `Deseas continuar y hacer uso de espada de doble filo? Avance acumulado = ${state.casillerosMovidos}`
                      )
                    ) {
                      const randomFate = randomNumber(6) + 1;
                      if (randomFate < 6) {
                        return {
                          ...state,
                          casillerosMovidos: state.casillerosMovidos + 1,
                        };
                      } else if (randomFate == 6) {
                        if (randomEsquivar) {
                          if (state.numeroClase == 200) {
                            return {
                              ...state,
                              [action.dado]: ESTADO_SHORTCOUT,
                              casillero:
                                state.casillero + state.casillerosMovidos,
                              casillerosMovidos: 0,
                              personaje: {
                                ...state.personaje,
                                energia: P.energia + 1,
                              },
                            };
                          } else {
                            return {
                              ...state,
                              [action.dado]: ESTADO_SHORTCOUT,
                              casillero:
                                state.casillero + state.casillerosMovidos,
                              casillerosMovidos: 0,
                            };
                          }
                        }
                        window.alert(
                          `Ouch! ${
                            state.casillero + state.casillerosMovidos - 6 > 0
                              ? `Retrocedes 6 casilleros.`
                              : `Retrocedes ${
                                  state.casillero
                                } casilleros y pierdes ${
                                  (state.casillero +
                                    state.casillerosMovidos -
                                    6) *
                                  -10
                                } puntos de vida`
                          } `
                        );
                        const mayorCero =
                          state.casillero + state.casillerosMovidos - 6 > 0
                            ? true
                            : false;

                        return {
                          ...state,
                          [action.dado]: ESTADO_SHORTCOUT,
                          casillero: mayorCero
                            ? state.casillero + state.casillerosMovidos - 6
                            : 0,
                          casillerosMovidos: 0,
                          personaje: {
                            ...state.personaje,
                            vida: mayorCero
                              ? P.vida
                              : P.vida +
                                (state.casillero +
                                  state.casillerosMovidos -
                                  6) *
                                  10,
                          },
                        };
                      }
                    } else {
                      return {
                        ...state,
                        casillero: state.casillero + state.casillerosMovidos,
                        casillerosMovidos: 0,
                        [action.dado]: ESTADO_SHORTCOUT,
                      };
                    }
                  } else if (state[action.dado].estado != 4) {
                    return {
                      ...state,
                      [action.dado]: { ...state[action.dado], estado: 4 },
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                        combo:
                          state.numeroClase == 200 && P.combo < P.comboMax
                            ? P.combo + 1
                            : P.combo,
                      },
                    };
                  }
                } else if (!state.automatico) {
                  return {
                    ...state,
                    mostrarDesplegable: true,
                    [action.dado]: ESTADO_SHORTCOUT,
                    personaje: {
                      ...state.personaje,
                      energia: P.energia - gastoEnergia,
                      combo: P.combo < P.comboMax ? P.combo + 1 : P.combo,
                    },
                  };
                }
              case 7:
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                  },
                };
              case 8:
                const cantidadTotalDados =
                  state.numDado +
                  state.bonus.dadosTemporales +
                  state.bonus.dadosPermanentes;
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  bonus: {
                    ...state.bonus,
                    dadosTemporales:
                      cantidadTotalDados < 5
                        ? state.bonus.dadosTemporales + 1
                        : state.bonus.dadosTemporales,
                  },

                  personaje: {
                    ...state.personaje,
                    energia:
                      P.energia + state[action.dado].estado - gastoEnergia,
                  },
                };
              case 9:
                // lider, +1poder ataque base
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    ataqueBase: P.ataqueBase + 1,
                    energia: P.energia - gastoEnergia,
                  },
                };

              case 10:
                const randomMovimiento = randomNumber(100) >= 50 ? 2 : -2;
                const casilleroResultante =
                  state.casillero + randomMovimiento < 0
                    ? 0
                    : state.casillero + randomMovimiento;
                const vidaResultante =
                  state.casillero + randomMovimiento < 0
                    ? P.vida +
                      Math.floor(10 * (state.casillero + randomMovimiento))
                    : P.vida;

                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  casillero: casilleroResultante,
                  personaje: { ...state.personaje, vida: vidaResultante },
                };
              case 11:
                const incrementoIra = P.ira < P.iraMax ? P.ira + 1 : P.ira;
                const incrementoCombo =
                  P.combo < P.comboMax ? P.combo + 1 : P.combo;
                const incrementoMana = P.mana < P.manaMax ? P.mana + 1 : P.mana;
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    ira: incrementoIra,
                    combo: incrementoCombo,
                    mana: incrementoMana,
                    energia: P.energia - gastoEnergia,
                  },
                };
              case 12:
                return { ...state };
              default:
                return { ...state };
            }
          } else if (!action.modo && gastoEnergia <= P.energia) {
            let lvl = 1;
            let spec = 0;
            let tipo = 0;
            let obj = 0;
            console.log(``);

            switch (action.n) {
              case 1:
                danoInfligido = P.ataque;
                if (randomCritico) {
                  danoInfligido = Math.floor(danoInfligido * 2);
                  window.alert(
                    `Haz hecho un ataque critico, infliges ${danoInfligido}`
                  );
                }
                const vampirismo1 = Math.floor(
                  danoInfligido * (P.vampirismo / 100)
                );

                console.log(`vampirismo = `, vampirismo1);
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia:
                      state.numeroClase == 200 && randomCritico
                        ? P.energia - gastoEnergia + 1
                        : P.energia - gastoEnergia,
                    combo:
                      state.numeroClase == 200 && P.combo < P.comboMax
                        ? P.combo + 1
                        : P.combo,
                    vida: P.vida + vampirismo1,
                  },
                };

              case 2:
                if (randomEsquivar) {
                  window.alert(`Has esquivado el efecto negativo!`);
                  if (state.numeroClase == 200) {
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia:
                          P.energia < P.energiaMax ? P.energia + 1 : P.energia,
                      },
                    };
                  } else if (state.numeroClase != 200) {
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        mana:
                          state.numeroClase == 300 && P.mana < P.manaMax
                            ? P.mana + 1
                            : P.mana,
                      },
                    };
                  }
                } else {
                  return {
                    ...state,
                    [action.dado]: ESTADO_SHORTCOUT,

                    personaje: {
                      ...state.personaje,
                      vida: P.defensa > 10 ? P.vida : P.vida + (P.defensa - 10),
                      mana:
                        state.numeroClase == 300 && P.mana < P.manaMax
                          ? P.mana + 1
                          : P.mana,
                    },
                  };
                }

              case 3:
                if (randomEsquivar) {
                  window.alert(`Has esquivado el efecto negativo!`);
                  if (state.numeroClase == 200) {
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia + 1,
                      },
                    };
                  } else {
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        mana:
                          state.numeroClase == 300 && P.mana < P.manaMax
                            ? P.mana + 1
                            : P.mana,
                      },
                    };
                  }
                }
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    vida: P.defensa < 50 ? P.vida - 50 + P.defensa : P.vida,
                    mana:
                      state.numeroClase == 300 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                    ira:
                      state.numeroClase == 100 && P.ira < P.iraMax
                        ? P.ira + 1
                        : P.ira,
                  },
                };
              case 4:
              case 8:
                console.clear();
                const numeroMaximo = state.cantidadPersonajes * 100;
                let arrayProbabilidad = [0.65, 0.4, 0.2, 0.1, 0];
                let arrayX = [0, 1, 2, 3, 4];
                for (let i = 0; i < 4; i++) {
                  let numeroRandom = 0;
                  console.log(`Entra al bucle for padre, valor de i = ${i}`);
                  switch (i) {
                    case 0:
                      const accion = parseInt(action.n);
                      lvl = accion == 4 ? 1 : accion == 8 ? 2 : 3;
                      break;
                    case 1:
                      numeroRandom = randomNumber(numeroMaximo);
                      console.log(
                        `Definicion de spec, numeroRandom = ${numeroRandom}/${numeroMaximo}`
                      );

                      switch (
                        parseInt(state.numeroClase) + parseInt(state.numeroSpec)
                      ) {
                        case 101:
                          break;
                        case 102:
                          arrayX = [1, 0, 2, 3, 4];
                          break;
                        case 201:
                        case 202:
                          arrayX = [2, 0, 1, 4, 3];
                          break;
                        case 301:
                        case 302:
                          arrayX = [3, 0, 4, 1];
                          break;
                        case 401:
                          arrayX = [4, 0, 1, 3];
                          break;
                        case 402:
                          arrayX = [4, 1, 3, 0];
                          break;
                        default:
                          break;
                      }
                      console.log(
                        `ClaseSpec = ${
                          parseInt(state.numeroClase) +
                          parseInt(state.numeroSpec)
                        }, arrayX = ${arrayX}`
                      );

                      bucleSelectorSpec: for (let x = 0; x < 5; x++) {
                        console.log(`Entra al bucle select spec`);
                        if (
                          numeroRandom >=
                          numeroMaximo * arrayProbabilidad[x]
                        ) {
                          spec = arrayX[x];
                          console.log(
                            `Spec seleccionado = ${
                              spec == 0
                                ? `Ataque`
                                : spec == 1
                                ? `Defensa`
                                : spec == 2
                                ? `Agilidad`
                                : spec == 3
                                ? `Maleficio`
                                : `Curacion`
                            }`
                          );
                          break bucleSelectorSpec;
                        } else {
                          continue;
                        }
                      }

                      break;
                    case 2:
                      //seleccion tipo: arma, armadura, joya
                      numeroRandom = randomNumber(numeroMaximo);
                      arrayProbabilidad = [0.6, 0.2, 0];
                      bucleSelectorSpec: for (let x = 0; x < 3; x++) {
                        if (
                          numeroRandom >=
                          numeroMaximo * arrayProbabilidad[x]
                        ) {
                          tipo = x;
                          console.log(
                            `Tipo ${
                              tipo == 0
                                ? `Arma`
                                : tipo == 1
                                ? `Armadura`
                                : `Accesorio`
                            }`
                          );

                          break bucleSelectorSpec;
                        } else {
                          continue;
                        }
                      }

                      break;
                    case 3:
                      //seleccion objeto
                      const longitudBusqueda =
                        arrayEquipo[lvl][spec][tipo].length;
                      numeroRandom = randomNumber(longitudBusqueda);
                      obj = numeroRandom - 1;

                      break;
                    default:
                      lvl = 1;
                      break;
                  }
                }
                // comprobacion de drop repetido
                let codigoString = [lvl, spec, tipo, obj];
                console.log(`El codigo string = ${codigoString.join("")}`);

                let arrayCodigos = [...state.equipo.codigoDrop];
                if (arrayCodigos.includes(codigoString.join(""))) {
                  const accion = parseInt(action.n);
                  const lvlRepetido =
                    accion == 4 ? [1, 2] : accion == 8 ? [2, 3] : [3, 2];
                  console.log("objeto repetido");
                  const arrayLongitudes = [
                    lvlRepetido,
                    arrayX,
                    [0, 1, 2],
                    state.arrayEquipo[lvl][spec][tipo].length,
                  ];
                  let z = 0;
                  comparacionRepetido: for (
                    let a = 0;
                    a < arrayLongitudes[0].length;
                    a++
                  ) {
                    //corrijo nivel

                    codigoString[0] = `${arrayLongitudes[0][a]}`;
                    if (arrayCodigos.includes(codigoString.join(""))) {
                      for (let b = 0; b < arrayLongitudes[1].length; b++) {
                        //corrijo spec

                        z = 1;
                        codigoString[z] = `${arrayLongitudes[z][b]}`;
                        if (arrayCodigos.includes(codigoString.join(""))) {
                          for (let c = 0; c < arrayLongitudes[2].length; c++) {
                            z = 2;
                            //corrijo tipo

                            codigoString[z] = `${arrayLongitudes[z][c]}`;
                            if (arrayCodigos.includes(codigoString.join(""))) {
                              let longitudBusqueda =
                                state.arrayEquipo[codigoString[0]][
                                  codigoString[1]
                                ][codigoString[2]].length;
                              console.log(
                                `Longitud de busqueda: ${longitudBusqueda} // Actual tipo de objeto = ${codigoString}`
                              );

                              for (let d = 0; d < longitudBusqueda; d++) {
                                z = 3;
                                //corrijo objeto

                                codigoString[z] = `${d}`;
                                let objeto = {
                                  ...state.arrayEquipo[codigoString[0]][
                                    codigoString[1]
                                  ][codigoString[2]][codigoString[3]],
                                };

                                if (
                                  arrayCodigos.includes(
                                    codigoString.join("")
                                  ) ||
                                  typeof objeto.nombre == "undefined"
                                  //and is an object...
                                ) {
                                  console.log(`Objeto.nombre=${objeto.nombre}`);
                                  codigoString[3] = 0;
                                  continue;
                                } else {
                                  break comparacionRepetido;
                                }
                              }
                            } else {
                              break comparacionRepetido;
                            }
                          }
                        } else {
                          break comparacionRepetido;
                        }
                      }
                    } else {
                      break comparacionRepetido;
                    }
                  }
                }
                arrayCodigos.push(codigoString.join(""));
                console.log(arrayCodigos);

                let objeto = {
                  ...state.arrayEquipo[codigoString[0]][codigoString[1]][
                    codigoString[2]
                  ][codigoString[3]],
                  clave: codigoString.join(""),
                };
                window.alert(
                  `Has conseguido un nuevo objeto: ${objeto.nombre}`
                );
                switch (parseInt(codigoString[2])) {
                  case 0:
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                      equipo: {
                        ...state.equipo,
                        codigoDrop: arrayCodigos,
                        bolsa: {
                          ...state.equipo.bolsa,
                          arma: [
                            ...state.equipo.bolsa.arma,
                            {
                              ...objeto,
                              indice: `${state.equipo.bolsa.arma.length}`,
                            },
                          ],
                        },
                        actual: {
                          ...state.equipo.actual,
                          arma:
                            state.equipo.actual.arma.length == 0
                              ? [
                                  {
                                    ...objeto,
                                    indice: `${state.equipo.bolsa.arma.length}`,
                                  },
                                ]
                              : state.equipo.actual.arma,
                        },
                      },
                    };
                  case 1:
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                      equipo: {
                        ...state.equipo,
                        codigoDrop: arrayCodigos,
                        bolsa: {
                          ...state.equipo.bolsa,
                          armadura: [
                            ...state.equipo.bolsa.armadura,
                            {
                              ...objeto,
                              indice: `${state.equipo.bolsa.armadura.length}`,
                            },
                          ],
                        },
                        actual: {
                          ...state.equipo.actual,
                          armadura:
                            state.equipo.actual.armadura.length == 0
                              ? [
                                  {
                                    ...objeto,
                                    indice: `${state.equipo.bolsa.armadura.length}`,
                                  },
                                ]
                              : state.equipo.actual.armadura,
                        },
                      },
                    };
                  case 2:
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                      equipo: {
                        ...state.equipo,
                        codigoDrop: arrayCodigos,
                        bolsa: {
                          ...state.equipo.bolsa,
                          joya: [
                            ...state.equipo.bolsa.joya,
                            {
                              ...objeto,
                              indice: `${state.equipo.bolsa.joya.length}`,
                            },
                          ],
                        },
                        actual: {
                          ...state.equipo.actual,
                          joya:
                            state.equipo.actual.joya.length == 0
                              ? [
                                  {
                                    ...objeto,
                                    indice: `${state.equipo.bolsa.joya.length}`,
                                  },
                                ]
                              : state.equipo.actual.joya,
                        },
                      },
                    };
                  default:
                    return { ...state };
                }

              //Switch para ubicar el objeto en la bolsa segun tipo de item

              case 5:
                const totalSanacion = P.vida + P.curacion;

                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    vida:
                      totalSanacion > P.vidaMaxima
                        ? P.vidaMaxima
                        : totalSanacion,
                    energia: P.energia - gastoEnergia,
                    mana:
                      state.numeroClase == 400 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                  },
                };
              case 6:
                if (state.automatico) {
                  if (state[action.dado].estado == 4) {
                    let ataqueRedondeado = randomCritico
                      ? Math.floor(state.ataqueAcumulado * 2)
                      : Math.floor(state.ataqueAcumulado);

                    if (
                      window.confirm(
                        `Deseas continuar y hacer uso de espada de doble filo? Ataque acumulado = ${state.ataqueAcumulado}.`
                      )
                    ) {
                      let carga = P.ataque / 2;
                      const randomFate = randomNumber(6);
                      if (randomFate < 6) {
                        //ataque normal
                        return {
                          ...state,
                          ataqueAcumulado: state.ataqueAcumulado + carga,
                        };
                      } else if (randomFate == 6) {
                        if (randomEsquivar) {
                          window.alert(
                            `Te ha salido el tiro por la culata, pero esquivaste el dano!`
                          );
                          if (state.numeroClase == 200) {
                            return {
                              ...state,
                              [action.dado]: ESTADO_SHORTCOUT,
                              ataqueAcumulado: 0,

                              personaje: {
                                ...state.personaje,
                                energia: P.energia + 1,
                              },
                            };
                          } else {
                            return {
                              ...state,
                              [action.dado]: ESTADO_SHORTCOUT,
                              ataqueAcumulado: 0,
                            };
                          }
                        } else {
                          window.alert(
                            `Ouch! Te ha salido el tiro por la culata. Te infliges ${ataqueRedondeado} puntos de daño.`
                          );
                          const tiroCulata = ataqueRedondeado - P.defensa;
                          const tiroCulataDefensa =
                            tiroCulata < 0 ? 0 : tiroCulata;

                          return {
                            ...state,
                            [action.dado]: ESTADO_SHORTCOUT,
                            ataqueAcumulado: 0,

                            personaje: {
                              ...state.personaje,
                              vida: P.vida - tiroCulataDefensa,
                              //energia: P.energia - gastoEnergia,
                            },
                          };
                        }
                      }
                    } else {
                      window.alert(
                        `Atacas infligiendo ${ataqueRedondeado} puntos de dano.`
                      );
                      const vidaFinal =
                        P.vida +
                        Math.floor((ataqueRedondeado * P.vampirismo) / 2);
                      return {
                        ...state,
                        ataqueAcumulado: 0,
                        [action.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...state.personaje,
                          vida:
                            vidaFinal > P.vidaMaxima ? P.vidaMaxima : vidaFinal,
                        },
                      };
                    }
                  } else if (state[action.dado].estado != 4) {
                    return {
                      ...state,
                      [action.dado]: { ...state[action.dado], estado: 4 },
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                        combo:
                          state.numeroClase == 200 && P.combo < P.comboMax
                            ? P.combo + 1
                            : P.combo,
                      },
                    };
                  }
                } else if (!state.automatico) {
                  return {
                    ...state,
                    mostrarDesplegable: true,
                    modDesplegable: 4,

                    [action.dado]: ESTADO_SHORTCOUT,
                    personaje: {
                      ...state.personaje,
                      energia: P.energia - gastoEnergia,
                      combo: P.combo < P.comboMax ? P.combo + 1 : P.combo,
                    },
                  };
                }
              case 7:
                const ataque7 = Math.floor(P.ataque * 0.5);
                const maleficio7 = Math.floor(P.maleficio * 1);
                const vampirismo = Math.floor(
                  (ataque7 + maleficio7) * (P.vampirismo * 0.1) * 0.8
                );
                const cambioVida =
                  P.vida + vampirismo > P.vidaMaxima
                    ? P.vidaMaxima
                    : P.vida + vampirismo;
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    vida: cambioVida,
                    mana:
                      state.numeroClase == 300 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                    energia: P.energia - gastoEnergia,
                  },
                };
              case 9:
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    maleficioBase: P.maleficioBase + 1,
                    energia: P.energia - gastoEnergia,
                  },
                };

              case 10:
                const randomMovimiento = randomNumber(100) >= 50 ? 2 : -2;
                const casilleroResultante =
                  state.casillero + randomMovimiento < 0
                    ? 0
                    : state.casillero + randomMovimiento;
                const vidaResultante =
                  state.casillero + randomMovimiento < 0
                    ? P.vida +
                      Math.floor(10 * (state.casillero + randomMovimiento))
                    : P.vida;

                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  casillero: casilleroResultante,
                  personaje: { ...state.personaje, vida: vidaResultante },
                };
              case 11:
                const curacion =
                  state.numeroClase == 100 || state.numeroClase == 200
                    ? Math.floor(P.curacion * 4)
                    : Math.floor(P.curacion * 2);
                const vidaFinal = P.vida + curacion;
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    vida: 1,
                  },
                };
              case 12:
                return { ...state };
            }
            return { ...state };
          }
        }
      }
    default:
      return { ...state };
  }
};

export const useGeneralReducer = () => {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  return [state, dispatch];
};
