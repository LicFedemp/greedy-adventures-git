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
    let numero = parseInt(state[props.dado].numero);
    let modo = state[props.dado].modo;
    let gastoEnergia;
    switch (estadoActual) {
      case 1:
        gastoEnergia = 1;
        break;
      case 2:
      case 3:
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

    const estadoActual = parseInt(state[props.dado].estado);
    //colador 1
if(estadoActual === 0){return}
    //colador 2
    const numero = parseInt(state[props.dado].numero);
    const obligado = state.dadosObligados.includes(numero);
    const obligadoPresente = comprobacionNegativos();
    const esPurificacion =
    state[props.dado].numero == 18 && state[props.dado].modo == true
      ? true
      : false;

if(!obligado && obligadoPresente&& !esPurificacion){return}
// Supera coladores
    const [n, modo, gastoEnergia] = calculoConfusion(estadoActual);
    if (
      !state.estadoTurno ||
      gastoEnergia > state.personaje.energia ||
      (!obligado && obligadoPresente && !state.confusion && !esPurificacion)
    ) {
      return;
    }
    //peste
    if (state[props.dado].peste[1] > 0) {
      console.log(`entra a peste aunque el estado sea ${estadoActual}`);
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
// if(n == 4||n ==8){
//   for(let x = 0; x<3;x++){
//     dispatch({
//       type: A.DADO.ACTIVACION_DADO,
//       n,
//       modo,
//       dado: [props.dado],
//       gastoEnergia: 0,
//     });
//   }
//   return
// }
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
    //tick hemo
    if (state.efectosPorSec.tickHemo > 0 && !obligado) {
      dispatch({ type: A.BUFF.EFECTOS_PS, tipo: "hemoAccion" });
    }
  };
  
  const toggleDado = () => {
    dispatch({ type: A.DADO.MODO_DADO, dado: [props.dado] });
  };

  const colorDado = () => {
    const numeroDado = parseInt(state[props.dado].numero);
    const modo = state[props.dado].modo;
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
      case 11:
        retorno = modo ? `estado-verde` : `estado-naranja`;
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
        <p>{props.descripcion}</p>
      </div>
    </div>
  );
}
