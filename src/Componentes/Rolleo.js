import { useGeneralContext } from "./Provider";
import { ACCIONES, A } from "./Objetos/Acciones";
import { DADOS } from "./Objetos/Dados";
import "../StyleSheets/Rolleo.css";
import { useEffect } from "react";
import { GiBrokenSkull, GiPlagueDoctorProfile } from "react-icons/gi";

//descripcion aca.
export function Rolleo(props) {
  const { state, dispatch } = useGeneralContext();

  const handleLock = () => {
    dispatch({ type: ACCIONES.LOCK, dado: props.dado });
  };
  const estadosActivar = () => {
    const n = parseInt(state[props.dado].estado);
    switch (n) {
      case 2:
        return "estado-amarillo";
      case 3:
        return "estado-violeta";
      case 1:
        return "estado-gris";
      case 0:
        return "estado-bordo";
      case 4:
        return "estado-verde";
      default:
        return "estado-gris";
    }
  };
  const ejecutarAccion = () => {
    const n = parseInt(state[props.dado].numero);
    const modo = state[props.dado].modo;
    let gastoEnergia = 0;
    const estadoActual = parseInt(state[props.dado].estado);
    switch (estadoActual) {
      case 1:
        gastoEnergia = 1;
        break;
      case 2:
      case 3:
        gastoEnergia = 0;
        break;
    }
    if (state[props.dado].peste[1] > 0) {
      dispatch({ type: A.BUFF.CONTAGIO_PESTE, dado: [props.dado] });
    }
    if (
      state.poderDado == 20 &&
      state.corruptos.includes(n) &&
      !state.dadosObligados.includes(n)
    ) {
      dispatch({
        type: A.DADO.ACTIVACION_DADO,
        n: 13,
        modo: false,
        dado: [props.dado],
        gastoEnergia: 0,
        accion: "contagio",
      });
    }

    dispatch({
      type: A.DADO.ACTIVACION_DADO,
      n,
      modo,
      dado: [props.dado],
      gastoEnergia,
    });

    if (n == 3 && modo) {
      dispatch({ type: A.GRAL.TOGGLE_TURNO });
    }
    const obligados = state.dadosObligados.includes(n);
    if (
      state.efectosPorSec.tickHemo > 0 &&
      !obligados &&
      estadoActual != 0 &&
      gastoEnergia <= state.personaje.energia
    ) {
      dispatch({ type: A.BUFF.EFECTOS_PS, tipo: "hemoAccion" });
    }
  };
  const toggleDado = () => {
    dispatch({ type: A.DADO.MODO_DADO, dado: [props.dado] });
  };
  const calcularNuevoClari = (variable) => {
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
      case 45:
      case 0:
        nuevaChanceClari = 15;
        nuevaClari = clarividencia + 1;
        break;

      default:
        break;
    }
    if (variable == "clari") {
      return nuevaClari;
    } else {
      return nuevaChanceClari;
    }
  };
  const cartaSkill = (tier) => {
    const personaje = parseInt(state.numeroClase) + parseInt(state.numeroSpec);
    if (tier == 1) {
      switch (personaje) {
        case 101:
          return `Cargar`;
        case 102:
          return `Blindado`;
        case 201:
          return `Golpe en los riñones`;
        case 202:
          return `Esfumarse: +30% esquivar`;
        case 301:
        case 302:
          return `Psicosis`;
        case 401:
        case 402:
          return `Clarividencia: ${calcularNuevoClari(
            "chance"
          )}% +${calcularNuevoClari("clari")} Mana x turno`;
        default:
          break;
      }
    }
  };
  const descripcion = () => {
    const n = parseInt(state[props.dado].numero);
    if (state[props.dado].modo) {
      switch (n) {
        case 1:
          const avanzarCasillero = 1 + Math.floor(state.personaje.ataque / 50);
          return `Avanzas ${avanzarCasillero} ${
            avanzarCasillero > 1 ? `casilleros` : `casillero`
          }`;
        case 2:
          return DADOS.D2.A.DECRIPCION;
        case 3:
          return DADOS.D3.A.DECRIPCION;
        case 4:
          return `Lanzas D${
            state.automatico
              ? 4 + Math.floor(state.personaje.ataque / 50)
              : 4 + Math.floor(state.personaje.ataque / 100) * 2
          }, avanza el resultado`;
        case 5:
          return `${state[props.dado].estado == 2 ? `+2` : `+1`} Energia`;
        case 6:
          return DADOS.D6.A.DECRIPCION;
        case 7:
          const retrocesoPotenciado =
            1 + Math.floor(state.personaje.maleficio / 50);
          return `Haz retroceder ${retrocesoPotenciado} ${
            retrocesoPotenciado > 1 ? `casilleros` : `casillero`
          } a cualquier jugador.`;
        case 8:
          return `${
            state[props.dado].estado == 2 ? `+2` : `+1`
          } Energia & +1 Dado`;
        case 9:
          return DADOS.D9.A.DECRIPCION;
        case 10:
          return DADOS.D10.A.DECRIPCION;
        case 11:
          const clase = state.numeroClase;
          return `+1  ${
            clase == 100
              ? `punto de ira`
              : clase == 200
              ? `punto de combo`
              : `mana`
          }`;
        case 12:
          return ` ${cartaSkill(1)}`;
        case 13:
          return DADOS.D13.A.DECRIPCION;
        case 17:
          return DADOS.D17.A.DECRIPCION;
      }
    } else if (!state[props.dado].modo) {
      switch (n) {
        case 1:
          return `Infliges ${state.personaje.ataque} puntos de dano ${
            state.numeroClase == 100 || state.numeroClase == 200
              ? `al jugador mas cercano`
              : `a cualquier jugador`
          }`;
        case 2:
          const danoRecibido = 10 - state.personaje.defensa;
          return `Recibes ${
            danoRecibido <= 0 ? `0 ` : danoRecibido
          } puntos de dano`;
        case 3:
          return DADOS.D3.B.DECRIPCION;
        case 4:
          return DADOS.D4.B.DECRIPCION;
        case 5:
          return `Te curas ${state.personaje.curacion} puntos de vida`;
        case 6:
          return `Lanzas D6. Resultado <6: infliges ${Math.floor(
            state.personaje.ataque / 2
          )} PD. Si D6 == 6, recibiras ${Math.floor(
            state.personaje.ataque * 2
          )} PD`;
        case 7:
          const ataque7 = Math.floor(state.personaje.ataque * 0.5);
          const maleficio7 = Math.floor(state.personaje.maleficio * 1);
          return `Infliges ${Math.floor(ataque7 + maleficio7)} puntos de dano `;
        case 8:
          return DADOS.D8.B.DECRIPCION;
        case 9:
          return DADOS.D9.B.DECRIPCION;
        case 10:
          return DADOS.D10.A.DECRIPCION;
        case 11:
          const clase = state.numeroClase;
          return `Te curas ${
            clase == 100 || clase == 200
              ? Math.floor(state.personaje.curacion * 4)
              : Math.floor(state.personaje.curacion * 2)
          }`;
        case 12:
          return ` ${cartaSkill(1)}`;

        case 13:
          return `Corrupcion: corrompe 1 Num. Esparcible mientras utilices D20. `;
        case 17:
          return DADOS.D17.B.DECRIPCION;
      }
    }
  };
  const colorDado = () => {
    const numeroDado = parseInt(state[props.dado].numero);
    switch (numeroDado) {
      // ROJO
      case 1:
      case 14:
      case 19:
        return `estado-rojo`;
      case 4:
        if (state[props.dado].modo) {
          return `estado-rojo`;
        } else if (!state[props.dado].modo) {
          return `estado-naranja`;
        }
      case 9:
        if (state[props.dado].modo) {
          return `estado-rojo`;
        } else if (!state[props.dado].modo) {
          return `estado-naranja`;
        }

      // VIOLETA
      case 2:
      case 7:
      case 13:
      case 17:
        return `estado-violeta`;
      // VERDE
      case 5:
        if (state[props.dado].modo) {
          return `estado-verde`;
        } else if (!state[props.dado].modo) {
          return `estado-celeste`;
        }
      case 8:
        if (state[props.dado].modo) {
          return `estado-verde`;
        } else if (!state[props.dado].modo) {
          return `estado-naranja`;
        }
      case 15:
      case 3:
        return `estado-verde`;
      //NARANJA
      case 6:
      case 18:
        return `estado-naranja`;
      //CELESTE
      case 11:
        return `estado-celeste`;
      case 10:
        return `estado-marron`;
      case 12:
      case 16:
      case 20:
        const clase = parseInt(state.numeroClase);
        switch (clase) {
          case 100:
            return `estado-rojo`;
          case 200:
            return `estado-verde`;
          case 300:
            return `estado-violeta`;
          case 400:
            return `estado-celeste`;
        }

      default:
        return `estado-gris`;
    }
  };

  return (
    <div
      className={`div-columna div-roll ${
        state[props.dado].peste[0] ? `roll-poisonAnimation` : ``
      }`}
    >
      <div className={`div-dado-superior`}>
        <p className={`p-dado-superior`}>
          {" "}
          {state[props.dado].peste[1] > 0 ? (
            state[props.dado].peste[1]
          ) : (
            <GiPlagueDoctorProfile className={`plaga-inactiva`} />
          )}
        </p>
        {}
        <button
          className={`btn-superiores ${estadosActivar()}`}
          onClick={ejecutarAccion}
        >
          Activar
        </button>
        <p className={`p-dado-superior`}>
          {" "}
          {state.corruptos.includes(state[props.dado].numero) &&
          state.poderDado == 20 ? (
            <GiBrokenSkull className={`corrupcion-activa`} />
          ) : (
            <GiBrokenSkull className={`corrupcion-inactiva`} />
          )}
        </p>
      </div>
      <button className={`btn-dado ${colorDado()}`} onClick={toggleDado}>
        {state[props.dado].numero}
      </button>
      <div className="div-descripcion">
        <p>{descripcion()}</p>
      </div>
    </div>
  );
}
