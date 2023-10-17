import { useReducer } from "react";
import { STATS_AUTOMATICO } from "./Objetos/Personajes";
import { efectosPSec } from "./Objetos/EfectosPS";
import { EQUIPO, arrayEquipo, EFECTOS_EQUIPO } from "./Objetos/Equipo";
import { ACCIONES, A } from "./Objetos/Acciones";
import { DADOS } from "./Objetos/Dados";
import { sounds } from "./Objetos/Audios";
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
  muerteContador: 0,
  estadoTurno: false,
  casillero: 0,
  casilleroPrevio: 0,
  casillerosMovidos: 0,
  nivelDado: 1,
  poderDado: 6,
  numDado: 5,
  numDadoMaximo: 5,
  dadoExtra: 0,
  dados: {
    dadosTotales: 2,
    dadosBase: 2,
    dadoIra: 0,
    dadosAdd: 0,
    dadosTemporales: 0,
    dadosPermanentes: 0,
    dadosFuturos: 0,
  },
  personaje: {
    ...STATS_AUTOMATICO.rogueMalabarista,
  },
  bonus: {
    vida: 0,
    blindado: false,
    blindadoCargas: 0,
    defensaBlindado: 0,
    esfumarse: false,
    campoFuerza: false,
    enfurecido: false,
    danzaCuchillas: false,
    poderPsicosis: 5,
    superSanacion: false,
    resurreccion: false,
    criticoKatana: 0,
    pielDemonio: 0,
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
  dadosObligados: [2, 10, 13, 17],
  equipo: {
    codigoDrop: [],
    bolsa: {
      arma: [],
      armadura: [],
      joya: [],
    },
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
  uniMod: [12, 10],
  corruptos: [],
  corrupcionFlag: false,
  corruptosContador: 0,
  pesteIntensidad: 1,
  confusion: false,
  alertConfusion: [1, true],
};
const randomNumber = (numeroMaximo) => {
  const random = Math.floor(Math.random() * numeroMaximo) + 1;
  return random;
};
const reducer = (state, action) => {
  const { personaje } = state;
  const P = {};

  for (let key in personaje) {
    P[key] = personaje[key];
  }

  const claseSpec = parseInt(state.numeroClase) + parseInt(state.numeroSpec);
  const randomEsquivar = randomNumber(100) <= P.esquivar ? true : false;
  const randomCritico = randomNumber(100) <= P.critico ? true : false;
  const modCritSanacion = randomCritico && state.bonus.superSanacion ? 2 : 1;
  const numDadosValido =
    state.dados.dadosTotales > state.numDadoMaximo
      ? state.numDadoMaximo
      : state.dados.dadosTotales;
  //
  const nuevoCriticoKatana = () => {
    const dependencia =
      state.equipo.actual.arma[0]?.efecto === EFECTOS_EQUIPO.CRIT_CRIT &&
      randomCritico
        ? true
        : false;
    const resultante = dependencia
      ? state.bonus.criticoKatana + 1
      : state.bonus.criticoKatana;
    return resultante;
  };
  const calcularHealing = (cambio) => {
    const curacionBasica = P.vida + cambio;
    const ohBool = curacionBasica > P.vidaMaxima ? true : false;
    const vidaFinal = ohBool ? P.vidaMaxima : curacionBasica;
    const ohValor = ohBool ? curacionBasica - P.vidaMaxima : 0;
    return [vidaFinal, ohBool, ohValor];
  };

  const campoDeFuerza = () => {
    if (!state.bonus.campoFuerza) {
      return false;
    }
    const bloqueo = randomNumber(3) == 1 ? true : false;
    console.log(bloqueo);
    if (bloqueo) {
      window.alert(`Campo de fuerza ha bloqueado el efecto negativo!`);
    }
    return bloqueo;
  };

  const esquivarReturn = (dado) => {
    const danzaCuchillasBool = state.bonus.danzaCuchillas;
    window.alert(
      `Has esquivado el efecto negativo!${
        danzaCuchillasBool
          ? `Danza de cuchillas inflige daño al atacante o al jugador más cercano.`
          : ``
      }`
    );
    const nuevoEstado = {
      ...state,

      personaje: {
        ...state.personaje,
        energia:
          P.energia < P.energiaMax && state.numeroClase == 200 && randomEsquivar
            ? P.energia + 1
            : P.energia,
      },
    };
    const danoContraataque = danzaCuchillasBool ? state.personaje.ataque : 0;
    if (danoContraataque > 0) {
      const [, VampEfectivo] = calcularDano(danoContraataque, randomCritico, 2);
      const [vidaFinal] = calcularHealing(VampEfectivo);
      nuevoEstado.personaje.vida = vidaFinal;
    }

    if (dado != false) {
      nuevoEstado[dado] = { ...state[dado], estado: 0 };
    }

    return { ...nuevoEstado };
  };

  const calcularDano = (dano, critico, bonusCrit) => {
    const modLegendarioCritStun =
      state.equipo.actual.arma[0]?.efecto === EFECTOS_EQUIPO.CRIT_STUN &&
      critico
        ? true
        : false;
    const modLegendarioCritPoison =
      state.equipo.actual.arma[0]?.efecto === EFECTOS_EQUIPO.CRIT_VENENO &&
      critico
        ? true
        : false;
    const modLegendarioCritHemo =
      state.equipo.actual.arma[0]?.efecto === EFECTOS_EQUIPO.CRIT_HEMO &&
      critico
        ? true
        : false;
    const modLegendarioCritHeal =
      state.equipo.actual.joya[0]?.efecto === EFECTOS_EQUIPO.CRIT_HEAL &&
      critico
        ? Math.floor(P.vidaMaxima * 0.05)
        : 0;

    const danoBase = critico ? dano * bonusCrit : dano;
    const defensaPrompt = window.prompt(
      `Infliges ${danoBase} puntos de dano ${
        critico ? `con un ataque critico!` : `.`
      } ${
        modLegendarioCritStun ? `Tu objetivo PIERDE EL SEGUIENTE TURNO.` : ``
      }${
        modLegendarioCritPoison ? `Envenenas a tu objetivo 40 x3 turnos.` : ``
      }${
        modLegendarioCritHemo ? `Haces sangrar a tu objetivo 50 x3 turnos.` : ``
      } Cuanta defensa tiene tu objetivo? Cancela si el ataque fue esquivado o bloqueado.`
    );
    const defensa = !isNaN(defensaPrompt) ? defensaPrompt : 0;
    const danoEfectivo =
      defensa < danoBase ? Math.floor(danoBase - defensa) : 0;
    const vampirismo =
      Math.floor(danoEfectivo * P.vampirismo * 0.01) + modLegendarioCritHeal;
    const arrayRetorno = [danoEfectivo, vampirismo];

    return arrayRetorno;
  };

  const nuevoArrayCorrupcion = () => {
    let arrayFaltantes = [];
    for (let x = 1; x <= 20; x++) {
      if (state.corruptos.includes(x)) continue;
      arrayFaltantes.push(x);
    }
    const cantidadFaltantes = arrayFaltantes.length;
    console.log(arrayFaltantes);
    if (cantidadFaltantes < 6 && cantidadFaltantes > 1) {
      window.alert(
        `Tienes ${
          19 - cantidadFaltantes
        } dados corruptos. Si alcanzas 20 Dcorruptos moriras`
      );
    } else if (cantidadFaltantes == 1) {
      window.alert(
        `Tienes 20 dados corruptos. Tu alma se ha consumido, mueres`
      );
    }
    let nuevoCorrupto = arrayFaltantes[randomNumber(arrayFaltantes.length)];
    let corruptos = [...state.corruptos, nuevoCorrupto];
    return corruptos;
  };

  let algunNegativo = false;
  for (let x = 1; x <= state.dados.dadosTotales; x++) {
    const dado = `roll${x}`;
    if (state[dado].estado == 3) {
      algunNegativo = true;
    }
  }
  let danoInfligido = 0;
  switch (action.type) {
    case A.GRAL.SELECCION_PERSONAJE:
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
    case A.GRAL.AUTOMATICO:
      return { ...state, automatico: !state.automatico };
    case A.GRAL.DESPLEGABLE:
      return { ...state, mostrarDesplegable: !state.mostrarDesplegable };
    case A.BUFF.CONTAGIO_PESTE:
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
    case A.GRAL.TOGGLE_TURNO:
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
        const [turnoHealing] = calcularHealing(P.vidaMaxima * 0.15);
        const turnoFinalHealing = turnoHealing;
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
        let nuevosCorruptos = [];
        if (state.poderDado == 20 && state.corrupcionFlag) {
          nuevosCorruptos = nuevoArrayCorrupcion();
          console.log(`Turno nuevo corrupto = ${nuevosCorruptos}`);
        }

        const estadoFinTurno = {
          ...state,
          pesteIntensidad: 1,
          confusion: false,
          corruptos:
            state.poderDado == 20 && state.corrupcionFlag
              ? [...nuevosCorruptos]
              : state.corruptos,
          corrupcionFlag: !state.corrupcionFlag,
          estadoTurno: false,
          dados: {
            ...state.dados,
            dadosTemporales: state.dados.dadosFuturos,
            dadosFuturos: 0,
          },
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
          bonus: { ...state.bonus, enfurecido: false, superSanacion: false },
        };
        for (let x = 1; x <= 10; x++) {
          const dadoActual = `roll${x}`;
          estadoFinTurno[dadoActual] = {
            ...estadoRoll,
            peste: state[dadoActual].peste,
          };
        }
        return { ...estadoFinTurno };
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
          bonus: {
            ...state.bonus,
            blindado: false,
            blindadoCargas: 0,
            defensaBlindado: 0,
            esfumarse: false,
            campoFuerza: false,
            danzaCuchillas: false,
          },
        };
      }
    case A.DADO.NUM_DADO:
      const valor = parseInt(action.valor);
      return {
        ...state,
        dados: { ...state.dados, dadosAdd: state.dados.dadosAdd + valor },
      };
    case A.DADO.PODER_DADO:
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
    case A.DADO.HANDLE_NUMERO_DADOS:
      const totalCantidadDados =
        state.dados.dadosBase +
        state.dados.dadoIra +
        state.dados.dadosAdd +
        state.dados.dadosTemporales +
        state.dados.dadosPermanentes;

      console.log(`se mete en el calculo de dados`);

      return {
        ...state,
        dados: {
          ...state.dados,
          dadosTotales:
            totalCantidadDados > state.numDadoMaximo
              ? state.numDadoMaximo
              : totalCantidadDados,
        },
      };

    case A.DADO.PODER_DADO_CASILLERO:
      //regula nivel, poder
      const casillero = state.casillero;
      return {
        ...state,
        poderDado: casillero > 19 ? state.poderDado : casillero > 9 ? 12 : 6,
        nivelDado: casillero > 19 ? state.nivelDado : casillero > 9 ? 2 : 1,
        numDadoMaximo: casillero > 19 ? 10 : 5,
      };

    case ACCIONES.LOCK:
      return { ...state };
    case A.DADO.NEGATIVO:
      return { ...state, algunNegativo: algunNegativo };
    case A.DADO.ROLL_ALL:
      const nuevoEstado = {
        ...state,
        rollFlag: !state.rollFlag,
        accion: true,
        personaje: {
          ...state.personaje,
          energia: P.energia - 1,
        },
      };

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

        const numerosChanceReducida = [13, 17];
        if (numerosChanceReducida.includes(aleatorio)) {
          const puerta = randomNumber(3);
          while (puerta < 2 && numerosChanceReducida.includes(aleatorio)) {
            aleatorio = randomNumber(20);
          }
        }
        const nombreDado = `roll${i + 1}`;
        const cargas = state[nombreDado].peste[1];
        const nuevaPeste = cargas > 1 ? true : false;
        const nuevaCarga = cargas > 0 ? cargas - 1 : 0;
        const arrayPeste = [nuevaPeste, nuevaCarga];
        nuevoEstado[nombreDado] = {
          ...state[nombreDado],
          numero: aleatorio,
          peste: arrayPeste,
        };
      }
      for (let x = numDado + 1; x <= 10; x++) {
        const nombreDado = `roll${x}`;
        nuevoEstado[nombreDado] = estadoRoll;
      }

      return { ...nuevoEstado };
    case A.DADO.ESPECIAL:
      let arrayBase = action.arrayBase;
      const arrayCoincidente = action.valorCoincidente;
      let arrayEspecial = Array(arrayBase.length).fill(1);
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
      const estadoNuevo = { ...state };
      for (let x = 0; x < 10; x++) {
        const dadoActual = `roll${x + 1}`;
        estadoNuevo[dadoActual] = {
          ...state[dadoActual],
          estado: arrayEspecial[x],
        };
      }
      return {
        ...estadoNuevo,
      };
    case A.DADO.MODO_DADO:
      return {
        ...state,
        [action.dado]: {
          ...state[action.dado],
          modo: !state[action.dado].modo,
        },
      };
    case A.GRAL.MOD_CASILLERO:
      if (action.valor < 0 && campoDeFuerza()) {
        return { ...state };
      }
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
    case A.GRAL.MOD_DESPLEGABLE:
      const cambio = action.direccion == "der" ? 1 : -1;
      let nuevoModo = state.modDesplegable + cambio;
      const numeroMaxModos = 5;
      if (nuevoModo > numeroMaxModos) {
        nuevoModo = 1;
      } else if (nuevoModo < 1) {
        nuevoModo = numeroMaxModos;
      }

      return { ...state, modDesplegable: nuevoModo };
    case A.BUFF.PSICOSIS:
      if (campoDeFuerza()) {
        return { ...state };
      }
      if (action.fase == "carga") {
        //ya se carga con el dano real
        return {
          ...state,
          efectosPorSec: {
            ...state.efectosPorSec,
            psicosis: action.poder,
            tickPsicosis: 3,
          },
        };
      } else if (action.fase == "golpe") {
        const danoFinalPsicosis = Math.floor(
          action.retroceso *
            (state.efectosPorSec.psicosis * P.vidaMaxima * 0.01)
        );
        const vidaFinalPsicosis = Math.floor(P.vida - danoFinalPsicosis);
        return {
          ...state,
          personaje: { ...state.personaje, vida: vidaFinalPsicosis },
        };
      }
      return { ...state };
    case A.BUFF.CONFUSION:
      const arrayConfusion = [action.numero, action.modo];
      console.log(`array de confusion en reducer = ${arrayConfusion}`);

      return { ...state, alertConfusion: [arrayConfusion] };
    case A.BUFF.EFECTOS_PS:
      const tipo = isNaN(action.tipo) ? action.tipo : parseInt(action.tipo);
      if (tipo != 3 && campoDeFuerza()) {
        return { ...state };
      }
      switch (tipo) {
        case 1:
          //hemo
          return {
            ...state,
            efectosPorSec: {
              ...state.efectosPorSec,
              hemo: Math.floor(state.efectosPorSec.hemo + action.valor),
              tickHemo:
                state.efectosPorSec.tickHemo > 0
                  ? parseInt(
                      Math.floor(
                        (state.efectosPorSec.tickHemo + action.ticks) / 2
                      )
                    )
                  : action.ticks,
            },
          };
        case "hemoAccion":
          const hemoTickRoll =
            state.efectosPorSec.hemo > 0 && state.efectosPorSec.tickHemo > 0
              ? parseInt(
                  Math.floor(
                    state.efectosPorSec.hemo /
                      (state.efectosPorSec.tickHemo * 4)
                  )
                )
              : 0;

          return {
            ...state,
            personaje: {
              ...state.personaje,
              vida: Math.floor(P.vida - hemoTickRoll),
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
    case A.STATS.PORCENTAJE_VIDA:
      return {
        ...state,
        porcentajeVida: Math.floor((P.vida / P.vidaMaxima) * 100),
        personaje: {
          ...state.personaje,
          vida: P.vida > P.vidaMaxima ? P.vidaMaxima : P.vida,
        },
      };
    case A.STATS.MUERTE:
      const estadoReset = {
        ...estadoInicial,
        muerteContador: state.muerte + 1,
        casillero: 0,
        numeroClase: state.numeroClase,
        numeroSpec: state.numeroSpec,
        equipo: { ...state.equipo },
      };
      if (
        !state.bonus.resurreccion &&
        state.equipo.actual.joya[0]?.efecto === EFECTOS_EQUIPO.VIDA_RESURRECCION
      ) {
        window.alert(
          "El amuleto de resurreccion ha salvado tu vida! No habra segunda oportunidad"
        );
        return {
          ...state,
          bonus: { ...state.bonus, resurreccion: true },
          personaje: { ...state.personaje, vida: P.vidaMaxima },
        };
      }
      window.alert("Has muerto, vuelves al casillero 0");
      return { ...estadoReset };
    case A.STATS.MOD_VIDA:
      if (campoDeFuerza() && action.valor > 0) {
        return { ...state };
      }
      const danoFiltrado =
        action.valor > P.defensa
          ? action.valor - P.defensa
          : action.valor < 1
          ? action.valor
          : 0;
      if (randomEsquivar && action.valor > 0) {
        const nuevoEstado = esquivarReturn(false);
        return {
          ...nuevoEstado,
        };
      }
      if (
        state.equipo.actual.arma[0]?.efecto === EFECTOS_EQUIPO.SPINA &&
        randomNumber(100) <= 30
      ) {
        window.alert(
          `Tu escudo espinoso daña al atacante infligiendo ${danoFiltrado} puntos de daño`
        );
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
    case A.STATS.EXCESO_ENERGIA:
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
    case A.STATS.ACTIVAR_SKILL:
      switch (action.personaje) {
        case 101:
        case 102:
          return {
            ...state,
            personaje: { ...state.personaje, ira: 0 },
            bonus: { ...state.bonus, enfurecido: false },
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
          const valorPielDemonio = state.bonus.pielDemonio;
          const limitePielDemonio = 50;
          return {
            ...state,
            personaje: { ...state.personaje, mana: 0 },
            bonus: {
              ...state.bonus,
              pielDemonio:
                valorPielDemonio == limitePielDemonio ||
                valorPielDemonio + P.mana >= limitePielDemonio
                  ? limitePielDemonio
                  : valorPielDemonio + P.mana,
            },
          };
        case 401:
          return {
            ...state,
            casillero:
              state.casillero +
              Math.floor(P.mana + Math.floor(P.mana * (P.maleficio / 200))),
            personaje: { ...state.personaje, mana: 0 },
          };
        case 402:
          const [healing, overhealingBool, ohValor] = calcularHealing(
            Math.floor(P.mana * (P.curacion / 3)) * modCritSanacion
          );
          const bonusVidaMaxima = overhealingBool
            ? Math.floor(ohValor / 10)
            : 0;
          return {
            ...state,
            personaje: {
              ...state.personaje,
              mana: 0,
              vida: healing,
              vidaMaximaBonus: P.vidaMaximaBonus + bonusVidaMaxima,
            },
          };

        default:
          return { ...state };
      }
    case A.STATS.HANDLE_IRA:
      console.log(
        `Entra a ira y ${
          state.bonus.enfurecido ? `esta enfurecido` : `no esta enfurecido`
        }`
      );
      return {
        ...state,
        personaje: {
          ...state.personaje,
          ira:
            P.ira == P.iraMax || state.bonus.enfurecido ? P.iraMax : P.ira + 1,
        },
      };
    case A.STATS.IRA_DADOS:
      const totalDadosIra = P.ira;

      return {
        ...state,
        dados: { ...state.dados, dadoIra: totalDadosIra },
      };
    case A.STATS.CALCULAR_STATS:
      //DEFENSA
      const comboCritico =
        state.numeroClase == 200 && state.numeroSpec == 1 ? P.combo * 3 : 0;
      const comboEsquivar =
        state.numeroClase == 200 && state.numeroSpec == 2 ? P.combo * 3 : 0;

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
      // MODIFICADORES DE STATS CON EFECTOS ESPECIALES DE EQUIP LVL3
      const modLegendarioVidaAtaque =
        state.equipo.actual.joya[0]?.efecto === EFECTOS_EQUIPO.VIDA_ATAQUE
          ? Math.floor((P.vidaMaxima - P.vida) / 20) * 5
          : 0;
      const modLegendarioVidaRegen =
        state.equipo.actual.joya[0]?.efecto === EFECTOS_EQUIPO.VIDA_REGEN
          ? Math.floor((P.vidaMaxima - P.vida) / 20) * 1
          : 0;
      const modLegendarioDadoAtaque =
        state.equipo.actual.joya[0]?.efecto === EFECTOS_EQUIPO.DADOS_ATAQUE
          ? state.dados.dadosTotales * 5
          : 0;
      const modLegendarioOfensivoRegen =
        state.equipo.actual.joya[0]?.efecto === EFECTOS_EQUIPO.REGEN_STATS
          ? P.regeneracion * 2
          : 0;

      //CALCULOS DE TOTALES
      const modificadorBlindado = state.bonus.blindado ? 2 : 1;
      const totalDefensa = state.bonus.enfurecido
        ? 0
        : state.bonus.blindadoCargas > 0
        ? state.bonus.defensaBlindado
        : Math.floor(
            P.defensaBase +
              iraModDefensa +
              arrayStatsValores[0] +
              P.defensaBonus +
              state.bonus.pielDemonio
          );
      const totalAtaque = Math.floor(
        P.ataqueBase +
          iraModAtaque +
          arrayStatsValores[1] +
          P.ataqueBonus +
          modLegendarioVidaAtaque +
          modLegendarioDadoAtaque +
          modLegendarioOfensivoRegen
      );
      const modSuperSanacion = state.bonus.superSanacion ? 30 : 0;
      const criticoTotal =
        P.criticoBase +
        arrayStatsValores[2] +
        comboCritico +
        P.criticoBonus +
        modSuperSanacion +
        state.bonus.criticoKatana;
      const modificadorEsfumarse = state.bonus.esfumarse ? 30 : 0;
      const esquivarTotal =
        P.esquivarBase +
        arrayStatsValores[3] +
        comboEsquivar +
        modificadorEsfumarse +
        P.esquivarBonus;
      const maleficioTotal =
        P.maleficioBase +
        arrayStatsValores[4] +
        P.maleficioBonus +
        modLegendarioOfensivoRegen;
      const curacionTotal =
        P.curacionBase + arrayStatsValores[5] + P.curacionBonus;
      const vampirismoTotal =
        P.vampirismoBase + arrayStatsValores[6] + P.vampirismoBonus;
      const defMagicaFromDefensa = Math.floor(totalDefensa / 50);
      const defensaMagicaTotal =
        P.defensaMagicaBase +
        arrayStatsValores[7] +
        defMagicaFromDefensa +
        P.defensaMagicaBonus;
      const regeneracionTotal =
        P.regeneracionBase +
        arrayStatsValores[8] +
        P.regeneracionBonus +
        modLegendarioVidaRegen;
      const vidaMaximaTotal =
        P.vidaBase + arrayStatsValores[9] + P.vidaMaximaBonus;

      return {
        ...state,
        personaje: {
          ...state.personaje,
          esquivar: esquivarTotal > 0 ? esquivarTotal : 0,
          critico: criticoTotal > 0 ? criticoTotal : 0,
          ataque:
            totalAtaque > 0
              ? state.bonus.enfurecido
                ? Math.floor(totalAtaque + totalAtaque * 0.5)
                : totalAtaque
              : 0,
          defensa: totalDefensa > 0 ? totalDefensa : 0,
          maleficio: maleficioTotal > 0 ? maleficioTotal : 0,
          curacion: curacionTotal > 0 ? curacionTotal : 0,
          vampirismo:
            vampirismoTotal > 0
              ? state.bonus.enfurecido
                ? vampirismoTotal + 50
                : vampirismoTotal
              : 0,
          defensaMagica:
            defensaMagicaTotal > 0 && state.efectosPorSec.tickPsicosis === 0
              ? defensaMagicaTotal
              : 0,
          regeneracion: regeneracionTotal > 0 ? regeneracionTotal : 0,
          vidaMaxima: vidaMaximaTotal,
        },
      };

    case A.STATS.MODIFICAR_EQUIPO:
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
    case A.DADO.ACTIVACION_DADO:
      const ESTADO_SHORTCOUT = {
        ...state[action.dado],
        estado: 0,
        lock: false,
      };
      if (
        !algunNegativo ||
        state[action.dado].estado == 3 ||
        (action.n == 18 && action.modo === true)
      ) {
        if (campoDeFuerza() && state[action.dado].estado == 3) {
          return {
            ...state,
            [action.dado]: ESTADO_SHORTCOUT,
          };
        }
        if (state[action.dado].estado != 0 && state.estadoTurno) {
          const gastoEnergia = action.gastoEnergia;
          console.log(`energia = ${gastoEnergia}`);
          if (gastoEnergia > P.energia) return { ...state };
          const uniModPresente = state.uniMod.includes(action.n);

          let modo = action.modo;
          let numero = action.n;
          console.log(`numero activado= ${numero}/${modo}`);

          if (modo || (!modo && uniModPresente)) {
            switch (numero) {
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

                  return {
                    ...state,
                    [action.dado]: ESTADO_SHORTCOUT,
                    personaje: {
                      ...state.personaje,
                      energia:
                        P.energia < P.energiaMax &&
                        state.numeroClase == 200 &&
                        randomEsquivar &&
                        gastoEnergia < 1
                          ? P.energia + 1
                          : P.energia,
                    },
                  };
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
                      energia: P.energia - gastoEnergia,
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
                if (state.dados.dadosTotales >= state.numDadoMaximo) {
                  window.alert("Haz alcanzado el numero maximo de dados");
                  return { ...state };
                }
                window.alert(`Inversion a futuro.Pierdes un turno`);
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  dados: {
                    ...state.dados,
                    dadosFuturos: state.dados.dadosFuturos + 2,
                  },
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                  },
                };
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
                        const danoPsicosisFlat = state.efectosPorSec.psicosis;
                        const danoPsicosis =
                          state.efectosPorSec.tickPsicosis > 0
                            ? danoPsicosisFlat * reducRetroceso
                            : 0;
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
                    ataqueBonus: P.ataqueBonus + 1,
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
                    energia: P.energia - gastoEnergia,
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
                    let cantidadJugadores;
                    let contador = 0;
                    while (isNaN(cantidadJugadores) || contador == 10) {
                      cantidadJugadores = parseInt(
                        window.prompt(
                          `${
                            contador > 0 ? `Vamos de nuevo...` : ``
                          }Cuantos enemigos haz alcanzado con Cargar?`
                        )
                      );
                      contador++;
                    }
                    let vampirismoAcumulado = 0;
                    const danoCargar = state.personaje.ataque;
                    for (let x = 1; x <= cantidadJugadores; x++) {
                      window.alert(`Dano al jugador n° ${x}`);
                      const [, vampEfectivo] = calcularDano(
                        danoCargar,
                        randomCritico,
                        2
                      );
                      vampirismoAcumulado = vampirismoAcumulado + vampEfectivo;
                    }

                    const [vidaFinal, ,] = calcularHealing(vampirismoAcumulado);
                    return {
                      ...state,
                      casillero: state.casillero + 3,
                      [action.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        criticoKatana: nuevoCriticoKatana(),
                      },
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                        vida: vidaFinal,
                      },
                    };
                  case 102:
                    const nuevoValorDefensa = Math.floor(P.defensa * 1.5);
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: {
                        ...state.bonus,
                        blindadoCargas: state.bonus.blindadoCargas + 1,
                        defensaBlindado: nuevoValorDefensa,
                      },
                    };
                  // if (state.bonus.blindado) {
                  //   return {
                  //     ...state,
                  //     [action.dado]: ESTADO_SHORTCOUT,
                  //     personaje: {
                  //       ...state.personaje,
                  //       energia: P.energia - gastoEnergia,
                  //     },
                  //     dados: {
                  //       ...state.dados,
                  //       dadosTemporales: state.dados.dadosTemporales + 1,
                  //     },
                  //   };
                  // }
                  // return {
                  //   ...state,
                  //   [action.dado]: ESTADO_SHORTCOUT,
                  //   bonus: { ...state.bonus, blindado: true },
                  //   personaje: {
                  //     ...state.personaje,
                  //     energia: P.energia - gastoEnergia,
                  //   },
                  // };
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
                    if (state.bonus.esfumarse) {
                      const [nuevaVida12] = calcularHealing(
                        Math.floor(P.vidaMaxima * 0.1)
                      );
                      return {
                        ...state,
                        [action.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...state.personaje,
                          energia: P.energia - gastoEnergia,
                          vida: nuevaVida12,
                        },
                      };
                    }

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
                  [action.dado]: {
                    ...state[action.dado],
                    estado: 0,
                    peste: [true, 3],
                  },
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    ira: P.ira >= P.iraMax ? P.iraMax : P.ira + 1,
                    mana:
                      claseSpec < 400 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                  },
                };
              case 14:
                if (state.dados.dadosTotales >= state.numDadoMaximo) {
                  window.alert("Haz alcanzado el numero maximo de dados");
                  return { ...state };
                }
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                  },
                  dados: {
                    ...state.dados,
                    dadosPermanentes: state.dados.dadosPermanentes + 1,
                  },
                };
              case 15:
                const dano15 = Math.floor(
                  state.personaje.ataque * 1.5 + state.personaje.maleficio * 0.5
                );
                const [danoEfectivo, vampBase] = calcularDano(
                  dano15,
                  randomCritico,
                  2
                );
                const vampirismo15 = Math.floor(danoEfectivo * 0.2);
                console.log(
                  `Dano efectivo=${danoEfectivo}, vampirismo=${vampBase}+${vampirismo15}`
                );
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  bonus: {
                    ...state.bonus,
                    criticoKatana: nuevoCriticoKatana(),
                  },
                  personaje: {
                    ...state.personaje,
                    vida: P.vida + vampirismo15 + vampBase,
                    energia: P.energia - gastoEnergia,
                    combo: P.combo < P.comboMax ? P.combo + 1 : P.combo,
                  },
                };
              case 16:
                //campo de fuerza
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  bonus: { ...state.bonus, campoFuerza: true },
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                  },
                };
              case 17:
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  confusion: true,
                  personaje: {
                    ...state.personaje,
                    ira: P.ira >= P.iraMax ? P.iraMax : P.ira + 1,
                    mana:
                      claseSpec < 400 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                  },
                };
              case 18:
                //purificacion
                const efectosPorsegundo = {
                  ...efectosPSec,
                  reju: state.efectosPorSec.reju,
                  clarividencia: state.efectosPorSec.clarividencia,
                  tickReju: state.efectosPorSec.tickReju,
                  chanceClari: state.efectosPorSec.chanceClari,
                };
                const nuevoEstado = {
                  ...state,
                  confusion: false,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                  },
                  efectosPorSec: { ...efectosPorsegundo },
                };

                for (let x = 1; x <= state.dados.dadosTotales; x++) {
                  const dadoActual = `roll${x}`;
                  if (dadoActual == action.dado) {
                    nuevoEstado[dadoActual] = {
                      ...state[dadoActual],
                      estado: 0,
                      peste: [false, 0],
                    };
                  } else if (
                    state.dadosObligados.includes(state[dadoActual].numero)
                  ) {
                    nuevoEstado[dadoActual] = {
                      ...state[dadoActual],
                      estado: 0,
                      peste: [false, 0],
                    };
                  }
                }

                return { ...nuevoEstado };
              case 19:
                // +3 ataque, maleficio, critico y vampirismo
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    ataqueBonus: P.ataqueBonus + 3,
                    criticoBonus: P.criticoBonus + 3,
                    maleficioBonus: P.maleficioBonus + 3,
                    vampirismoBonus: P.vampirismoBonus + 3,
                  },
                };
              case 20:
                switch (claseSpec) {
                  case 101:
                    if (state.bonus.enfurecido) {
                      return {
                        ...state,
                        [action.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...state.personaje,
                          energia: P.energia - gastoEnergia,
                          ataqueBonus: P.ataqueBonus + 3,
                        },
                      };
                    }

                    return {
                      ...state,

                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: {
                        ...state.bonus,
                        enfurecido: true,
                      },
                    };
                  case 102:
                    const [, vampEf20] = calcularDano(
                      state.personaje.defensa,
                      randomCritico,
                      2
                    );
                    const [curacionVamp, ,] = calcularHealing(vampEf20);
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        blindado: false,
                        criticoKatana: nuevoCriticoKatana(),
                      },
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                        vida: curacionVamp,
                      },
                    };
                  case 201:
                    const ataqueSiniestro =
                      state.personaje.ataque * 2 +
                      state.personaje.maleficio * 1;
                    const [danoSiniestro, vampEf20Rogue] = calcularDano(
                      ataqueSiniestro,
                      randomCritico,
                      3
                    );
                    const [curacionVampRogue, ,] =
                      calcularHealing(vampEf20Rogue);

                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        criticoKatana: nuevoCriticoKatana(),
                      },
                      personaje: {
                        ...state.personaje,
                        energia:
                          randomCritico && danoSiniestro > 0
                            ? P.energia - gastoEnergia + 1
                            : P.energia - gastoEnergia,
                        vida: curacionVampRogue,
                      },
                    };
                  case 202:
                    if (state.bonus.danzaCuchillas) {
                      return {
                        ...state,
                        [action.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...state.personaje,
                          energia: P.energia - gastoEnergia,
                          ataqueBonus: P.ataqueBonus + 3,
                        },
                      };
                    }
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: { ...state.bonus, danzaCuchillas: true },
                    };
                  case 301:
                    let cantidadJugadores;
                    while (isNaN(cantidadJugadores)) {
                      let contador = 0;
                      cantidadJugadores = parseInt(
                        window.prompt(
                          `${
                            contador > 0 ? `Vamos de nuevo...` : ``
                          }Cuantos enemigos hay en juego?`
                        )
                      );
                      contador++;
                    }
                    let vampirismoAcumulado = 0;
                    const dano20 = state.personaje.maleficio;
                    for (let x = 1; x <= cantidadJugadores; x++) {
                      window.alert(`Dano al jugador n° ${x}`);
                      const [, vampEfectivo] = calcularDano(
                        dano20,
                        randomCritico,
                        2
                      );
                      vampirismoAcumulado = vampirismoAcumulado + vampEfectivo;
                    }
                    const Healaoe =
                      P.vidaMaxima * 0.1 * cantidadJugadores +
                      vampirismoAcumulado;
                    const [vidaFinal, ,] = calcularHealing(Healaoe);
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        criticoKatana: nuevoCriticoKatana(),
                      },
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                        vida: vidaFinal,
                      },
                    };
                  case 302:
                    const nuevoPoderPsicosis = state.bonus.poderPsicosis + 1;
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        poderPsicosis: nuevoPoderPsicosis,
                      },
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                    };
                  case 401:
                    window.alert(`Intercambias la posicion de 2 jugadores.`);
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                    };

                  case 402:
                    if (state.bonus.superSanacion) {
                      return {
                        ...state,
                        [action.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...state.personaje,
                          energia: P.energia - gastoEnergia,
                          curacionBonus: P.curacionBonus + 3,
                        },
                      };
                    }
                    return {
                      ...state,
                      [action.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...state.personaje,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: { ...state.bonus, superSanacion: true },
                    };
                }

              default:
                return { ...state };
            }
          } else if (!modo) {
            let lvl = 1;
            let spec = 0;
            let tipo = 0;
            let obj = 0;

            switch (numero) {
              case 1:
                const [danoEfectivo, vampirismoEfectivo] = calcularDano(
                  P.ataque,
                  randomCritico,
                  2
                );

                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  bonus: {
                    ...state.bonus,
                    criticoKatana: nuevoCriticoKatana(),
                  },
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
                    vida: P.vida + vampirismoEfectivo,
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
                      energia: P.energia - gastoEnergia,
                      mana:
                        state.numeroClase == 300 && P.mana < P.manaMax
                          ? P.mana + 1
                          : P.mana,
                    },
                  };
                }

              case 3:
                if (state.dados.dadosTotales >= state.numDadoMaximo) {
                  window.alert("Haz alcanzado el numero maximo de dados");
                  return { ...state };
                }
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  dados: {
                    ...state.dados,
                    dadosTemporales: state.dados.dadosTemporales + 1,
                  },
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                  },
                };
              case 4:
              case 8:
              case 14:
                const numeroMaximo = state.cantidadPersonajes * 100;
                let arrayProbabilidad = [0.65, 0.4, 0.2, 0.1, 0]; //35%, 25%, 20%, 10%, 10%
                for (let i = 0; i < 4; i++) {
                  let numeroRandom = 0;
                  switch (i) {
                    case 0:
                      const accion = parseInt(numero);
                      lvl = accion == 4 ? 1 : accion == 8 ? 2 : 3;
                      break;
                    case 1:
                      numeroRandom = randomNumber(numeroMaximo);

                      bucleSelectorSpec: for (let x = 0; x < 5; x++) {
                        if (
                          numeroRandom >=
                          numeroMaximo * arrayProbabilidad[x]
                        ) {
                          spec = P.preferenciaDrop[x];
                          break bucleSelectorSpec;
                        } else {
                          continue;
                        }
                      }

                      break;
                    case 2:
                      //seleccion tipo: arma, armadura, joya
                      numeroRandom = randomNumber(numeroMaximo);
                      arrayProbabilidad = [0.6, 0.2, 0]; //40%, 40%, 20%
                      bucleSelectorSpec: for (let x = 0; x < 3; x++) {
                        if (
                          numeroRandom >=
                          numeroMaximo * arrayProbabilidad[x]
                        ) {
                          tipo = x;

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

                let arrayCodigos = [...state.equipo.codigoDrop];
                if (arrayCodigos.includes(codigoString.join(""))) {
                  const accion = parseInt(action.n);
                  const lvlRepetido =
                    accion == 4 ? [1, 2] : accion == 8 ? [2, 3] : [3, 2];
                  console.log("objeto repetido");
                  const arrayLongitudes = [
                    lvlRepetido,
                    P.preferenciaDrop,
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
                const desequipar = (slot) => {
                  return state.arrayEquipo[slot];
                };
                const arraySlot = ["arma", "armadura", "joya"];
                const slotActual = arraySlot[codigoString[2]];
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
                      [slotActual]:
                        state.equipo.bolsa[slotActual].length != 0
                          ? [
                              ...state.equipo.bolsa[slotActual],
                              {
                                ...objeto,
                                indice: `${state.equipo.bolsa[slotActual].length}`,
                              },
                            ]
                          : [
                              {
                                ...objeto,
                                indice: `0`,
                              },
                              {
                                ...state.arrayEquipo[0][codigoString[2]],
                                indice: "1",
                              },
                            ],
                    },
                    actual: {
                      ...state.equipo.actual,
                      [slotActual]:
                        state.equipo.actual[slotActual].length == 0
                          ? [
                              {
                                ...objeto,
                                indice: `${state.equipo.bolsa[slotActual].length}`,
                              },
                            ]
                          : state.equipo.actual[slotActual],
                    },
                  },
                };
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
                const totalSanacion = (P.vida + P.curacion) * modCritSanacion;

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
                      const [ataque, vampBase] = calcularDano(
                        ataqueRedondeado,
                        false,
                        2
                      );
                      const vidaFinal = P.vida + vampBase;
                      return {
                        ...state,
                        ataqueAcumulado: 0,
                        [action.dado]: ESTADO_SHORTCOUT,
                        bonus: {
                          ...state.bonus,
                          criticoKatana: nuevoCriticoKatana(),
                        },
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
                const ataque7 = Math.floor(P.ataque * 0.35);
                const maleficio7 = Math.floor(P.maleficio * 0.75);
                const [atqEfectivo, vampEfectivo] = calcularDano(
                  ataque7 + maleficio7,
                  randomCritico,
                  2
                );
                const [nuevaVidaVamp7] = calcularHealing(vampEfectivo);
                const cambioVida = nuevaVidaVamp7;
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  bonus: {
                    ...state.bonus,
                    criticoKatana: nuevoCriticoKatana(),
                  },
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
                    maleficioBonus: P.maleficioBonus + 1,
                    energia: P.energia - gastoEnergia,
                  },
                };

              case 11:
                const curacion =
                  state.numeroClase == 100 || state.numeroClase == 200
                    ? Math.floor(P.curacion * 4)
                    : Math.floor(P.curacion * 2) * modCritSanacion;
                const [healing] = calcularHealing(curacion);
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    vida: healing,
                  },
                };
              case 13:
                const nuevosCorruptos = nuevoArrayCorrupcion();
                console.log(`corruptos actualizado${nuevosCorruptos}`);
                if (action.accion == "contagio") {
                  return {
                    ...state,
                    corruptos: [...nuevosCorruptos],
                    corruptosContador: state.corruptosContador + 1,
                  };
                }
                return {
                  ...state,
                  corruptos: [...nuevosCorruptos],
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    ira: P.ira >= P.iraMax ? P.iraMax : P.ira + 1,
                    mana:
                      claseSpec < 400 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                  },
                };
              case 15:
                const dano15 = Math.floor(
                  state.personaje.ataque * 0.8 + state.personaje.maleficio * 1.2
                );
                const [danoEfectivo15, vampEfectivo15] = calcularDano(
                  dano15,
                  randomCritico,
                  3
                );
                const vidaFinal15 =
                  P.vida + vampEfectivo15 > P.vidaMaxima
                    ? P.vidaMaxima
                    : P.vida + vampEfectivo15;
                return {
                  ...state,
                  bonus: {
                    ...state.bonus,
                    criticoKatana: nuevoCriticoKatana(),
                  },
                  personaje: {
                    ...state.personaje,
                    vida: vidaFinal15,
                    energia: P.energia - gastoEnergia,
                    combo: P.combo < P.comboMax ? P.combo + 1 : P.combo,
                  },

                  [action.dado]: ESTADO_SHORTCOUT,
                };
              case 16:
                return {
                  ...state,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    defensaMagicaBonus: P.defensaMagicaBonus + 1,
                  },
                  [action.dado]: ESTADO_SHORTCOUT,
                };
              case 17:
                const statsDisminuidos = {
                  ...state.personaje,
                  ira: P.ira >= P.iraMax ? P.iraMax : P.ira + 1,
                  energia: P.energia - gastoEnergia,
                  vidaMaximaBonus: P.vidaMaximaBonus - 5,
                  ataqueBonus: P.ataqueBonus - 3,
                  defensaBonus: P.defensaBonus - 3,
                  criticoBonus: P.criticoBonus - 3,
                  esquivarBonus: P.esquivarBonus - 3,
                  curacionBonus: P.curacionBonus - 3,
                  maleficioBonus: P.maleficioBonus - 3,
                  vampirismoBonus: P.vampirismoBonus - 3,
                  mana:
                    claseSpec < 400 && P.mana < P.manaMax ? P.mana + 1 : P.mana,
                };
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: statsDisminuidos,
                };
              case 18:
                const curacionBase =
                  Math.floor(P.curacion * 2 + P.vidaMaxima * 0.2) *
                  modCritSanacion;
                const [curacion18, ohBool, ohValor] =
                  calcularHealing(curacionBase);

                return {
                  ...state,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    vida: curacion18,
                    vidaMaximaBonus:
                      P.vidaMaximaBonus + Math.floor(ohValor / 10),
                  },
                  [action.dado]: ESTADO_SHORTCOUT,
                };
              case 19:
                // +3 Defensa, Esquivar, Curacion & +5HP Max
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    defensaBonus: P.defensaBonus + 3,
                    esquivarBonus: P.esquivarBonus + 3,
                    curacionBonus: P.curacionBonus + 3,
                    vidaMaximaBonus: P.vidaMaximaBonus + 5,
                  },
                };
              case 20:
                return {
                  ...state,
                  [action.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...state.personaje,
                    energia: P.energia - gastoEnergia,
                    energiaMax:
                      P.energiaMax < 5 ? P.energiaMax + 1 : P.energiaMax,
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
