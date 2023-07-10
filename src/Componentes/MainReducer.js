import { useReducer } from "react";
import { stats, STATS_AUTOMATICO } from "./Objetos/Personajes";
import { DADOS } from "./Objetos/Dados";
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
export const ACCIONES = {
  SELECCION_PERSONAJE: "seleccion-personaje",
  PODER_DADO: "poder-dado",
  NUM_DADO: "num-dado",
  PODER_DADO_CASILLERO: "poder-dado-casillero",
  ROLL_ALL: " roll-all",
  ESPECIAL: "especial",
  LOCK: "lock",
  STATS: { MOD_VIDA: "mod-vida", EXCESO_ENERGIA: "exceso-energia" },
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
  personaje: { ...STATS_AUTOMATICO.rogueMalabarista },
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
};

const reducer = (state, action) => {
  const randomEsquivar =
    Math.floor(Math.random() * 100) + 1 <= state.personaje.esquivar
      ? true
      : false;
  const randomCritico =
    Math.floor(Math.random() * 100) + 1 <= state.personaje.critico
      ? true
      : false;
  console.log(
    `Esquivar:(%${state.personaje.esquivar}) ${randomEsquivar}// Crit:(%${state.personaje.critico}) ${randomCritico}`
  );

  let algunNegativo = false;
  for (let x = 1; x < 6; x++) {
    const dado = `roll${x}`;
    if (state[dado].estado == 3) {
      algunNegativo = true;
    }
  }
  console.log(algunNegativo);
  let danoInfligido = 0;
  let vampirismo = danoInfligido * (state.personaje.vampirismo / 10);
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
          Math.floor(state.efectosPorSec.veneno * 0.25) >=
          Math.floor(Math.random() * 100) + 1
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
        const turnoHealing =
          state.personaje.vida + state.personaje.vidaBase * 0.15;
        const turnoFinalHealing =
          turnoHealing > state.personaje.vidaBase
            ? state.personaje.vidaBase
            : turnoHealing;
        const fraccionTick = 4;
        const hemoTickTurno =
          state.efectosPorSec.hemo > 0 && state.efectosPorSec.tickHemo > 0
            ? parseInt(
                state.efectosPorSec.hemo /
                  (state.efectosPorSec.tickHemo * fraccionTick)
              )
            : 0;

        let cambioVidaFinalTurno =
          state.personaje.energia == state.personaje.energiaMax && !state.accion
            ? turnoFinalHealing
            : state.personaje.vida;
        cambioVidaFinalTurno =
          cambioVidaFinalTurno - hemoTickTurno - venenoFinal;

        return {
          ...state,
          estadoTurno: false,
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
          isFinite(state.personaje.regeneracion) &&
          state.personaje.regeneracion > 0
            ? state.personaje.vida -
              venenoInicial +
              rejuInicioTurno +
              state.personaje.regeneracion
            : state.personaje.vida - venenoInicial + rejuInicioTurno;
        return {
          ...state,
          estadoTurno: true,
          accion: false,
          personaje: {
            ...state.personaje,
            energia: state.personaje.energiaMax,
            vida:
              cambioVidaInicioTurno > state.personaje.vidaBase
                ? state.personaje.vidaBase
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
    case ACCIONES.ROLL_ALL:
      let arrayNumero = [0, 0, 0, 0, 0];
      const arrayPrimera = [0, 1, 3, 7];
      let numModificadorFinal = 1;

      for (let i = 0; i < state.numDado; i++) {
        const aleatorioPrimero =
          Math.floor(Math.random() * arrayPrimera[state.nivelDado]) + 1;
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
          if (aleatorio == 3 && state.nivelDado == 1) {
            const puerta = Math.floor(Math.random() * 2) + 1;
            while (puerta == 2 && aleatorio == 3) {
              console.log(`se evito el 3`);
              aleatorio = Math.floor(Math.random() * 6) + 1;
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
          energia: state.personaje.energia - 1,
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
            casillerosFinales < 0
              ? state.personaje.vida - casillerosFinales * -10
              : state.personaje.vida,
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
              vida: state.personaje.vida - hemoTickRoll,
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
      console.log(
        `Nuevo porcentaje = ${
          (state.personaje.vida / state.personaje.vidaBase) * 100
        }% `
      );
      return {
        ...state,
        porcentajeVida: Math.floor(
          (state.personaje.vida / state.personaje.vidaBase) * 100
        ),
        personaje: {
          ...state.personaje,
          vida:
            state.personaje.vida > state.personaje.vidaBase
              ? state.personaje.vidaBase
              : state.personaje.vida,
        },
      };
    case ACCIONES.STATS.MOD_VIDA:
      const danoFiltrado =
        action.valor > state.personaje.defensa
          ? action.valor - state.personaje.defensa
          : action.valor < 1
          ? action.valor
          : 0;
      return {
        ...state,
        personaje: {
          ...state.personaje,
          vida:
            state.personaje.vida - danoFiltrado > state.personaje.vidaBase
              ? state.personaje.vidaBase
              : state.personaje.vida - danoFiltrado,
          ira:
            state.numeroClase == 100 &&
            state.personaje.ira < state.personaje.iraMax &&
            danoFiltrado > 0
              ? state.personaje.ira + 1
              : state.personaje.ira,
        },
      };
    case ACCIONES.STATS.EXCESO_ENERGIA:
      switch (action.caso) {
        case "exceso":
          return {
            ...state,
            personaje: {
              ...state.personaje,
              energia: state.personaje.energiaMax,
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
              Math.floor(
                state.personaje.mana +
                  state.personaje.mana * (state.personaje.maleficio / 200)
              ),
            personaje: { ...state.personaje, mana: 0 },
          };
        case 402:
          const healing =
            state.personaje.vida +
            Math.floor(state.personaje.mana * (state.personaje.curacion / 3));
          const overhealingBool =
            healing > state.personaje.vidaBase ? true : false;
          return {
            ...state,
            personaje: {
              ...state.personaje,
              mana: 0,
              vida: overhealingBool ? state.personaje.vidaBase : healing,
              vidaBase: overhealingBool
                ? state.personaje.vidaBase +
                  Math.floor((healing - state.personaje.vidaBase) / 10)
                : state.personaje.vidaBase,
            },
          };

        default:
          return { ...state };
      }
      return { ...state };
    case ACCIONES.IRA_DADOS:
      const totalDados = state.personaje.ira + state.dadoExtra + 2;

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
        state.numeroClase == 200 && state.numeroSpec == 1
          ? state.personaje.combo * 5
          : 0;
      const comboEsquivar =
        state.numeroClase == 200 && state.numeroSpec == 2
          ? state.personaje.combo * 5
          : 0;

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
          ? arrayStatsValores[0] * (state.personaje.ira * 0.1)
          : 0;
      const iraModAtaque =
        state.numeroSpec == 1 && state.numeroClase == 100
          ? arrayStatsValores[1] * (state.personaje.ira * 0.1)
          : 0;

      const totalDefensa = parseInt(
        state.personaje.defensaBase + iraModDefensa + arrayStatsValores[0]
      );
      const totalAtaque = parseInt(
        state.personaje.ataqueBase + iraModAtaque + arrayStatsValores[1]
      );
      const criticoTotal =
        state.personaje.criticoBase + arrayStatsValores[2] + comboCritico;
      const esquivarTotal =
        state.personaje.esquivarBase + arrayStatsValores[3] + comboEsquivar;
      const maleficioTotal =
        state.personaje.maleficioBase + arrayStatsValores[4];
      const curacionTotal = state.personaje.curacionBase + arrayStatsValores[5];
      const vampirismoTotal = state.personaje.vampirismo + arrayStatsValores[6];
      const defMagicaFromDefensa = Math.floor(totalDefensa / 50);
      const defensaMagicaTotal =
        state.personaje.defensaMagica +
        arrayStatsValores[7] +
        defMagicaFromDefensa;
      const regeneracionTotal =
        state.personaje.regeneracionBase + arrayStatsValores[8];
      const vidaMaximaTotal = state.personaje.vidaMaxima + arrayStatsValores[9];

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

    /*
      const arrayEquipoDefensa = [
        state.equipo.actual.arma[0]?.defensa,
        state.equipo.actual.armadura[0]?.defensa,
        state.equipo.actual.joya[0]?.defensa,
      ];
      let equipoDefensa = 0;
      arrayEquipoDefensa.forEach((element) => {
        if (typeof element === "number") {
          equipoDefensa = equipoDefensa + element;
        }
      });
      console.log(`La defensa del equipo = ${equipoDefensa}`);*/

    //ATAQUE
    /*const arrayEquipoAtaque = [
        state.equipo.actual.arma[0]?.ataque,
        state.equipo.actual.armadura[0]?.ataque,
        state.equipo.actual.joya[0]?.ataque,
      ];
      let equipoAtaque = 0;
      arrayEquipoAtaque.forEach((element) => {
        if (typeof element === "number") {
          equipoAtaque = equipoAtaque + element;
        }
      });
      console.log(`El ataque del equipo = ${equipoAtaque}`);*/

    //CRITICO

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
          if (action.modo && gastoEnergia <= state.personaje.energia) {
            switch (action.n) {
              case 1:
                return {
                  ...state,
                  casillero: state.casillero + 1,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: state.personaje.energia - gastoEnergia,
                    combo:
                      state.personaje.combo < state.personaje.comboMax
                        ? state.personaje.combo + 1
                        : state.personaje.combo,
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
                          state.personaje.energia < state.personaje.energiaMax
                            ? state.personaje.energia + 1
                            : state.personaje.energia,
                      },
                    };
                  } else if (state.numeroClase != 200) {
                    return { ...state, [action.dado]: ESTADO_SHORTCOUT };
                  }
                } else {
                  const vidaFinal =
                    state.casillero > 0
                      ? state.personaje.vida
                      : state.personaje.vida - 10;
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
                        state.numeroClase == 100 && state.personaje.ira < 5
                          ? state.personaje.ira + 1
                          : state.personaje.ira,
                      mana:
                        state.numeroClase == 300 &&
                        state.personaje.mana < state.personaje.manaMax
                          ? state.personaje.mana + 1
                          : state.personaje.mana,
                    },
                  };
                }

              case 3:
                window.alert(`Camino sin salida!Pierdes un turno`);
                return { ...state };
              case 4:
                if (state.automatico) {
                  const avanceRandom = Math.floor(Math.random() * 4) + 1;
                  window.alert(`Avanzas ${avanceRandom} casilleros.`);
                  return {
                    ...state,
                    casillero: state.casillero + avanceRandom,
                    casilleroPrevio: state.casillero,
                    [action.dado]: ESTADO_SHORTCOUT,

                    personaje: {
                      ...state.personaje,
                      energia: state.personaje.energia - gastoEnergia,
                      combo:
                        state.numeroClase == 200 &&
                        state.personaje.combo < state.personaje.comboMax
                          ? state.personaje.combo + 1
                          : state.personaje.combo,
                    },
                  };
                } else if (!state.autoatico) {
                  return {
                    ...state,
                    mostrarDesplegable: true,
                    [action.dado]: ESTADO_SHORTCOUT,

                    personaje: {
                      ...state.personaje,
                      energia: state.personaje.energia - gastoEnergia,
                      combo:
                        state.numeroClase == 200 &&
                        state.personaje.combo < state.personaje.comboMax
                          ? state.personaje.combo + 1
                          : state.personaje.combo,
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
                      state.personaje.energia +
                      state[action.dado].estado -
                      gastoEnergia,
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
                      const randomFate = Math.floor(Math.random() * 6) + 1;
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
                                energia: state.personaje.energia + 1,
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
                              ? state.personaje.vida
                              : state.personaje.vida +
                                (state.casillero +
                                  state.casillerosMovidos -
                                  6) *
                                  10,
                            //energia: state.personaje.energia - gastoEnergia,
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
                        energia: state.personaje.energia - gastoEnergia,
                        combo:
                          state.numeroClase == 200 &&
                          state.personaje.combo < state.personaje.comboMax
                            ? state.personaje.combo + 1
                            : state.personaje.combo,
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
                      energia: state.personaje.energia - gastoEnergia,
                      combo:
                        state.personaje.combo < state.personaje.comboMax
                          ? state.personaje.combo + 1
                          : state.personaje.combo,
                    },
                  };
                }
                return { ...state };
            }
          } else if (!action.modo && gastoEnergia <= state.personaje.energia) {
            let lvl = 1;
            let spec = 0;
            let tipo = 0;
            let obj = 0;
            console.log(``);

            switch (action.n) {
              case 1:
                danoInfligido = state.personaje.ataque;
                if (randomCritico) {
                  danoInfligido = Math.floor(danoInfligido * 2);
                  window.alert(
                    `Haz hecho un ataque critico, infliges ${danoInfligido}`
                  );
                }
                vampirismo = danoInfligido * (state.personaje.vampirismo / 100);

                console.log(`vampirismo = `, vampirismo);
                return {
                  ...state,
                  casillero: state.casillero + 1,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia:
                      state.numeroClase == 200 && randomCritico
                        ? state.personaje.energia - gastoEnergia + 1
                        : state.personaje.energia - gastoEnergia,
                    combo:
                      state.numeroClase == 200 &&
                      state.personaje.combo < state.personaje.comboMax
                        ? state.personaje.combo + 1
                        : state.personaje.combo,
                    vida: state.personaje.vida + vampirismo,
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
                          state.personaje.energia < state.personaje.energiaMax
                            ? state.personaje.energia + 1
                            : state.personaje.energia,
                      },
                    };
                  } else if (state.numeroClase != 200) {
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        mana:
                          state.numeroClase == 300 &&
                          state.personaje.mana < state.personaje.manaMax
                            ? state.personaje.mana + 1
                            : state.personaje.mana,
                      },
                    };
                  }
                } else {
                  return {
                    ...state,
                    [action.dado]: ESTADO_SHORTCOUT,

                    personaje: {
                      ...state.personaje,
                      vida:
                        state.personaje.defensa > 10
                          ? state.personaje.vida
                          : state.personaje.vida +
                            (state.personaje.defensa - 10),
                      mana:
                        state.numeroClase == 300 &&
                        state.personaje.mana < state.personaje.manaMax
                          ? state.personaje.mana + 1
                          : state.personaje.mana,
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
                        energia: state.personaje.energia + 1,
                      },
                    };
                  } else {
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        mana:
                          state.numeroClase == 300 &&
                          state.personaje.mana < state.personaje.manaMax
                            ? state.personaje.mana + 1
                            : state.personaje.mana,
                      },
                    };
                  }
                }
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    vida: state.personaje.vida - 30,
                    vida:
                      state.personaje.defensa < 50
                        ? state.personaje.vida - 50 + state.personaje.defensa
                        : state.personaje.vida,
                    mana:
                      state.numeroClase == 300 &&
                      state.personaje.mana < state.personaje.manaMax
                        ? state.personaje.mana + 1
                        : state.personaje.mana,
                  },
                };
              case 4:
              case 8:
                console.clear();
                console.log(`Entra al case 4`);
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
                      console.log(
                        `Entra al case 0 hijo, definicion de lvl = ${lvl}`
                      );
                      break;
                    case 1:
                      numeroRandom =
                        Math.floor(Math.random() * numeroMaximo) + 1;
                      console.log(
                        `Entra al case 1 hijo, definicion de spec, numeroRandom = ${numeroRandom}`
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
                          console.log(
                            `Entra al switch de clase rogue, arrayX = ${arrayX}`
                          );
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
                      bucleSelectorSpec: for (let x = 0; x < 5; x++) {
                        console.log(`Entra al bucle select spec`);
                        if (
                          numeroRandom >=
                          numeroMaximo * arrayProbabilidad[x]
                        ) {
                          spec = arrayX[x];
                          console.log(
                            `Encuentra valor en spec = ${
                              arrayX[x]
                            }, numeroRandom = ${numeroRandom / numeroMaximo}%`
                          );
                          break bucleSelectorSpec;
                        } else {
                          continue;
                        }
                      }

                      break;
                    case 2:
                      //seleccion tipo: arma, armadura, joya
                      numeroRandom =
                        Math.floor(Math.random() * numeroMaximo) + 1;
                      arrayProbabilidad = [0.6, 0.2, 0];
                      console.log(
                        `Entra a la seleccion de TIPO, numeroRandom = ${numeroRandom}`
                      );
                      bucleSelectorSpec: for (let x = 0; x < 3; x++) {
                        if (
                          numeroRandom >=
                          numeroMaximo * arrayProbabilidad[x]
                        ) {
                          tipo = x;
                          console.log(
                            `Encuentra valor de tipo = ${x} = ${tipo}?`
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
                      console.log(
                        `Ultimo case del switch, objeto, longitudBusqueda = ${longitudBusqueda}`
                      );

                      numeroRandom =
                        Math.floor(Math.random() * longitudBusqueda) + 1;
                      obj = numeroRandom - 1;
                      console.log(
                        `Encuentra valor de objeto = ${numeroRandom} = ${obj}?`
                      );

                      break;
                    default:
                      lvl = 1;
                      break;
                  }
                }
                // comprobacion de drop repetido
                let codigoString = [lvl, spec, tipo, obj];
                console.log(`El codigo array = ${codigoString}`);
                console.log(`El codigo string = ${codigoString.join("")}`);

                console.log(
                  `Checkeando acceso a caracteres: 0= ${codigoString[0]}, 2= ${codigoString[2]}`
                );
                let arrayCodigos = [...state.equipo.codigoDrop];
                if (arrayCodigos.includes(codigoString.join(""))) {
                  console.log("objeto repetido");
                  const arrayLongitudes = [
                    [1, 2],
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
                    console.log(`bucle nivel`);

                    codigoString[0] = `${arrayLongitudes[0][a]}`;
                    if (arrayCodigos.includes(codigoString.join(""))) {
                      for (let b = 0; b < arrayLongitudes[1].length; b++) {
                        //corrijo spec
                        console.log(`bucle spec`);

                        z = 1;
                        codigoString[z] = `${arrayLongitudes[z][b]}`;
                        if (arrayCodigos.includes(codigoString.join(""))) {
                          for (let c = 0; c < arrayLongitudes[2].length; c++) {
                            z = 2;
                            //corrijo tipo
                            console.log(`bucle tipo`);

                            codigoString[z] = `${arrayLongitudes[z][c]}`;
                            if (arrayCodigos.includes(codigoString.join(""))) {
                              for (let d = 0; d < arrayLongitudes[3]; d++) {
                                z = 3;
                                //corrijo objeto
                                console.log(`bucle final`);

                                codigoString[z] = `${d}`;
                                console.log(
                                  `referencia para modificar ultimo char = ${arrayLongitudes[z][d]}`
                                );

                                if (
                                  arrayCodigos.includes(codigoString.join(""))
                                ) {
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
                console.log(`Ataque del objeto = ${objeto.ataque}`);
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
                        energia: state.personaje.energia - gastoEnergia,
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
                        energia: state.personaje.energia - gastoEnergia,
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
                        energia: state.personaje.energia - gastoEnergia,
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
                const totalSanacion =
                  state.personaje.vida + state.personaje.curacion;

                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    vida:
                      totalSanacion > state.personaje.vidaBase
                        ? state.personaje.vidaBase
                        : totalSanacion,
                    energia: state.personaje.energia - gastoEnergia,
                    mana:
                      state.numeroClase == 400 &&
                      state.personaje.mana < state.personaje.manaMax
                        ? state.personaje.mana + 1
                        : state.personaje.mana,
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
                      let carga = state.personaje.ataque / 2;
                      const randomFate = Math.floor(Math.random() * 6) + 1;
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
                                energia: state.personaje.energia + 1,
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
                          const tiroCulata =
                            ataqueRedondeado - state.personaje.defensa;
                          const tiroCulataDefensa =
                            tiroCulata < 0 ? 0 : tiroCulata;

                          return {
                            ...state,
                            [action.dado]: ESTADO_SHORTCOUT,
                            ataqueAcumulado: 0,

                            personaje: {
                              ...state.personaje,
                              vida: state.personaje.vida - tiroCulataDefensa,
                              //energia: state.personaje.energia - gastoEnergia,
                            },
                          };
                        }
                      }
                    } else {
                      window.alert(
                        `Atacas infligiendo ${ataqueRedondeado} puntos de dano.`
                      );
                      const vidaFinal =
                        state.personaje.vida +
                        Math.floor(
                          (ataqueRedondeado * state.personaje.vampirismo) / 2
                        );
                      return {
                        ...state,
                        ataqueAcumulado: 0,
                        [action.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...state.personaje,
                          vida:
                            vidaFinal > state.personaje.vidaMaxima
                              ? state.personaje.vidaMaxima
                              : vidaFinal,
                        },
                      };
                    }
                  } else if (state[action.dado].estado != 4) {
                    return {
                      ...state,
                      [action.dado]: { ...state[action.dado], estado: 4 },
                      personaje: {
                        ...state.personaje,
                        energia: state.personaje.energia - gastoEnergia,
                        combo:
                          state.numeroClase == 200 &&
                          state.personaje.combo < state.personaje.comboMax
                            ? state.personaje.combo + 1
                            : state.personaje.combo,
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
                      energia: state.personaje.energia - gastoEnergia,
                      combo:
                        state.personaje.combo < state.personaje.comboMax
                          ? state.personaje.combo + 1
                          : state.personaje.combo,
                    },
                  };
                }
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
