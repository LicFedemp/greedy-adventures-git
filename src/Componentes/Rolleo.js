import { useGeneralContext } from "./Provider";
import { ACCIONES, A } from "./Objetos/Acciones";
import { DADOS } from "./Objetos/Dados";
import "../StyleSheets/Rolleo.css";
import { useEffect } from "react";
import { GiBrokenSkull, GiPlagueDoctorProfile } from "react-icons/gi";
import { sounds } from "./Objetos/Audios";

//descripcion aca.
export function Rolleo(props) {
  const { state, dispatch } = useGeneralContext();
  const dadoActual = state[props.dado];

  const estadosActivar = () => {
    const n = parseInt(dadoActual.estado);
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
  const comprobacionNegativos = () => {
    for (let x = 1; x <= state.dados.dadosTotales; x++) {
      const estado = state[`roll${x}`].estado;
      if (estado == 3) {
        return true;
      }
    }
    return false;
  };
  const calculoConfusion = (estadoActual) => {
    let numero = parseInt(dadoActual.numero);
    let modo = dadoActual.modo;
    let gastoEnergia;
    switch (estadoActual) {
      case 1:
        gastoEnergia = 1;
        break;
      case 2:
      case 3:
      case 4:
        gastoEnergia = 0;
        break;
    }
    if (state.confusion) {
      numero = parseInt(Math.floor(Math.random() * 20) + 1);
      modo = parseInt(Math.floor(Math.random() * 2) + 1) == 1 ? true : false;
      console.log(`entra al bucle de confusion, numer= ${numero}`);
      while (numero == 6) {
        numero = parseInt(Math.floor(Math.random() * 20) + 1);

        modo = parseInt(Math.floor(Math.random() * 2) + 1) == 1 ? true : false;
      }
    }

    const arrayRetorno = [numero, modo, gastoEnergia];
    return arrayRetorno;
  };

  const ejecutarAccion = () => {
    new Audio(sounds.simpleClick).play();

    const estadoActual = parseInt(dadoActual.estado);
    //colador 1
    dispatch({ type: A.DADO.NEGATIVO });
    if (estadoActual === 0) {
      return;
    }
    //colador 2
    const numero = parseInt(dadoActual.numero);
    const obligado = state.dadosObligados.includes(numero);
    const obligadoPresente = comprobacionNegativos();
    const esPurificacion =
      dadoActual.numero == 18 && dadoActual.modo == true ? true : false;

    if (!obligado && obligadoPresente && !esPurificacion && !state.confusion) {
      return;
    }
    // Supera coladores
    const [n, modo, gastoEnergia] = calculoConfusion(estadoActual);
    if (!state.estadoTurno || gastoEnergia > state.personaje.energia) {
      return;
    }
    //peste
    if (dadoActual.peste[1] > 0) {
      dispatch({ type: A.BUFF.CONTAGIO_PESTE, dado: [props.dado] });
    }
    //corrupcion
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
    //activacion dado
    //confusion: modifica el array de confusion (chequeador?)
    if (state.confusion) {
      dispatch({ type: A.BUFF.CONFUSION, numero: n, modo });
      console.log(`array de confusion = ${state.alertConfusion}`);
    }

    dispatch({
      type: A.DADO.ACTIVACION_DADO,
      n,
      modo,
      dado: [props.dado],
      gastoEnergia,
    });
    //perdida de turno
    if (n == 3 && modo) {
      dispatch({ type: A.GRAL.TOGGLE_TURNO });
    }
  };

  const toggleDado = () => {
    new Audio(sounds.flipCard).play();
    setTimeout(() => {
      dispatch({ type: A.DADO.MODO_DADO, dado: [props.dado] });
    }, 300);
  };
  const colorPersonaje = () => {
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
      case 500:
        return `estado-amarillo`;
    }
  };
  const colorDado = () => {
    const numeroDado = parseInt(dadoActual.numero);
    const modo = dadoActual.modo;
    let retorno = ``;
    switch (numeroDado) {
      // ROJO
      case 1:
      case 3:
      case 15:
        return `estado-rojo`;
      case 4:
      case 14:
        retorno = modo ? `estado-rojo` : `estado-naranja`;
        return retorno;
      case 9:
        retorno = modo ? `estado-rojo` : `estado-violeta`;
        return retorno;
      // VIOLETA
      case 2:
      case 7:
      case 13:
      case 17:
        return `estado-violeta`;
      // VERDE
      case 5:
        retorno = modo ? `estado-verde` : `estado-heal`;
        return retorno;
      case 8:
        retorno = modo ? `estado-verde` : `estado-naranja`;
        return retorno;

      case 11:
        retorno = modo ? colorPersonaje() : `estado-heal`;
        return retorno;

      //NARANJA
      case 6:
      case 19:
        return `estado-naranja`;
      //CELESTE
      case 16:
      case 18:
        return `estado-heal`;
      case 10:
        return `estado-marron`;

      case 12:
      case 20:
        return colorPersonaje();
      default:
        return `estado-gris`;
    }
  };

  return (
    <div
      className={`div-columna div-roll ${
        dadoActual.peste[0] ? `roll-poisonAnimation` : ``
      }`}
    >
      <div className={`div-dado-superior`}>
        <p className={`p-dado-superior`}>
          {" "}
          {dadoActual.peste[1] > 0 ? (
            dadoActual.peste[1]
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
          {state.corruptos.includes(dadoActual.numero) &&
          state.poderDado == 20 ? (
            <GiBrokenSkull className={`corrupcion-activa`} />
          ) : (
            <GiBrokenSkull className={`corrupcion-inactiva`} />
          )}
        </p>
      </div>
      <button className={`btn-dado ${colorDado()}`} onClick={toggleDado}>
        {dadoActual.numero}
      </button>
      <div className="div-descripcion">
        <p>{props.descripcion}</p>
      </div>
    </div>
  );
}
