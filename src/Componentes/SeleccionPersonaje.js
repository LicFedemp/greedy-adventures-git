import { useGeneralContext } from "./Provider";
import { ACCIONES } from "./MainReducer";
import { useRef, useState, useEffect } from "react";
import "../StyleSheets/SeleccionPersonaje.css";
import { BsFillDropletFill } from "react-icons/bs";

export function SeleccionPersonaje() {
  const { state, dispatch } = useGeneralContext();
  const [clase, setClase] = useState(200);
  const claseRef = useRef(null);
  const specRef = useRef(null);
  const EPS = {
    VARIABLE: {
      HEMO: state.efectosPorSec.hemo,
      VENENO: state.efectosPorSec.veneno,
      REJU: state.efectosPorSec.reju,
      PSICO: state.efectosPorSec.psicosis,
      CLARI: state.efectosPorSec.clarividencia,
      REGEN: state.regeneracion,
      THEMO: state.efectosPorSec.tickHemo,
      TVENENO: state.efectosPorSec.tickVeneno,
      TREJU: state.efectosPorSec.tickReju,
      TPSICO: state.efectosPorSec.tickPsicosis,
      CHANCE_CLARI: state.efectosPorSec.chanceClari,
    },
    DESCRIPCION: {
      HEMO: "HEMO",
      VENENO: "VENENO",
      REJU: "REJU",
      PSICO: "PSICO",
      CLARI: "CLARI",
      REGEN: "REGEN",
    },
  };

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
  const descripcionEfectosPS = (efecto) => {
    switch (efecto) {
      case EPS.DESCRIPCION.HEMO:
        return (
          <p>
            <BsFillDropletFill /> {state.efectosPorSec.hemo} x{" "}
            {state.efectosPorSec.tickHemo}
          </p>
        );
      case EPS.DESCRIPCION.VENENO:
        return (
          <p>
            V: {state.efectosPorSec.veneno} x {state.efectosPorSec.tickVeneno}
          </p>
        );

      case EPS.DESCRIPCION.PSICO:
        return (
          <p>
            P: -{state.efectosPorSec.psicosis}% MaxHP x{" "}
            {state.efectosPorSec.tickPsicosis}T
          </p>
        );
      case EPS.DESCRIPCION.REJU:
        return (
          <p>
            R: {state.efectosPorSec.reju} x {state.efectosPorSec.tickReju}
          </p>
        );

      case EPS.DESCRIPCION.REGEN:
        return <p>HPReg: {state.personaje.regeneracion}</p>;

      case EPS.DESCRIPCION.CLARI:
        return (
          <p>
            C: {state.efectosPorSec.chanceClari}% /{" "}
            {state.efectosPorSec.clarividencia}pMana
          </p>
        );

      default:
        break;
    }
  };
  const renderVariables = () => {
    const variables = [
      { nombre: EPS.DESCRIPCION.HEMO, valor: EPS.VARIABLE.THEMO },
      { nombre: EPS.DESCRIPCION.VENENO, valor: EPS.VARIABLE.TVENENO },
      { nombre: EPS.DESCRIPCION.PSICO, valor: EPS.VARIABLE.TPSICO },
      { nombre: EPS.DESCRIPCION.REJU, valor: EPS.VARIABLE.TREJU },
      { nombre: EPS.DESCRIPCION.REGEN, valor: EPS.VARIABLE.REGEN },
      { nombre: EPS.DESCRIPCION.CLARI, valor: EPS.VARIABLE.CLARI },
    ];

    return variables
      .filter((variable) => variable.valor > 0)
      .map((variable) => (
        <p
          key={variable.nombre}
          className={`p-efectops efecto-${variable.nombre}`}
        >
          {descripcionEfectosPS(variable.nombre)}
        </p>
      ));
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
      <div className={`div-efectosps`}>{renderVariables()} </div>
    </div>
  );
}
