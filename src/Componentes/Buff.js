import { useGeneralContext } from "./Provider";
import { A } from "./Objetos/Acciones";
import "../StyleSheets/Buff.css";
import { BsFillDropletFill } from "react-icons/bs";
import {
  GiPoisonGas,
  GiHealing,
  GiSkullSlices,
  GiCrystalize,
} from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";

export function Buff(params) {
  const { state, dispatch } = useGeneralContext();

  const renderVariables = () => {
    const EPS = {
      VARIABLE: {
        HEMO: state.efectosPorSec.hemo,
        VENENO: state.efectosPorSec.veneno,
        REJU: state.efectosPorSec.reju,
        PSICO: state.efectosPorSec.psicosis,
        CLARI: state.efectosPorSec.clarividencia,
        REGEN: state.regeneracion,
        CONFUSION: state.confusion,
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
        CONFUSION: "CONFUSION",
      },
      CONTENIDO: {
        HEMO: {
          ICONO: <BsFillDropletFill className="reju-icon" />,
          P1: `-${state.efectosPorSec.hemo}hp`,
          P2: `${state.efectosPorSec.tickHemo}T`,
        },
        VENENO: {
          ICONO: <GiPoisonGas className="reju-icon" />,
          P1: `-${state.efectosPorSec.veneno}hp`,
          P2: `${state.efectosPorSec.tickVeneno}T`,
        },
        REJU: {
          ICONO: <GiHealing className="reju-icon" />,
          P1: `+${state.efectosPorSec.reju}hp`,
          P2: `${state.efectosPorSec.tickReju}T`,
        },
        PSICO: {
          ICONO: <GiSkullSlices className="reju-icon" />,
          P1: `-${state.efectosPorSec.psicosis}%`,
          P2: `${state.efectosPorSec.tickPsicosis}T`,
        },
        CLARI: {
          ICONO: <GiCrystalize className="reju-icon" />,
          P1: `${state.efectosPorSec.chanceClari}%`,
          P2: `+${state.efectosPorSec.clarividencia} Mana`,
        },
        REGEN: {
          ICONO: <GiHealing className="reju-icon" />,
          P1: `+${state.personaje.regeneracion}hp`,
          P2: `xT`,
        },
        CONFUSION: {
          ICONO: <FaQuestion />,
          P1: null,
          P2: null,
        },
      },
    };
    const variables = [
      {
        icono: EPS.CONTENIDO.HEMO.ICONO,
        p1: EPS.CONTENIDO.HEMO.P1,
        p2: EPS.CONTENIDO.HEMO.P2,
        nombre: EPS.DESCRIPCION.HEMO,
        valor: EPS.VARIABLE.THEMO,
      },
      {
        icono: EPS.CONTENIDO.VENENO.ICONO,
        p1: EPS.CONTENIDO.VENENO.P1,
        p2: EPS.CONTENIDO.VENENO.P2,
        nombre: EPS.DESCRIPCION.VENENO,
        valor: EPS.VARIABLE.TVENENO,
      },
      {
        icono: EPS.CONTENIDO.PSICO.ICONO,
        p1: EPS.CONTENIDO.PSICO.P1,
        p2: EPS.CONTENIDO.PSICO.P2,
        nombre: EPS.DESCRIPCION.PSICO,
        valor: EPS.VARIABLE.TPSICO,
      },
      {
        icono: EPS.CONTENIDO.CONFUSION.ICONO,
        p1: EPS.CONTENIDO.CONFUSION.P1,
        p2: EPS.CONTENIDO.CONFUSION.P2,
        nombre: EPS.DESCRIPCION.CONFUSION,
        valor: EPS.VARIABLE.CONFUSION,
      },
      {
        icono: EPS.CONTENIDO.REJU.ICONO,
        p1: EPS.CONTENIDO.REJU.P1,
        p2: EPS.CONTENIDO.REJU.P2,
        nombre: EPS.DESCRIPCION.REJU,
        valor: EPS.VARIABLE.TREJU,
      },
      {
        icono: EPS.CONTENIDO.REGEN.ICONO,
        p1: EPS.CONTENIDO.REGEN.P1,
        p2: EPS.CONTENIDO.REGEN.P2,
        nombre: EPS.DESCRIPCION.REGEN,
        valor: EPS.VARIABLE.REGEN,
      },
      {
        icono: EPS.CONTENIDO.CLARI.ICONO,
        p1: EPS.CONTENIDO.CLARI.P1,
        p2: EPS.CONTENIDO.CLARI.P2,
        nombre: EPS.DESCRIPCION.CLARI,
        valor: EPS.VARIABLE.CLARI,
      },
    ];

    return variables
      .filter((variable) => variable.valor > 0)
      .map((variable) => (
        <div
          key={variable.nombre}
          className={`div-efectops efecto-${variable.nombre} div-columna`}
        >
          <p className="p-efectos-superior">
            {variable.icono} {variable.p1}
          </p>
          <p className="p-efectos-inferior">{variable.p2}</p>
        </div>
      ));
  };

  return (
    <div className="div-bajo div-buff-main">
      <div className={`div-casillero`}>Casillero: {state.casillero}</div>{" "}
      <div className={`div-efectosps-general`}>{renderVariables()} </div>;
    </div>
  );
}
