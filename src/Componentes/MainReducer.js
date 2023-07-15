import { useReducer } from "react";
import { STATS_AUTOMATICO } from "./Objetos/Personajes";
import { efectosPSec } from "./Objetos/EfectosPS";
import { EQUIPO, arrayEquipo } from "./Objetos/Equipo";
import { ACCIONES, A } from "./Objetos/Acciones";
const estadoRoll = {
  numero: 0,
  modo: true,
  lock: false,
  activo: false,
  especial: false,
  estado: 1,
  peste: [false, 0],
};
const FUNCIONES = {
  OVERHEALING: "overhealing",
  CURACION: "curacion",
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
const estadoInicial = {
  numeroClase: 200,
  numeroSpec: 2,
  estadoTurno: true,
  casillero: 23,
  casilleroPrevio: 23,
  casillerosMovidos: 0,
  nivelDado: 3,
  poderDado: 20,
  numDado: 5,
  numDadoMaximo: 5,
  dadoExtra: 0,
  dados: {
    dadosTotales: 5,
    dadosBase: 2,
    dadoIra: 0,
    dadosAdd: 3,
    dadosTemporales: 0,
    dadosPermanentes: 0,
  },
  personaje: {
    ...STATS_AUTOMATICO.rogueMalabarista,
  },
  bonus: {
    vida: 0,
    dadosTemporales: 0,
    dadosPermanentes: 0,
    blindado: false,
    esfumarse: false,
  },
  porcentajeVida: 100,
  regeneracion: 0,
  automatico: true,
  mostrarDesplegable: false,
  modDesplegable: 1,
  ataqueAcumulado: 0,

  roll1: { ...estadoRoll },
  roll2: { ...estadoRoll },
  roll3: { ...estadoRoll },
  roll4: { ...estadoRoll },
  roll5: { ...estadoRoll },
  roll6: { ...estadoRoll },
  roll7: { ...estadoRoll },
  roll8: { ...estadoRoll },
  roll9: { ...estadoRoll },
  roll10: { ...estadoRoll },
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
  uniMod: [12, 10, 14, 15, 17, 20],
  pesteIntensidad: 1,
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

  const claseSpec = parseInt(state.numeroClase) + parseInt(state.numeroSpec);
  const randomEsquivar = randomNumber(100) <= P.esquivar ? true : false;
  const randomCritico = randomNumber(100) <= P.critico ? true : false;
  const numDadosValido =
    state.dados.dadosTotales > state.numDadoMaximo
      ? state.numDadoMaximo
      : state.dados.dadosTotales;
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
  let danoInfligido = 0;
  switch (action.type) {
    case ACCIONES.SELECCION_PERSONAJE:
      if (action.caso === "clase") {
        return { ...state, numeroClase: action.valor };
      } else if (action.caso === "spec") {
        return { ...state, numeroSpec: action.valor };
      } else if (action.caso === "personaje") {
        switch (claseSpec) {
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
    case ACCIONES.CONTAGIO_PESTE:
      const danoPeste = Math.floor(P.vidaMaxima * 0.05 * state.pesteIntensidad);
      let objetivo = null;
      for (let x = 1; x <= state.dados.dadosTotales; x++) {
        if (
          ![action.dado] == `roll${x}` ||
          ([action.dado] == `roll${x}` &&
            state[`roll${x - 1}`]?.peste[0] &&
            state[`roll${x + 1}`]?.peste[0])
        )
          //si el dado con peste no es el dado actual, o si lo fuera, que los adyacentes no tengan peste ambos
          continue;
        if (!state[`roll${x - 1}`]?.peste[0]) {
          objetivo = `roll${x - 1}`;
          break;
        } else if (!state[`roll${x + 1}`]?.peste[0]) {
          objetivo = `roll${x + 1}`;
          break;
        } else {
          objetivo = `roll${x}`;
        }
      }

      return {
        ...state,
        pesteIntensidad: state.pesteIntensidad + 1,
        [action.dado]: { ...state[action.dado], peste: [true, 3] },
        [objetivo]: { ...state[objetivo], peste: [true, 3] },
        efectosPorSec: {
          ...state.efectosPorSec,
          veneno: state.efectosPorSec.veneno + danoPeste,
          tickVeneno:
            state.efectosPorSec.tickVeneno > 0
              ? Math.floor(state.efectosPorSec.tickVeneno + 3 / 2)
              : 3,
        },
      };
    case ACCIONES.TOGGLE_TURNO:
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
        const turnoHealing = calcularHealing(
          P.vidaMaxima * 0.15,
          FUNCIONES.CURACION
        );
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

        const reposo =
          P.energia == P.energiaMax && !state.accion
            ? turnoFinalHealing
            : P.vida;
        const cambioVidaFinalTurno = Math.floor(
          reposo - hemoTickTurno - venenoFinal
        );

        return {
          ...state,
          estadoTurno: false,
          dados: { ...state.dados, dadosTemporales: 0 },
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
                : state.efectosPorSec.hemo -
                  Math.floor(
                    state.efectosPorSec.hemo / state.efectosPorSec.tickHemo
                  ),
            tickHemo:
              state.efectosPorSec.tickHemo > 0
                ? state.efectosPorSec.tickHemo - 1
                : 0,
            veneno: state.efectosPorSec.veneno - venenoTickTurno * 2,
            tickVeneno:
              state.efectosPorSec.tickVeneno > 0
                ? state.efectosPorSec.tickVeneno - 1
                : 0,
            tickPsicosis:
              state.efectosPorSec.tickPsicosis > 0
                ? state.efectosPorSec.tickPsicosis - 1
                : state.efectosPorSec.tickPsicosis,
          },
          pesteIntensidad: 1,
          roll1: { ...state.roll1, numero: 0, estado: 1, lock: false },
          roll2: { ...state.roll2, numero: 0, estado: 1, lock: false },
          roll3: { ...state.roll3, numero: 0, estado: 1, lock: false },
          roll4: { ...state.roll4, numero: 0, estado: 1, lock: false },
          roll5: { ...state.roll5, numero: 0, estado: 1, lock: false },
          roll6: { ...state.roll6, numero: 0, estado: 1, lock: false },
          roll7: { ...state.roll7, numero: 0, estado: 1, lock: false },
          roll8: { ...state.roll8, numero: 0, estado: 1, lock: false },
          roll9: { ...state.roll9, numero: 0, estado: 1, lock: false },
          roll10: { ...state.roll10, numero: 0, estado: 1, lock: false },
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
        const manaClarividenciaCalculo =
          state.efectosPorSec.chanceClari >= randomNumber(100) &&
          state.numeroClase == 400
            ? state.efectosPorSec.clarividencia
            : 0;
        const manaClarividenciaFinal =
          manaClarividenciaCalculo + P.mana > P.manaMax
            ? P.manaMax
            : P.mana + manaClarividenciaCalculo;
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
            mana: manaClarividenciaFinal,
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
          bonus: { ...state.bonus, blindado: false, esfumarse: false },
        };
      }
    case ACCIONES.NUM_DADO:
      const valor = parseInt(action.valor);
      return {
        ...state,
        dados: { ...state.dados, dadosAdd: state.dados.dadosAdd + valor },
      };
    case ACCIONES.PODER_DADO:
      if (state.casillero < 20) return { ...state };
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
    case ACCIONES.HANDLE_NUMERO_DADOS:
      const totalCantidadDados =
        state.dados.dadosBase +
        state.dados.dadoIra +
        state.dados.dadosAdd +
        state.dados.dadosTemporales +
        state.dados.dadosPermanentes;

      console.log(`se mete en el calculo de dados`);

      return {
        ...state,
        dados: { ...state.dados, dadosTotales: totalCantidadDados },
      };
    /*case "correccion":
          if (totalCantidadDados <= limite) return { ...state };

          const secuenciaCorrectora = [
            "dadosAdd",
            "dadosTemporales",
            "dadoIra",
            "dadosPermanentes",
          ];
          let arrayValores = secuenciaCorrectora.map(
            (elemento) => state.dados[elemento]
          );

          let diferencia = totalCantidadDados - limite;
          //bucle corrector
          for (let x = 0; x < secuenciaCorrectora.length; x++) {
            if (arrayValores[x] < diferencia) {
              diferencia = diferencia - arrayValores[x];
              arrayValores[x] = 0;
            } else {
              arrayValores[x] = arrayValores[x] - diferencia;
              break;
            }
          }
          return {
            ...state,
            dados: {
              ...state.dados,
              [secuenciaCorrectora[0]]: arrayValores[0],
              [secuenciaCorrectora[1]]: arrayValores[1],
              [secuenciaCorrectora[2]]: arrayValores[2],
              [secuenciaCorrectora[3]]: arrayValores[3],
            },
          };*/

    //   default:
    //     return { ...state };
    // }

    case ACCIONES.PODER_DADO_CASILLERO:
      //regula nivel, poder
      const casillero = state.casillero;
      return {
        ...state,
        poderDado: casillero > 19 ? state.poderDado : casillero > 9 ? 12 : 6,
        nivelDado: casillero > 19 ? state.nivelDado : casillero > 9 ? 2 : 1,
        numDadoMaximo: casillero > 19 ? 10 : 5,
      };

      return {
        ...state,
        poderDado: casillero > 19 ? 12 : casillero > 9 ? 12 : 6,
        nivelDado: casillero > 19 ? 2 : casillero > 9 ? 2 : 1,
        numDadoMaximo: casillero > 19 ? 10 : 5,
      };
    case ACCIONES.LOCK:
      return { ...state };
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
      return { ...state, algunNegativo: algunNegativo };
    case ACCIONES.ROLL_ALL:
      let arrayNumero = [];
      const arrayPrimera = [0, 1, 3, 7];
      let numModificadorFinal = 1;
      const numDado = numDadosValido;

      for (let i = 0; i < numDado; i++) {
        const aleatorioPrimero = randomNumber(arrayPrimera[state.nivelDado]);
        if (aleatorioPrimero > arrayPrimera[2]) {
          numModificadorFinal = 13;
        } else if (aleatorioPrimero > 1) {
          numModificadorFinal = 7;
        } else {
          numModificadorFinal = 1;
        }

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
                aleatorio = randomNumber(6);
              } else if (state.nivelDado == 2) {
                console.log(`se evito el 10`);
                aleatorio = randomNumber(12);
              }
            }
          }
          arrayNumero[i] = aleatorio;
        }
      }
      //Peste
      let arrayRollX = [];
      let arrayPeste = [];

      for (let x = 0; x < 10; x++) {
        arrayRollX.push(`roll${x + 1}`);
        const peste = state[arrayRollX[x]].peste[0];
        const cargas = state[arrayRollX[x]].peste[1];
        //podria prescindirse del boolean peste
        if (peste && cargas > 1) {
          arrayPeste.push([true, cargas - 1]);
        } else {
          arrayPeste.push([false, 0]);
        }
      }

      return {
        ...state,
        rollFlag: !state.rollFlag,
        accion: true,
        roll1: { ...state.roll1, numero: arrayNumero[0], peste: arrayPeste[0] },
        roll2: { ...state.roll2, numero: arrayNumero[1], peste: arrayPeste[1] },
        roll3: { ...state.roll3, numero: arrayNumero[2], peste: arrayPeste[2] },
        roll4: { ...state.roll4, numero: arrayNumero[3], peste: arrayPeste[3] },
        roll5: { ...state.roll5, numero: arrayNumero[4], peste: arrayPeste[4] },
        roll6: { ...state.roll6, numero: arrayNumero[5], peste: arrayPeste[5] },
        roll7: { ...state.roll7, numero: arrayNumero[6], peste: arrayPeste[6] },
        roll8: { ...state.roll8, numero: arrayNumero[7], peste: arrayPeste[7] },
        roll9: { ...state.roll9, numero: arrayNumero[8], peste: arrayPeste[8] },
        roll10: {
          ...state.roll10,
          numero: arrayNumero[9],
          peste: arrayPeste[9],
        },
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
        roll6: { ...state.roll6, estado: arrayEspecial[5] },
        roll7: { ...state.roll7, estado: arrayEspecial[6] },
        roll8: { ...state.roll8, estado: arrayEspecial[7] },
        roll9: { ...state.roll9, estado: arrayEspecial[8] },
        roll10: { ...state.roll10, estado: arrayEspecial[9] },
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
      const reducRetroceso =
        action.valor < 0
          ? -P.defensaMagica > action.valor
            ? action.valor + P.defensaMagica
            : 0
          : action.valor;
      const casillerosFinales = state.casillero + reducRetroceso;

      return {
        ...state,
        casillero: casillerosFinales < 0 ? 0 : casillerosFinales,
        personaje: {
          ...state.personaje,
          vida:
            casillerosFinales < 0 ? P.vida - casillerosFinales * -10 : P.vida,
        },
      };
    case ACCIONES.MOD_DESPLEGABLE:
      const cambio = action.direccion == "der" ? 1 : -1;
      let nuevoModo = state.modDesplegable + cambio;
      const numeroMaxModos = 5;
      if (nuevoModo > numeroMaxModos) {
        nuevoModo = 1;
      } else if (nuevoModo < 1) {
        nuevoModo = numeroMaxModos;
      }

      return { ...state, modDesplegable: nuevoModo };
    case ACCIONES.PSICOSIS:
      if (action.fase == "carga") {
        const danoPsicosis = Math.floor(action.poder * P.vidaMaxima * 0.01);
        return {
          ...state,
          efectosPorSec: {
            ...state.efectosPorSec,
            psicosis: danoPsicosis,
            tickPsicosis: 3,
          },
        };
      } else if (action.fase == "golpe") {
        const vidaFinalPsicosis = calcularHealing(
          -action.retroceso * state.efectosPorSec.psicosis,
          FUNCIONES.CURACION
        );
        return {
          ...state,
          personaje: { ...state.personaje, vida: vidaFinalPsicosis },
        };
      }
      return { ...state };
    case ACCIONES.EFECTOS_PS:
      const tipo = isNaN(action.tipo) ? action.tipo : parseInt(action.tipo);
      switch (tipo) {
        case 1:
          //hemo
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
                  ? Math.floor(
                      (state.efectosPorSec.tickVeneno + action.ticks) / 2
                    )
                  : action.ticks,
            },
          };
        case 3:
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
      if (randomEsquivar && action.valor > 0) {
        window.alert(`Has esquivado el efecto negativo`);
        return {
          ...state,
          personaje: {
            ...state.personaje,
            energia:
              (P.energia < P.energiaMax && claseSpec == 201) || claseSpec == 202
                ? P.energia + 1
                : P.energia,
          },
        };
      }
      return {
        ...state,
        personaje: {
          ...state.personaje,
          vida:
            P.vida - danoFiltrado > P.vidaMaxima
              ? P.vidaMaxima
              : P.vida - danoFiltrado,
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
        case 101:
        case 102:
          return {
            ...state,
            personaje: { ...state.personaje, ira: 0 },
          };
        case 201:
        case 202:
          const energiaCombo = P.energia + Math.floor(P.combo / 2);
          const energiaComboFinal =
            energiaCombo < P.energiaMax ? energiaCombo : P.energiaMax;
          return {
            ...state,
            personaje: {
              ...state.personaje,
              combo: 0,
              energia: energiaComboFinal,
            },
          };
        case 301:
        case 302:
          return { ...state, personaje: { ...state.personaje, mana: 0 } };
        case 401:
          return {
            ...state,
            casillero:
              state.casillero +
              Math.floor(P.mana + Math.floor(P.mana * (P.maleficio / 200))),
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
    case ACCIONES.HANDLE_IRA:
      return {
        ...state,
        personaje: {
          ...state.personaje,
          ira: P.ira < P.iraMax ? P.ira + 1 : P.ira,
        },
      };
    case ACCIONES.IRA_DADOS:
      const totalDadosIra = P.ira;

      return {
        ...state,
        dados: { ...state.dados, dadoIra: totalDadosIra },
      };
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
      const modificadorBlindado = state.bonus.blindado ? 2 : 1;
      const totalDefensa =
        parseInt(P.defensaBase + iraModDefensa + arrayStatsValores[0]) *
        modificadorBlindado;
      const totalAtaque = parseInt(
        P.ataqueBase + iraModAtaque + arrayStatsValores[1]
      );
      const criticoTotal = P.criticoBase + arrayStatsValores[2] + comboCritico;
      const esquivarTotal =
        P.esquivarBase + arrayStatsValores[3] + comboEsquivar;
      const maleficioTotal = P.maleficioBase + arrayStatsValores[4];
      const curacionTotal = P.curacionBase + arrayStatsValores[5];
      const vampirismoTotal = P.vampirismoBase + arrayStatsValores[6];
      const defMagicaFromDefensa =
        Math.floor(totalDefensa / 50) > 0 ? Math.floor(totalDefensa / 50) : 0;
      const defensaMagicaTotal =
        P.defensaMagicaBase + arrayStatsValores[7] + defMagicaFromDefensa;
      const regeneracionTotal = P.regeneracionBase + arrayStatsValores[8];
      const vidaMaximaTotal =
        P.vidaBase + arrayStatsValores[9] + state.bonus.vida;
      console.log(`Bonus vida maxima = ${state.bonus.vida} `);

      return {
        ...state,
        personaje: {
          ...state.personaje,
          esquivar: state.bonus.esfumarse ? 99 : esquivarTotal,
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
          const gastoEnergia = action.gastoEnergia;
          // const estadoActual = parseInt(state[action.dado].estado);
          // switch (estadoActual) {
          //   case 1:
          //     gastoEnergia = 1;
          //     break;
          //   case 2:
          //   case 3:
          //     gastoEnergia = 0;
          //     break;
          // }
          console.log(`energia = ${gastoEnergia}`);
          if (gastoEnergia > P.energia) return { ...state };
          const uniModPresente = state.uniMod.includes(action.n);
          if (action.modo || (!action.modo && uniModPresente)) {
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
                  const vidaFinal =
                    state.casillero + P.defensaMagica > 0
                      ? P.vida
                      : P.vida - 10;
                  const retroceso = P.defensaMagica >= 1 ? 0 : 1;
                  const casilleroFinal =
                    state.casillero > 0 ? state.casillero - retroceso : 0;
                  return {
                    ...state,
                    casillero: casilleroFinal,
                    [action.dado]: ESTADO_SHORTCOUT,
                    personaje: {
                      ...state.personaje,
                      vida: vidaFinal,
                      mana:
                        state.numeroClase == 300 &&
                        P.mana < P.manaMax &&
                        casilleroFinal < state.casillero
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
                      const randomFate = randomNumber(6);
                      console.log(`Random fate D6=${randomFate}`);
                      if (randomFate < 6) {
                        return {
                          ...state,
                          casillerosMovidos: state.casillerosMovidos + 1,
                        };
                      } else if (randomFate == 6) {
                        const reducRetroceso =
                          state.casillerosMovidos < P.defensaMagica
                            ? 0
                            : state.casillerosMovidos - P.defensaMagica;
                        const danoOverRetroceso =
                          (reducRetroceso - state.casillero) * 10;
                        window.alert(
                          `Ouch! Retrocedes ${
                            reducRetroceso > state.casillero
                              ? `${state.casillero} ${
                                  state.casillero > 1
                                    ? `casilleros`
                                    : `casillero`
                                } y recibes ${danoOverRetroceso} puntos de daño.`
                              : `${reducRetroceso} ${
                                  reducRetroceso != 1
                                    ? `casilleros`
                                    : `casillero`
                                }.`
                          }`
                        );
                        const mayorCero =
                          state.casillero - reducRetroceso > 0 ? true : false;
                        const danoPsicosis =
                          state.efectosPorSec.tickPsicosis > 0 ? 0 : 0;
                        return {
                          ...state,
                          [action.dado]: ESTADO_SHORTCOUT,
                          casillero: mayorCero
                            ? state.casillero - reducRetroceso
                            : 0,
                          casillerosMovidos: 0,
                          personaje: {
                            ...state.personaje,
                            vida: mayorCero
                              ? P.vida - danoPsicosis
                              : P.vida -
                                danoPsicosis +
                                (state.casillero - state.casillerosMovidos) *
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
                    mana:
                      claseSpec < 400 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                  },
                };
              case 8:
                const cantidadTotalDados = state.dados.dadosTotales;
                console.log(`Se mete en el 8`);
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  dados: {
                    ...state.dados,
                    dadosTemporales:
                      cantidadTotalDados < state.numDadoMaximo
                        ? state.dados.dadosTemporales + 1
                        : state.dados.dadosTemporales,
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
                const movimiento =
                  randomMovimiento < 0
                    ? randomMovimiento < -P.defensaMagica
                      ? randomMovimiento + P.defensaMagica
                      : 0
                    : 2;
                const overRetroceso =
                  state.casillero + movimiento < 0 ? true : false;
                const casilleroResultante = overRetroceso
                  ? 0
                  : state.casillero + movimiento;
                const vidaResultante = overRetroceso
                  ? P.vida + Math.floor(10 * (state.casillero + movimiento))
                  : P.vida;

                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  casillero: casilleroResultante,
                  personaje: {
                    ...state.personaje,
                    vida: vidaResultante,
                    mana:
                      claseSpec < 400 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                  },
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
                switch (claseSpec) {
                  case 101:
                    danoInfligido = randomCritico ? P.ataque * 2 : P.ataque;
                    window.alert(
                      `Avanzas 3 casilleros e infliges ${danoInfligido}${
                        randomCritico ? `(Critico)` : ``
                      } de daño a quienes superes.`
                    );
                    return {
                      ...state,
                      casillero: state.casillero + 3,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                    };
                  case 102:
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      bonus: { ...state.bonus, blindado: true },
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                    };
                  case 201:
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                    };
                  case 202:
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: { ...state.bonus, esfumarse: true },
                    };
                  case 301:
                  case 302:
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                    };
                  case 401:
                  case 402:
                    const chanceClari = state.efectosPorSec.chanceClari;
                    const clarividencia = state.efectosPorSec.clarividencia;
                    let nuevaChanceClari;
                    let nuevaClari;
                    switch (chanceClari) {
                      case 15:
                      case 30:
                        nuevaChanceClari = chanceClari + 15;
                        nuevaClari = clarividencia;

                        break;
                      case 0:

                      case 45:
                        nuevaChanceClari = 15;
                        nuevaClari = clarividencia + 1;
                        break;

                      default:
                        break;
                    }
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                      efectosPorSec: {
                        ...state.efectosPorSec,
                        clarividencia: nuevaClari,
                        chanceClari: nuevaChanceClari,
                      },
                    };
                  default:
                    return { ...state };
                }
              case 13:
                //peste
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  [action.dado]: {
                    ...state[action.dado],
                    estado: 0,
                    peste: [true, 3],
                  },
                };
              default:
                return { ...state };
            }
          } else if (!action.modo) {
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

                      switch (claseSpec) {
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

              case 11:
                const curacion =
                  state.numeroClase == 100 || state.numeroClase == 200
                    ? Math.floor(P.curacion * 4)
                    : Math.floor(P.curacion * 2);

                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    vida: calcularHealing(curacion, FUNCIONES.CURACION),
                  },
                };
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
