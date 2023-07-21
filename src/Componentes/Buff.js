import { useGeneralContext } from "./Provider";
import { arrayEquipo } from "./Objetos/Equipo";
import { A } from "./Objetos/Acciones";
import "../StyleSheets/Buff.css";
import { BsFillDropletFill } from "react-icons/bs";
import {
  GiPoisonGas,
  GiHealing,
  GiSkullSlices,
  GiCrystalize,
  GiEnrage,
  GiKitchenKnives,
  GiLayeredArmor,
  GiInvisible,
  GiLeafSwirl,
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
        REGEN: state.personaje.regeneracion,
        CONFUSION: state.confusion,
        THEMO: state.efectosPorSec.tickHemo,
        TVENENO: state.efectosPorSec.tickVeneno,
        TREJU: state.efectosPorSec.tickReju,
        TPSICO: state.efectosPorSec.tickPsicosis,
        CHANCE_CLARI: state.efectosPorSec.chanceClari,
        RAGE: state.bonus.enfurecido,
        CUCHILLAS: state.bonus.danzaCuchillas,
        ESFUMARSE: state.bonus.esfumarse,
        BLINDADO: state.bonus.blindado,
        SUPERHEAL: state.bonus.superSanacion,
      },
      DESCRIPCION: {
        HEMO: "HEMO",
        VENENO: "VENENO",
        REJU: "REJU",
        PSICO: "PSICO",
        CLARI: "CLARI",
        REGEN: "REGEN",
        CONFUSION: "CONFUSION",
        RAGE: "RAGE",
        CUCHILLAS: "CUCHILLAS",
        ESFUMARSE: "ESFUMARSE",
        BLINDADO: "BLINDADO",
        SUPERHEAL: "SUPERHEAL",
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
          ICONO: <FaQuestion className="confusion-icon" />,
          P1: null,
          P2: "Confundido",
        },
        RAGE: {
          //rage
          ICONO: <GiEnrage className="confusion-icon" />,
          P1: null,
          P2: `Enfurecido`,
        },
        CUCHILLAS: {
          //danzade cuchillas
          ICONO: <GiKitchenKnives className="confusion-icon" />,
          P1: null,
          P2: "Cuchillas",
        },
        ESFUMARSE: {
          //esfumarse
          ICONO: <GiInvisible className="confusion-icon" />,
          P1: null,
          P2: "+30% esq",
        },
        BLINDADO: {
          //blindado
          ICONO: <GiLayeredArmor className="confusion-icon" />,
          P1: null,
          P2: "Blindado",
        },
        SUPERHEAL: {
          //superheal
          ICONO: <GiLeafSwirl className="confusion-icon" />,
          P1: null,
          P2: "CritHeal",
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
      {
        icono: EPS.CONTENIDO.RAGE.ICONO,
        p1: EPS.CONTENIDO.RAGE.P1,
        p2: EPS.CONTENIDO.RAGE.P2,
        nombre: EPS.DESCRIPCION.RAGE,
        valor: EPS.VARIABLE.RAGE,
      },
      {
        icono: EPS.CONTENIDO.CUCHILLAS.ICONO,
        p1: EPS.CONTENIDO.CUCHILLAS.P1,
        p2: EPS.CONTENIDO.CUCHILLAS.P2,
        nombre: EPS.DESCRIPCION.CUCHILLAS,
        valor: EPS.VARIABLE.CUCHILLAS,
      },
      {
        icono: EPS.CONTENIDO.ESFUMARSE.ICONO,
        p1: EPS.CONTENIDO.ESFUMARSE.P1,
        p2: EPS.CONTENIDO.ESFUMARSE.P2,
        nombre: EPS.DESCRIPCION.ESFUMARSE,
        valor: EPS.VARIABLE.ESFUMARSE,
      },
      {
        icono: EPS.CONTENIDO.BLINDADO.ICONO,
        p1: EPS.CONTENIDO.BLINDADO.P1,
        p2: EPS.CONTENIDO.BLINDADO.P2,
        nombre: EPS.DESCRIPCION.BLINDADO,
        valor: EPS.VARIABLE.BLINDADO,
      },
      {
        icono: EPS.CONTENIDO.SUPERHEAL.ICONO,
        p1: EPS.CONTENIDO.SUPERHEAL.P1,
        p2: EPS.CONTENIDO.SUPERHEAL.P2,
        nombre: EPS.DESCRIPCION.SUPERHEAL,
        valor: EPS.VARIABLE.SUPERHEAL,
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
  const renderEfectoItem = () => {
    console.log();
    const arrayEquipoActual = [
      state.equipo.actual?.arma[0],
      state.equipo.actual?.armadura[0],
      state.equipo.actual?.joya[0],
    ];
    return arrayEquipoActual.map((equipo, index) => {
      if (equipo?.efecto) {
        return (
          <div className="div-individual-equipo-efecto" key={index}>
            <p>
              {equipo.nombre}:{equipo.efecto}
            </p>
          </div>
        );
      } else {
        return null;
      }
    });
  };
  const renderEquipo = (slot) => {
    const objeto = state.equipo?.actual[slot][0];
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
    if (typeof objeto !== "undefined") {
      const statsMayoresCero = arrayStats.filter(
        (stat) => objeto[stat] && objeto[stat] > 0
      );

      return (
        <div>
          <div className="equipo-nombre">{objeto.nombre}</div>
          <div className=" contenedor-stats-equipo">
            {statsMayoresCero.map((stat, index) => (
              <div key={`stat${index}`} className="div-stat-equipo">
                {`${stat}: ${objeto[stat]}`}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="equipo-indefinido">AUN NO HAY ITEMS EN ESTE SLOT</div>
      );
    }
  };

  return (
    <div className="div-bajo div-buff-main">
      <div className={`div-casillero`}>Casillero: {state.casillero}</div>{" "}
      <div className={`div-efectosps-general`}>{renderVariables()} </div>
      <div className="div-equipo-explicacion">
        <div className="div-equipo-slot ">{renderEquipo("arma")}</div>
        <div className="div-equipo-slot ">{renderEquipo("armadura")}</div>
        <div className="div-equipo-slot ">{renderEquipo("joya")}</div>
      </div>
    </div>
  );
}
