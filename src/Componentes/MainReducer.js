import { useReducer } from "react";
import { STATS_AUTOMATICO } from "./Objetos/Personajes";
import { efectosPSec } from "./Objetos/EfectosPS";
import { arrayEquipo, EFECTOS_EQUIPO } from "./Objetos/Equipo";
import { ACCIONES, A } from "./Objetos/Acciones";
import { playAudio, sounds } from "./Objetos/Audios";
const estadoRoll = {
  numero: 0,
  modo: true,
  lock: false,
  activo: false,
  especial: false,
  estado: 1,
  peste: [false, 0],
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
    dadosTotales: 3,
    dadosBase: 3,
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
    burnArmadura: 0,
    ascendencia: 0,
    llamaInterior: 0,
    cenizas: false,
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

const personajeClaseSpec = {
  100: [STATS_AUTOMATICO.warriorBersek, STATS_AUTOMATICO.warriorProtec],
  200: [STATS_AUTOMATICO.rogueSicario, STATS_AUTOMATICO.rogueMalabarista],
  300: [STATS_AUTOMATICO.warlockMasas, STATS_AUTOMATICO.warlockDestruccion],
  400: [STATS_AUTOMATICO.mageArcano, STATS_AUTOMATICO.mageSanador],
  500: [STATS_AUTOMATICO.paladinFenix],
};
const randomNumber = (numeroMaximo) => {
  const random = Math.floor(Math.random() * numeroMaximo) + 1;
  return random;
};
const reducer = (state, action) => {
  const P = state.personaje;
  const a = action;
  const eps = state.efectosPorSec;

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
        ...P,
        energia:
          P.energia < P.energiaMax && state.numeroClase == 200 && randomEsquivar
            ? P.energia + 1
            : P.energia,
      },
    };
    const danoContraataque = danzaCuchillasBool ? P.ataque : 0;
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
    if (cantidadFaltantes < 6 && cantidadFaltantes > 1) {
      window.alert(
        `Tienes ${
          20 - cantidadFaltantes
        } dados corruptos. Si alcanzas 20 Dcorruptos moriras`
      );
    } else if (cantidadFaltantes == 1) {
      window.alert(
        `Tienes 20 dados corruptos. Tu alma se ha consumido, mueres`
      );
    }
    let nuevoCorrupto = arrayFaltantes[randomNumber(arrayFaltantes.length - 1)];
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

  switch (a.type) {
    case A.GRAL.SELECCION_PERSONAJE:
      const numClase = parseInt(a.clase);
      const numSpec = parseInt(a.spec);
      console.log("numClase = ", numClase);

      return {
        ...state,
        numeroClase: numClase,
        numeroSpec: numSpec,
        personaje: personajeClaseSpec[numClase][numSpec - 1],
      };

    case A.GRAL.AUTOMATICO:
      return { ...state, automatico: !state.automatico };
    case A.GRAL.DESPLEGABLE:
      return { ...state, mostrarDesplegable: !state.mostrarDesplegable };
    case A.BUFF.CONTAGIO_PESTE:
      const danoPeste = Math.floor(P.vidaMaxima * 0.05 * state.pesteIntensidad);
      let objetivo = null;
      for (let x = 1; x <= state.dados.dadosTotales; x++) {
        if (
          ![a.dado] == `roll${x}` ||
          ([a.dado] == `roll${x}` &&
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
        [a.dado]: { ...state[a.dado], peste: [true, 3] },
        [objetivo]: { ...state[objetivo], peste: [true, 3] },
        efectosPorSec: {
          ...eps,
          veneno: eps.veneno + danoPeste,
          tickVeneno: eps.tickVeneno > 0 ? Math.floor(eps.tickVeneno + 1) : 3,
        },
      };
    case A.GRAL.TOGGLE_TURNO:
      // console.log(`mana max = ${P.manaMax}`)
      const venenoTickTurno =
        eps.veneno > 0 && eps.tickVeneno > 0
          ? parseInt(eps.veneno / (eps.tickVeneno * 2))
          : 0;
      let arrayCritVeneno = [false, false];
      for (let i = 0; i < arrayCritVeneno.length; i++) {
        const critico =
          Math.floor(eps.veneno * 0.25) >= randomNumber(100) ? true : false;
        arrayCritVeneno[i] = critico;
      }
      const venenoInicial = arrayCritVeneno[0]
        ? venenoTickTurno * 2
        : venenoTickTurno;
      const venenoFinal = arrayCritVeneno[1]
        ? venenoTickTurno * 2
        : venenoTickTurno;

      if (state.estadoTurno) {
        const [turnoFinalHealing] = calcularHealing(P.vidaMaxima * 0.15);
        const fraccionTick = 4;
        const hemoTickTurno =
          eps.hemo > 0 && eps.tickHemo > 0
            ? parseInt(eps.hemo / (eps.tickHemo * fraccionTick))
            : 0;

        const reposo =
          P.energia == P.energiaMax && !state.accion
            ? turnoFinalHealing
            : P.vida;
        const cambioVidaFinalTurno = Math.floor(
          reposo - hemoTickTurno - venenoFinal
        );
        let nuevosCorruptos = [];
        if (state.poderDado === 20 && state.corrupcionFlag) {
          nuevosCorruptos = nuevoArrayCorrupcion();
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
          personaje: {
            ...P,
            combo: 0,
            ira: 0,
            vida: cambioVidaFinalTurno,
          },
          dados: {
            ...state.dados,
            dadosTemporales: state.dados.dadosFuturos,
            dadosFuturos: 0,
          },
          efectosPorSec: {
            ...eps,
            hemo:
              eps.tickHemo == 1
                ? 0
                : eps.hemo - Math.floor(eps.hemo / eps.tickHemo),

            veneno: eps.veneno - venenoTickTurno * 2,
            tickHemo: Math.max(eps.tickHemo - 1, 0),
            tickVeneno: Math.max(eps.tickVeneno - 1, 0),
            tickPsicosis: Math.max(eps.tickPsicosis - 1, 0),
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
          eps.reju > 0 && eps.tickReju > 0
            ? parseInt(eps.reju / eps.tickReju)
            : 0;
        let cambioVidaInicioTurno =
          P.vida - venenoInicial + rejuInicioTurno + P.regeneracion;
        const manaClarividenciaCalculo =
          eps.chanceClari >= randomNumber(100) && state.numeroClase == 400
            ? eps.clarividencia
            : 0;
        const manaClarividenciaFinal = Math.min(
          manaClarividenciaCalculo + P.mana,
          P.manaMax
        );
        return {
          ...state,
          estadoTurno: true,
          accion: false,
          personaje: {
            ...P,
            energia: P.energiaMax,
            vida: Math.min(cambioVidaInicioTurno, P.vidaMaxima),
            mana: manaClarividenciaFinal,
          },

          efectosPorSec: {
            ...eps,
            reju: eps.tickReju == 1 ? 0 : eps.reju - rejuInicioTurno,
            tickReju: Math.max(eps.tickReju - 1, 0),
            quemdaura: eps.tickQuemadura == 1 ? 0 : eps.quemdaura,
            tickQuemadura:
              eps.tickQuemadura > 0
                ? eps.flagQuemadura
                  ? eps.tickQuemadura
                  : eps.tickQuemadura - 1
                : 0,
            flagQuemadura: false,
          },
          bonus: {
            ...state.bonus,
            blindado: false,
            blindadoCargas: 0,
            defensaBlindado: 0,
            esfumarse: false,
            campoFuerza: false,
            danzaCuchillas: false,
            burnArmadura: eps.tickQuemadura > 1 ? state.bonus.burnArmadura : 0,
            cenizas: false,
          },
        };
      }
    case A.DADO.NUM_DADO:
      const valor = parseInt(a.valor);
      return {
        ...state,
        dados: { ...state.dados, dadosAdd: state.dados.dadosAdd + valor },
      };
    case A.DADO.PODER_DADO:
      if (state.casillero < 20) return { ...state };
      const nivel = state.nivelDado < 3 ? state.nivelDado + 1 : 1;
      const poder = nivel == 1 ? 6 : nivel == 2 ? 12 : 20;
      return { ...state, nivelDado: nivel, poderDado: poder };
    case A.DADO.PODER_DADO_CASILLERO:
      //regula nivel, poder
      const casillero = state.casillero;
      return {
        ...state,
        poderDado: casillero > 19 ? state.poderDado : casillero > 9 ? 12 : 6,
        nivelDado: casillero > 19 ? state.nivelDado : casillero > 9 ? 2 : 1,
        numDadoMaximo: casillero > 19 || state.numeroClase == 100 ? 10 : 5,
      };
    case A.DADO.HANDLE_NUMERO_DADOS:
      const totalCantidadDados =
        state.dados.dadosBase +
        state.dados.dadoIra +
        state.dados.dadosAdd +
        state.dados.dadosTemporales +
        state.dados.dadosPermanentes;
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

    case A.DADO.NEGATIVO:
      return { ...state, algunNegativo: algunNegativo };
    case A.DADO.ROLL_ALL:
      const nuevoEstado = {
        ...state,
        accion: true,
        personaje: {
          ...P,
          energia: P.energia - 1,
        },
      };

      const arrayChances = [[1], [0.3, 1], [0.14, 0.29 + 0.14, 1]];
      const arrayRangosNumeros = [
        [1, 6],
        [7, 12],
        [13, 20],
      ];
      const arrayActual = arrayChances[state.nivelDado - 1];
      //rolleo dados del ultimo al primer para definir estado especial
      let arrayDados = [];
      for (let x = numDadosValido; x >= 1; x--) {
        let minimo;
        let maximo;
        for (let i = 0; i < arrayActual.length; i++) {
          const chanceAleatoria = Math.random();
          if (chanceAleatoria <= arrayActual[i]) {
            minimo = arrayRangosNumeros[i][0];
            maximo = arrayRangosNumeros[i][1];
            break;
          }
        }
        let aleatorio =
          Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;

        const numerosChanceReducida = [13, 17];
        if (numerosChanceReducida.includes(aleatorio)) {
          const puerta = randomNumber(3);
          while (puerta < 2 && numerosChanceReducida.includes(aleatorio)) {
            aleatorio = randomNumber(20);
          }
        }
        const nombreDado = `roll${x}`;
        const nuevaCarga = Math.max(state[nombreDado].peste[1] - 1, 0);
        const nuevaPeste = nuevaCarga === 0 ? false : true;

        const estadoDado = state.dadosObligados.includes(aleatorio)
          ? 3
          : arrayDados.includes(aleatorio)
          ? 2
          : 1;
        arrayDados.push(aleatorio);

        nuevoEstado[nombreDado] = {
          ...state[nombreDado],
          numero: aleatorio,
          estado: estadoDado,
          peste: [nuevaPeste, nuevaCarga],
        };
        console.log(
          `Numero de dado = ${x}, numero = ${aleatorio},maximo = ${maximo}, minimo=${minimo} estado = ${estadoDado}`
        );
      }

      for (let x = numDadosValido + 1; x <= 10; x++) {
        const nombreDado = `roll${x}`;
        nuevoEstado[nombreDado] = estadoRoll;
      }

      return { ...nuevoEstado };

    case A.DADO.MODO_DADO:
      return {
        ...state,
        [a.dado]: {
          ...state[a.dado],
          modo: !state[a.dado].modo,
        },
      };
    case A.GRAL.MOD_CASILLERO:
      if (a.valor < 0 && campoDeFuerza()) {
        return { ...state };
      }
      const reducRetroceso =
        a.valor < 0
          ? -P.defensaMagica > a.valor
            ? a.valor + P.defensaMagica
            : 0
          : a.valor;
      const casillerosFinales = state.casillero + reducRetroceso;

      return {
        ...state,
        casillero: casillerosFinales < 0 ? 0 : casillerosFinales,
        personaje: {
          ...P,
          vida:
            casillerosFinales < 0 ? P.vida - casillerosFinales * -10 : P.vida,
        },
      };
    case A.GRAL.MOD_DESPLEGABLE:
      const cambio = a.direccion == "der" ? 1 : -1;
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
      if (a.fase == "carga") {
        if (randomNumber(100) > 70) {
          playAudio(sounds.psicosis);
        }

        //ya se carga con el dano real
        return {
          ...state,
          efectosPorSec: {
            ...eps,
            psicosis: a.poder,
            tickPsicosis: 3,
          },
        };
      } else if (a.fase == "golpe") {
        const danoFinalPsicosis = Math.floor(
          a.retroceso * (eps.psicosis * P.vidaMaxima * 0.01)
        );
        const vidaFinalPsicosis = Math.floor(P.vida - danoFinalPsicosis);
        return {
          ...state,
          personaje: { ...P, vida: vidaFinalPsicosis },
        };
      }
      return { ...state };
    case A.BUFF.CONFUSION:
      const arrayConfusion = [a.numero, a.modo];
      console.log(`array de confusion en reducer = ${arrayConfusion}`);

      return { ...state, alertConfusion: [arrayConfusion] };
    case A.BUFF.EFECTOS_PS:
      const tipo = isNaN(a.tipo) ? a.tipo : parseInt(a.tipo);
      if (tipo != 3 && campoDeFuerza()) {
        return { ...state };
      }
      switch (tipo) {
        case 1:
          //hemo
          return {
            ...state,
            efectosPorSec: {
              ...eps,
              hemo: Math.floor(eps.hemo + a.valor),
              tickHemo:
                eps.tickHemo > 0
                  ? parseInt(Math.floor((eps.tickHemo + a.ticks) / 2))
                  : a.ticks,
            },
          };
        case "hemoAccion":
          const hemoTickRoll =
            eps.hemo > 0 && eps.tickHemo > 0
              ? parseInt(Math.floor(eps.hemo / (eps.tickHemo * 4)))
              : 0;

          return {
            ...state,
            personaje: {
              ...P,
              vida: Math.floor(P.vida - hemoTickRoll),
            },
          };
        case 2:
          return {
            ...state,
            efectosPorSec: {
              ...eps,
              veneno: eps.veneno + a.valor,
              tickVeneno:
                eps.tickVeneno > 0
                  ? Math.floor((eps.tickVeneno + a.ticks) / 2)
                  : a.ticks,
            },
          };
        case 3:
          //rej
          return {
            ...state,
            efectosPorSec: {
              ...eps,
              reju: eps.reju + a.valor * -1,
              tickReju:
                eps.tickReju > 0
                  ? parseInt((eps.tickReju + a.ticks) / 2)
                  : a.ticks,
            },
          };
        case 4:
          //quemdaura
          const grado = a.valor;
          const duracionQuemadura = Math.floor(grado / 2) + 1;
          console.log("el grado de quemadura es" + grado);
          return {
            ...state,
            efectosPorSec: {
              ...eps,
              quemadura: grado,
              tickQuemadura: duracionQuemadura,
              flagQuemadura: true,
            },
          };
        case "burnAccion":
          const tickBurnArmor = 10;
          const tickBurnVida = Math.ceil(P.vidaMaxima * 0.01);
          return {
            ...state,
            personaje: {
              ...P,
              vida: P.defensa == 0 ? P.vida - tickBurnVida : P.vida,
            },
            bonus: {
              ...state.bonus,
              burnArmadura:
                P.defensa > 0
                  ? state.bonus.burnArmadura + tickBurnArmor
                  : state.bonus.burnArmadura,
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
          ...P,
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
        (!state.bonus.resurreccion &&
          state.equipo.actual.joya[0]?.efecto ===
            EFECTOS_EQUIPO.VIDA_RESURRECCION) ||
        (claseSpec === 501 && state.bonus.cenizas)
      ) {
        if (claseSpec === 501 && state.bonus.cenizas) {
          const ascendenciaActual = state.bonus.ascendencia;
          const llamaActual = state.bonus.llamaInterior;
          const manaMaxActual = P.manaMax;
          const gananciaNeta = Math.floor(
            ((ascendenciaActual % 5) + llamaActual) / 5
          );
          const addManaFinal =
            gananciaNeta + manaMaxActual > 5 ? 5 - manaMaxActual : gananciaNeta;
          const manaTotal = P.manaMax + addManaFinal;

          window.alert(
            "Ahora eres solo un montón de ceniza en el suelo. Pierdes un turno y esperas tu epic resurrecicon"
          );
          return {
            ...state,
            muerteContador: state.muerteContador + 1,
            bonus: {
              ...state.bonus,
              llamaInterior: 0,
              ascendencia: ascendenciaActual + llamaActual,
            },
            personaje: {
              ...P,
              vida: P.vidaMaxima,
              // manaMax: manaTotal ,
            },
          };
        }
        window.alert(
          "El amuleto de resurreccion ha salvado tu vida! No habra segunda oportunidad"
        );
        return {
          ...state,
          bonus: { ...state.bonus, resurreccion: true },
          personaje: { ...P, vida: P.vidaMaxima },
        };
      }
      window.alert("Has muerto, vuelves al casillero 0");
      return { ...estadoReset };
    case A.STATS.MOD_VIDA:
      if (campoDeFuerza() && a.valor > 0) {
        return { ...state };
      }
      const danoFiltrado =
        a.valor > P.defensa ? a.valor - P.defensa : a.valor < 1 ? a.valor : 0;
      if (randomEsquivar && a.valor > 0) {
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
          ...P,
          vida:
            P.vida - danoFiltrado > P.vidaMaxima
              ? P.vidaMaxima
              : P.vida - danoFiltrado,
        },
      };

    case A.STATS.ACTIVAR_SKILL:
      const skillWarrior = () => {
        return {
          ...state,
          personaje: { ...P, ira: 0 },
          bonus: { ...state.bonus, enfurecido: false },
        };
      };
      const skillRoge = () => {
        const energiaCombo = P.energia + Math.floor(P.combo / 2);
        const energiaComboFinal = Math.min(energiaCombo, P.energiaMax);
        return {
          ...state,
          personaje: {
            ...P,
            combo: 0,
            energia: energiaComboFinal,
          },
        };
      };
      const skillWarlock = () => {
        const valorPielDemonio = state.bonus.pielDemonio;
        const limitePielDemonio = 50;
        return {
          ...state,
          personaje: { ...P, mana: 0 },
          bonus: {
            ...state.bonus,
            pielDemonio: Math.min(valorPielDemonio + P.mana, limitePielDemonio),
          },
        };
      };
      const skillMagoTeleport = () => {
        return {
          ...state,
          casillero:
            state.casillero +
            Math.floor(P.mana + Math.floor(P.mana * (P.maleficio / 200))),
          personaje: { ...P, mana: 0 },
        };
      };
      const skillMagoHeal = () => {
        const [healing, overhealingBool, ohValor] = calcularHealing(
          Math.floor(P.mana * (P.curacion / 3)) * modCritSanacion
        );
        const bonusVidaMaxima = overhealingBool ? Math.floor(ohValor / 10) : 0;
        return {
          ...state,
          personaje: {
            ...P,
            mana: 0,
            vida: healing,
            vidaMaximaBonus: P.vidaMaximaBonus + bonusVidaMaxima,
          },
        };
      };
      const skillsObject = {
        101: skillWarrior(),
        102: skillWarrior(),
        201: skillRoge(),
        202: skillRoge(),
        301: skillWarlock(),
        302: skillWarlock(),
        401: skillMagoTeleport(),
        402: skillMagoHeal(),
      };
      const audioObject = {
        102: sounds.heal12,
        101: sounds.heal12,
        201: sounds.discharge,
        202: sounds.discharge,
        301: sounds.discharge,
        302: sounds.discharge,
        401: sounds.teleportSimple,
        402: sounds.heal12,
      };
      playAudio(audioObject[a.personaje]);
      return skillsObject[a.personaje];
    case A.STATS.HANDLE_IRA:
      console.log(
        `Entra a ira y ${
          state.bonus.enfurecido ? `esta enfurecido` : `no esta enfurecido`
        }`
      );
      return {
        ...state,
        personaje: {
          ...P,
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
      const comboCritico = claseSpec === 201 ? P.combo * 3 : 0;
      const comboEsquivar = claseSpec === 202 ? P.combo * 3 : 0;
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
      const vidaAscendencia = state.bonus.ascendencia * 2;
      const modSuperSanacion = state.bonus.superSanacion ? 30 : 0;
      const modificadorEsfumarse = state.bonus.esfumarse ? 30 : 0;
      const armorBurn = state.bonus.burnArmadura;

      const statsObject = {
        defensa: [
          P.defensaBase,
          P.defensaBonus,
          state.bonus.pielDemonio,
          state.bonus.ascendencia,
        ],
        ataque: [
          P.ataqueBase,
          P.ataqueBonus,
          modLegendarioVidaAtaque,
          modLegendarioDadoAtaque,
          modLegendarioOfensivoRegen,
        ],
        critico: [
          P.criticoBase,
          P.criticoBonus,
          state.bonus.criticoKatana,
          comboCritico,
          modSuperSanacion,
        ],
        esquivar: [
          P.esquivarBase,
          P.esquivarBonus,
          comboEsquivar,
          modificadorEsfumarse,
        ],
        maleficio: [
          P.maleficioBase,
          P.maleficioBonus,
          modLegendarioOfensivoRegen,
        ],
        curacion: [P.curacionBase, P.curacionBonus],
        vampirismo: [
          P.vampirismoBase,
          P.vampirismoBonus,
          state.bonus.enfurecido ? 50 : 0,
        ],
        defensaMagica: [P.defensaMagicaBase, P.defensaMagicaBonus],
        regeneracion: [
          P.regeneracionBase,
          P.regeneracionBonus,
          modLegendarioVidaRegen,
        ],
        vidaMaxima: [P.vidaBase, P.vidaMaximaBonus, vidaAscendencia],
      };

      if (statsObject && typeof statsObject === "object") {
        console.log("hola?");

        const nuevoEstadoPersonaje = Object.keys(statsObject).reduce(
          (acc, stat) => {
            const arrayStat = statsObject[stat] || []; // Valor por defecto
            const totalStatEquipo = Object.keys(state.equipo.actual).reduce(
              (accEquipo, slot) => {
                const valorStatEquipo =
                  state.equipo.actual[slot][0]?.[stat] || 0;
                if (typeof valorStatEquipo === "number") {
                  return accEquipo + valorStatEquipo;
                }
                return accEquipo; // El valor se devuelve correctamente
              },
              0
            );

            const totalStat = Math.floor(
              Math.max(
                arrayStat.reduce(
                  (accStat, statValue) => accStat + statValue,
                  0
                ) + totalStatEquipo,
                0
              )
            );

            let statPostModificaciones = totalStat;

            if (stat === "defensa") {
              statPostModificaciones -= armorBurn;
              if (state.bonus.enfurecido) {
                statPostModificaciones = 0;
              } else if (state.bonus.blindadoCargas > 0) {
                statPostModificaciones = state.bonus.defensaBlindado;
              }
              if (claseSpec === 102) {
                statPostModificaciones =
                  statPostModificaciones * (1 + P.ira * 0.1);
              }
            } else if (stat === "ataque") {
              if (claseSpec === 101) {
                statPostModificaciones =
                  statPostModificaciones * (1 + P.ira * 0.1);
              }
            } else if (stat === "defensaMagica") {
              const divisorPsicosis = eps.tickPsicosis === 0 ? 2 : 1;
              statPostModificaciones = Math.floor(
                (totalStat + Math.floor(totalStat / 2)) / divisorPsicosis
              );
            }

            return { ...acc, [stat]: statPostModificaciones };
          },
          { ...P }
        );

        return {
          ...state,
          personaje: {
            ...nuevoEstadoPersonaje,
            manaMax: Math.min(
              P.manaBase + Math.floor(state.bonus.ascendencia / 5),
              5
            ),
          },
        };
      }

    case A.STATS.MODIFICAR_EQUIPO:
      console.log(`Entra al reducer de modificacion de equipo`);
      switch (a.tipo) {
        case "arma":
          const nuevoArma = { ...state.equipo.bolsa.arma[a.indice] };
          console.log(`Nuevo arma = ${state.equipo.bolsa.arma[a.indice]}`);

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
              ...P,
              energia: P.energia - 1,
            },
          };
        case "armadura":
          const nuevoArmadura = {
            ...state.equipo.bolsa.armadura[a.indice],
          };
          console.log(`Nueva armadura = ${state.equipo.bolsa.arma[a.indice]}`);

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
              ...P,
              energia: P.energia - 1,
            },
          };
        case "joya":
          const nuevaJoya = { ...state.equipo.bolsa.joya[a.indice] };
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
              ...P,
              energia: P.energia - 1,
            },
          };
        default:
          return { ...state };
      }

    case A.STATS.HEAL_ASCENSO:
      return {
        ...state,
        personaje: { ...P, vida: P.vidaMaxima },
      };
    case A.DADO.ACTIVACION_DADO:
      const ESTADO_SHORTCOUT = {
        ...state[a.dado],
        estado: 0,
        lock: false,
      };
      if (
        !state.algunNegativo ||
        state[a.dado].estado == 3 ||
        (a.n == 18 && a.modo === true)
      ) {
        if (campoDeFuerza() && state[a.dado].estado == 3) {
          return {
            ...state,
            [a.dado]: ESTADO_SHORTCOUT,
          };
        }
        if (state[a.dado].estado != 0 && state.estadoTurno) {
          const gastoEnergia = a.gastoEnergia;
          console.log(`energia = ${gastoEnergia}`);
          if (gastoEnergia > P.energia) return { ...state };
          const uniModPresente = state.uniMod.includes(a.n);

          let modo = a.modo;
          let numero = a.n;
          console.log(`numero activado= ${numero}/${modo}`);

          if (modo || (!modo && uniModPresente && claseSpec != 501)) {
            switch (numero) {
              case 1:
                const avanzarCasillero = 1 + Math.floor(P.ataque / 50);
                return {
                  ...state,
                  casillero: state.casillero + avanzarCasillero,
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
                    energia: P.energia - gastoEnergia,
                    combo: P.combo < P.comboMax ? P.combo + 1 : P.combo,
                  },
                };
              case 2:
                if (randomEsquivar) {
                  window.alert(`Has esquivado el efecto negativo!`);

                  return {
                    ...state,
                    [a.dado]: ESTADO_SHORTCOUT,
                    personaje: {
                      ...P,
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
                    [a.dado]: ESTADO_SHORTCOUT,
                    personaje: {
                      ...P,
                      vida: vidaFinal,
                      energia: P.energia - gastoEnergia,
                      mana:
                        state.numeroClase == 300 && P.mana < P.manaMax
                          ? P.mana + 1
                          : P.mana,
                    },
                  };
                }

              case 3:
                // if (state.dados.dadosTotales - state.dados.dadosTemporales >= state.numDadoMaximo) {
                //   window.alert("Haz alcanzado el numero maximo de dados");
                //   return { ...state };
                // }
                window.alert(`Inversion a futuro.Pierdes un turno`);
                return {
                  ...state,
                  [a.dado]: ESTADO_SHORTCOUT,
                  dados: {
                    ...state.dados,
                    dadosFuturos: state.dados.dadosFuturos + 2,
                  },
                  personaje: {
                    ...P,
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
                    [a.dado]: ESTADO_SHORTCOUT,

                    personaje: {
                      ...P,
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
                    [a.dado]: ESTADO_SHORTCOUT,

                    personaje: {
                      ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
                    energia: P.energia + state[a.dado].estado - gastoEnergia,
                  },
                };
              case 6:
                if (state.automatico) {
                  if (state[a.dado].estado == 4) {
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
                        const danoPsicosisFlat = eps.psicosis;
                        const danoPsicosis =
                          eps.tickPsicosis > 0
                            ? danoPsicosisFlat * reducRetroceso
                            : 0;
                        return {
                          ...state,
                          [a.dado]: ESTADO_SHORTCOUT,
                          casillero: mayorCero
                            ? state.casillero - reducRetroceso
                            : 0,
                          casillerosMovidos: 0,
                          personaje: {
                            ...P,
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
                        [a.dado]: ESTADO_SHORTCOUT,
                      };
                    }
                  } else if (state[a.dado].estado != 4) {
                    return {
                      ...state,
                      [a.dado]: { ...state[a.dado], estado: 4 },
                      personaje: {
                        ...P,
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
                    [a.dado]: ESTADO_SHORTCOUT,
                    personaje: {
                      ...P,
                      energia: P.energia - gastoEnergia,
                      combo: P.combo < P.comboMax ? P.combo + 1 : P.combo,
                    },
                  };
                }
              case 7:
                return {
                  ...state,
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  dados: {
                    ...state.dados,
                    dadosTemporales:
                      cantidadTotalDados < state.numDadoMaximo
                        ? state.dados.dadosTemporales + 1
                        : state.dados.dadosTemporales,
                  },

                  personaje: {
                    ...P,
                    energia: P.energia + state[a.dado].estado - gastoEnergia,
                  },
                };
              case 9:
                // lider, +1poder ataque base
                return {
                  ...state,
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  casillero: casilleroResultante,
                  personaje: {
                    ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
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
                    playAudio(sounds.cargar);
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
                    const danoCargar = P.ataque;
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
                      [a.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        criticoKatana: nuevoCriticoKatana(),
                      },
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                        vida: vidaFinal,
                      },
                    };
                  case 102:
                    playAudio(sounds.blindado);
                    const nuevoValorDefensa = Math.floor(P.defensa * 1.5);
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: {
                        ...state.bonus,
                        blindadoCargas: state.bonus.blindadoCargas + 1,
                        defensaBlindado: nuevoValorDefensa,
                      },
                    };
                  case 201:
                    playAudio(sounds.golpeKidney);
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
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
                        [a.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...P,
                          energia: P.energia - gastoEnergia,
                          vida: nuevaVida12,
                        },
                      };
                    }
                    playAudio(sounds.esfumarse);
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: { ...state.bonus, esfumarse: true },
                    };
                  case 301:
                  case 302:
                    playAudio(sounds.warlockSimple);
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                      },
                    };
                  case 401:
                  case 402:
                    playAudio(sounds.clarividencia);
                    const chanceClari = eps.chanceClari;
                    const clarividencia = eps.clarividencia;
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
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                      },
                      efectosPorSec: {
                        ...eps,
                        clarividencia: nuevaClari,
                        chanceClari: nuevaChanceClari,
                      },
                    };
                  case 501:
                    const danoBase =
                      P.ataque +
                      Math.floor(
                        state.bonus.llamaInterior * 0.3 +
                          state.bonus.ascendencia * 0.7
                      );
                    const [, vampirismo] = calcularDano(
                      danoBase,
                      randomCritico,
                      2
                    );
                    const nuevasLlamas =
                      state.bonus.llamaInterior +
                      Math.floor(Math.random() * 3) +
                      1;
                    const addMana =
                      Math.floor(
                        Math.random(Math.floor(state.bonus.ascendencia / 10))
                      ) + 1;
                    const nuevoMana =
                      P.mana + addMana > P.manaMax
                        ? P.manaMax
                        : P.mana + addMana;
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      bonus: { ...state.bonus, llamaInterior: nuevasLlamas },
                      personaje: {
                        ...P,
                        vida:
                          P.vida + vampirismo > P.vidaMaxima
                            ? P.vidaMaxima
                            : P.vida + vampirismo,
                        mana: nuevoMana,
                      },
                    };
                  default:
                    return { ...state };
                }
              case 13:
                //peste
                return {
                  ...state,
                  [a.dado]: {
                    ...state[a.dado],
                    estado: 0,
                    peste: [true, 3],
                  },
                  personaje: {
                    ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
                    energia: P.energia - gastoEnergia,
                  },
                  dados: {
                    ...state.dados,
                    dadosPermanentes: state.dados.dadosPermanentes + 1,
                  },
                };
              case 15:
                const dano15 = Math.floor(P.ataque * 1.5 + P.maleficio * 0.5);
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  bonus: {
                    ...state.bonus,
                    criticoKatana: nuevoCriticoKatana(),
                  },
                  personaje: {
                    ...P,
                    vida: P.vida + vampirismo15 + vampBase,
                    energia: P.energia - gastoEnergia,
                    combo: P.combo < P.comboMax ? P.combo + 1 : P.combo,
                  },
                };
              case 16:
                //campo de fuerza
                return {
                  ...state,
                  [a.dado]: ESTADO_SHORTCOUT,
                  bonus: { ...state.bonus, campoFuerza: true },
                  personaje: {
                    ...P,
                    energia: P.energia - gastoEnergia,
                  },
                };
              case 17:
                return {
                  ...state,
                  [a.dado]: ESTADO_SHORTCOUT,
                  confusion: true,
                  personaje: {
                    ...P,
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
                  reju: eps.reju,
                  clarividencia: eps.clarividencia,
                  tickReju: eps.tickReju,
                  chanceClari: eps.chanceClari,
                };
                const nuevoEstado = {
                  ...state,
                  confusion: false,
                  personaje: {
                    ...P,
                    energia: P.energia - gastoEnergia,
                  },
                  efectosPorSec: { ...efectosPorsegundo },
                };

                for (let x = 1; x <= state.dados.dadosTotales; x++) {
                  const dadoActual = `roll${x}`;
                  if (dadoActual == a.dado) {
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
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
                        [a.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...P,
                          energia: P.energia - gastoEnergia,
                          ataqueBonus: P.ataqueBonus + 3,
                        },
                      };
                    }
                    playAudio(sounds.rage);
                    return {
                      ...state,

                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: {
                        ...state.bonus,
                        enfurecido: true,
                      },
                    };
                  case 102:
                    playAudio(sounds.bigImpact1);
                    const [, vampEf20] = calcularDano(
                      P.defensa,
                      randomCritico,
                      2
                    );
                    const [curacionVamp, ,] = calcularHealing(vampEf20);
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        blindado: false,
                        criticoKatana: nuevoCriticoKatana(),
                      },
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                        vida: curacionVamp,
                      },
                    };
                  case 201:
                    playAudio(sounds.siniestro);
                    const ataqueSiniestro = P.ataque * 2 + P.maleficio * 1;
                    const [danoSiniestro, vampEf20Rogue] = calcularDano(
                      ataqueSiniestro,
                      randomCritico,
                      3
                    );
                    const [curacionVampRogue, ,] =
                      calcularHealing(vampEf20Rogue);

                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        criticoKatana: nuevoCriticoKatana(),
                      },
                      personaje: {
                        ...P,
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
                        [a.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...P,
                          energia: P.energia - gastoEnergia,
                          ataqueBonus: P.ataqueBonus + 3,
                        },
                      };
                    }
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: { ...state.bonus, danzaCuchillas: true },
                    };
                  case 301:
                    playAudio(sounds.warlockMass);
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
                    const dano20 = P.maleficio;
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
                      [a.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        criticoKatana: nuevoCriticoKatana(),
                      },
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                        mana: P.mana + 1 > P.manaMax ? P.manaMax : P.mana + 1,
                        vida: vidaFinal,
                      },
                    };
                  case 302:
                    const nuevoPoderPsicosis = state.bonus.poderPsicosis + 1;
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,
                        poderPsicosis: nuevoPoderPsicosis,
                      },
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                      },
                    };
                  case 401:
                    window.alert(`Intercambias la posicion de 2 jugadores.`);
                    playAudio(sounds.teleport20);
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                      },
                    };

                  case 402:
                    if (state.bonus.superSanacion) {
                      return {
                        ...state,
                        [a.dado]: ESTADO_SHORTCOUT,
                        personaje: {
                          ...P,
                          energia: P.energia - gastoEnergia,
                          curacionBonus: P.curacionBonus + 3,
                        },
                      };
                    }
                    playAudio(sounds.iluminado);
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        energia: P.energia - gastoEnergia,
                      },
                      bonus: { ...state.bonus, superSanacion: true },
                    };
                  case 501:
                    if (!window.confirm("Seguro que deseas ascender?")) {
                      return { ...state };
                    }
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      bonus: {
                        ...state.bonus,

                        cenizas: true,
                      },
                      efectosPorSec: {
                        ...eps,
                        quemadura: 7,
                        tickQuemadura: 1,
                        flagQuemadura: false,
                      },
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  bonus: {
                    ...state.bonus,
                    criticoKatana: nuevoCriticoKatana(),
                  },
                  personaje: {
                    ...P,
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
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        energia:
                          P.energia < P.energiaMax ? P.energia + 1 : P.energia,
                      },
                    };
                  } else if (state.numeroClase != 200) {
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
                        mana:
                          state.numeroClase == 300 && P.mana < P.manaMax
                            ? P.mana + 1
                            : P.mana,
                      },
                    };
                  }
                } else {
                  // entre el 5-10% de max hp + 50-100% defensa.
                  const dano2 =
                    Math.floor(randomNumber(11) + 4) * P.vidaMaxima * 0.01 +
                    (randomNumber(51) + 49) * P.defensa * 0.01;
                  return {
                    ...state,
                    [a.dado]: ESTADO_SHORTCOUT,

                    personaje: {
                      ...P,
                      vida:
                        P.defensa > dano2
                          ? P.vida
                          : P.vida + Math.floor(P.defensa - dano2),
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  dados: {
                    ...state.dados,
                    dadosTemporales: state.dados.dadosTemporales + 1,
                  },
                  personaje: {
                    ...P,
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
                  const accion = parseInt(a.n);
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
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
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
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
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
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
                      [a.dado]: ESTADO_SHORTCOUT,
                      personaje: {
                        ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
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
                  if (state[a.dado].estado == 4) {
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
                              [a.dado]: ESTADO_SHORTCOUT,
                              ataqueAcumulado: 0,

                              personaje: {
                                ...P,
                                energia: P.energia + 1,
                              },
                            };
                          } else {
                            return {
                              ...state,
                              [a.dado]: ESTADO_SHORTCOUT,
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
                            [a.dado]: ESTADO_SHORTCOUT,
                            ataqueAcumulado: 0,

                            personaje: {
                              ...P,
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
                        [a.dado]: ESTADO_SHORTCOUT,
                        bonus: {
                          ...state.bonus,
                          criticoKatana: nuevoCriticoKatana(),
                        },
                        personaje: {
                          ...P,
                          vida:
                            vidaFinal > P.vidaMaxima ? P.vidaMaxima : vidaFinal,
                        },
                      };
                    }
                  } else if (state[a.dado].estado != 4) {
                    return {
                      ...state,
                      [a.dado]: { ...state[a.dado], estado: 4 },
                      personaje: {
                        ...P,
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

                    [a.dado]: ESTADO_SHORTCOUT,
                    personaje: {
                      ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  bonus: {
                    ...state.bonus,
                    criticoKatana: nuevoCriticoKatana(),
                  },
                  personaje: {
                    ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
                    maleficioBonus: P.maleficioBonus + 1,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  casillero: casilleroResultante,
                  personaje: {
                    ...P,
                    vida: vidaResultante,
                    energia: P.energia - gastoEnergia,
                    mana:
                      claseSpec < 400 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                  },
                };

              case 11:
                const curacion =
                  state.numeroClase == 100 || state.numeroClase == 200
                    ? Math.floor(P.curacion * 3)
                    : Math.floor(P.curacion * 2) * modCritSanacion;
                const [healing] = calcularHealing(curacion);
                return {
                  ...state,
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
                    energia: P.energia - gastoEnergia,
                    vida: healing,
                    mana:
                      claseSpec == 401 || (claseSpec == 402 && P.mana + 1 <= 5)
                        ? P.mana + 1
                        : P.mana,
                  },
                };
              case 12:
                switch (claseSpec) {
                  case 501:
                    const curacionBase = P.curacion + state.bonus.ascendencia;
                    const [vidaFinal] = calcularHealing(curacionBase);
                    const nuevasLlamas =
                      state.bonus.llamaInterior +
                      Math.floor(Math.random() * 3) +
                      1;
                    const addMana =
                      Math.floor(
                        Math.random(Math.floor(state.bonus.ascendencia / 10))
                      ) + 1;
                    const nuevoMana =
                      P.mana + addMana > P.manaMax
                        ? P.manaMax
                        : P.mana + addMana;
                    return {
                      ...state,
                      [a.dado]: ESTADO_SHORTCOUT,

                      bonus: { ...state.bonus, llamaInterior: nuevasLlamas },
                      personaje: {
                        ...P,
                        vida: vidaFinal,
                        mana: nuevoMana,
                      },
                    };
                }
                break;

              case 13:
                const nuevosCorruptos = nuevoArrayCorrupcion();
                console.log(`corruptos actualizado${nuevosCorruptos}`);
                if (a.accion == "contagio") {
                  return {
                    ...state,
                    corruptos: [...nuevosCorruptos],
                    corruptosContador: state.corruptosContador + 1,
                  };
                }
                return {
                  ...state,
                  corruptos: [...nuevosCorruptos],
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
                    energia: P.energia - gastoEnergia,
                    ira: P.ira >= P.iraMax ? P.iraMax : P.ira + 1,
                    mana:
                      claseSpec < 400 && P.mana < P.manaMax
                        ? P.mana + 1
                        : P.mana,
                  },
                };
              case 15:
                const dano15 = Math.floor(P.ataque * 0.8 + P.maleficio * 1.2);
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
                    ...P,
                    vida: vidaFinal15,
                    energia: P.energia - gastoEnergia,
                    combo: P.combo < P.comboMax ? P.combo + 1 : P.combo,
                  },

                  [a.dado]: ESTADO_SHORTCOUT,
                };
              case 16:
                return {
                  ...state,
                  personaje: {
                    ...P,
                    energia: P.energia - gastoEnergia,
                    defensaMagicaBonus: P.defensaMagicaBonus + 1,
                  },
                  [a.dado]: ESTADO_SHORTCOUT,
                };
              case 17:
                const statsDisminuidos = {
                  ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
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
                    ...P,
                    energia: P.energia - gastoEnergia,
                    vida: curacion18,
                    vidaMaximaBonus:
                      P.vidaMaximaBonus + Math.floor(ohValor / 10),
                  },
                  [a.dado]: ESTADO_SHORTCOUT,
                };
              case 19:
                // +3 Defensa, Esquivar, Curacion & +5HP Max
                return {
                  ...state,
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
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
                  [a.dado]: ESTADO_SHORTCOUT,
                  personaje: {
                    ...P,
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
