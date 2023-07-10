import { useGeneralContext } from "./Provider";
import { ACCIONES } from "./MainReducer";
import { useRef, useState, useEffect } from "react";
import "../StyleSheets/SeleccionPersonaje.css";

export function SeleccionPersonaje() {
  const { state, dispatch } = useGeneralContext();
  const [clase, setClase] = useState(200);
  const claseRef = useRef(null);
  const specRef = useRef(null);

  const handleChange = (event, ref) => {
    if (ref === claseRef) {
      setClase(ref.current.value);
      dispatch({
        type: ACCIONES.SELECCION_PERSONAJE,
        caso: "clase",
        valor: ref.current.value,
      });
      //generarSpec(ref.current.value);
    } else if (ref === specRef) {
      dispatch({
        type: ACCIONES.SELECCION_PERSONAJE,
        caso: "spec",
        valor: ref.current.value,
      });
    }
  };

  const generarSpec = () => {
    let options = [];
    const n = parseInt(clase);
    switch (n) {
      case 200:
        options = [
          { value: 2, label: "Malabarista" },
          { value: 1, label: "Sicario" },
        ];
        break;
      case 300:
        options = [
          { value: 1, label: "Control de Masas" },
          { value: 2, label: "Destruccion" },
        ];
        break;
      case 400:
        options = [
          { value: 1, label: "Maestro Arcano" },
          { value: 2, label: "Sanador" },
        ];
        break;
      default:
        options = [
          { value: 1, label: "Bersek" },
          { value: 2, label: "Proteccion" },
        ];
        break;
    }
    return options.map((option) => (
      <option
        className={`option-personaje `}
        key={option.value}
        value={option.value}
      >
        {option.label}
      </option>
    ));
  };
  const toggleAutomatico = () => {
    dispatch({ type: ACCIONES.AUTOMATICO });
  };
  useEffect(() => {
    generarSpec(clase);
  }, [clase]);
  return (
    <div className="div-bajo">
      <select
        ref={claseRef}
        onChange={(event) => handleChange(event, claseRef)}
        value={state.numeroClase}
        className={`select-personaje`}
      >
        <option className={`option-personaje`} value={200}>
          Rogue
        </option>
        <option className={`option-personaje`} value={100}>
          Warrior
        </option>
        <option className={`option-personaje`} value={300}>
          Warlock
        </option>
        <option className={`option-personaje`} value={400}>
          Mage
        </option>
      </select>
      <select
        ref={specRef}
        className={`select-personaje`}
        onChange={(event) => handleChange(event, specRef)}
      >
        {generarSpec()}
      </select>
      <button onClick={toggleAutomatico} className={`btn-100w`}>
        {state.automatico ? `Sin dados` : `Con dados`}
      </button>
      <div className={`div-casillero`}>Casillero: {state.casillero}</div>
      <p>
        Hemorragia: {state.efectosPorSec.hemo} x {state.efectosPorSec.tickHemo}
      </p>
      <p>
        Veneno: {state.efectosPorSec.veneno} x {state.efectosPorSec.tickVeneno}
      </p>
      <p>
        Reju: {state.efectosPorSec.reju} x {state.efectosPorSec.tickReju}
      </p>
      <p>HP Reg: {state.personaje.regeneracion}</p>
    </div>
  );
}
