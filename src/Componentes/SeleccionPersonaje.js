import { useGeneralContext } from "./Provider";
import { A } from "./Objetos/Acciones";
import { useRef, useState, useEffect } from "react";
import "../StyleSheets/SeleccionPersonaje.css";

export function SeleccionPersonaje() {
  const { state, dispatch } = useGeneralContext();
  const [clase, setClase] = useState(200);
  const [spec, setSpec] = useState(2);
  const claseRef = useRef(null);
  const specRef = useRef(null);

  const handleChange = (e, ref, setState) => {
    setState(ref.current.value);
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
      case 500:
        options = [
          { value: 1, label: "Pluma de Fenix" },
          // { value: 2, label: "Proteccion" },
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

  useEffect(() => {
    generarSpec();
  }, [clase]);
  useEffect(() => {
    dispatch({
      type: A.GRAL.SELECCION_PERSONAJE,
      clase,
      spec,
    });
  }, [clase, spec]);
  return (
    <div className="div-bajo div-seleccion-personaje">
      <select
        ref={claseRef}
        onChange={(event) => handleChange(event, claseRef, setClase)}
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
        <option className={`option-personaje`} value={500}>
          Paladin
        </option>
      </select>
      <select
        ref={specRef}
        className={`select-personaje`}
        onChange={(event) => handleChange(event, specRef, setSpec)}
      >
        {generarSpec()}
      </select>
      {/* <div className={`div-efectosps-general`}>{renderVariables()} </div> */}
    </div>
  );
}
