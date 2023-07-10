import { useGeneralContext } from "./Provider";
import { ACCIONES } from "./MainReducer";
import { useRef } from "react";
export function Jugador(props) {
  const { state, dispatch } = useGeneralContext();
  const inputRef = useRef(null);

  const incrementarCasillero = () => {
    console.log(state.turnoActual);
    dispatch({
      type: ACCIONES.CASILLERO,
      jugador: props.jugador,
      valor: 1,
    });
  };
  const decrementarCasillero = () => {
    if (state[props.jugador].casillero > 0) {
      dispatch({
        type: ACCIONES.CASILLERO,
        jugador: props.jugador,
        valor: -1,
      });
    }
  };
  const handleTurno = () => {
    dispatch({
      type: ACCIONES.TURNO,
      nombre: inputRef.current.value,
    });
    console.log("Mira mama," + inputRef.current.value);
  };
  return (
    <div>
      <button onClick={handleTurno}>Turno</button>
      <button onClick={incrementarCasillero}>+</button>
      <button onClick={decrementarCasillero}>-</button>
      <p>{state[props.jugador].casillero}</p>
      <input ref={inputRef}></input>
    </div>
  );
}
