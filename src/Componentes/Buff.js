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
  GiAlienBug,
  GiDisintegrate,
  GiAngelOutfit,
  GiBellShield,
} from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";
import { useEffect, useState } from "react";

export function Buff(params) {
  const { state, dispatch } = useGeneralContext();
  const [indexArma, setIndiceArma] = useState(0);
  const [indexArmadura, setIndiceArmadura] = useState(0);
  const [indexJoya, setIndiceJoya] = useState(0);
  const [blockEffect, setBlockEffect] = useState(false);

  const renderVariables = () => {
    const EPS = {
      DESCRIPCION: {
        CORRUPTOS: "CORRUPTOS",
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
        CAMPOFUERZA: "CAMPOFUERZA",
      },
      VARIABLE: {
        CLARI: state.efectosPorSec.clarividencia,
        REGEN: state.personaje.regeneracion,
        CONFUSION: state.confusion,
        HEMO: state.efectosPorSec.tickHemo,
        VENENO: state.efectosPorSec.tickVeneno,
        REJU: state.efectosPorSec.tickReju,
        PSICO: state.efectosPorSec.tickPsicosis,
        CHANCE_CLARI: state.efectosPorSec.chanceClari,
        RAGE: state.bonus.enfurecido,
        CUCHILLAS: state.bonus.danzaCuchillas,
        ESFUMARSE: state.bonus.esfumarse,
        BLINDADO: state.bonus.blindadoCargas,
        SUPERHEAL: state.bonus.superSanacion,
        CORRUPTOS: state.corruptos.length,
        CAMPOFUERZA: state.bonus.campoFuerza,
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
          P2: `x ${state.bonus.blindadoCargas}`,
        },
        SUPERHEAL: {
          //superheal
          ICONO: <GiAngelOutfit className="confusion-icon" />,
          P1: null,
          P2: "CritHeal",
        },
        CORRUPTOS: {
          ICONO: <GiDisintegrate className="confusion-icon" />,
          P1: null,
          P2: state.corruptos.length,
        },
        CAMPOFUERZA: {
          ICONO: <GiBellShield className="confusion-icon" />,
          P1: null,
          P2: null,
        },
      },
    };
    const nombresEPS = Object.keys(EPS.DESCRIPCION);
    const variablesEficiente = Array.from(nombresEPS, (nombreEPS) => ({
      icono: EPS.CONTENIDO[nombreEPS].ICONO,
      p1: EPS.CONTENIDO[nombreEPS].P1,
      p2: EPS.CONTENIDO[nombreEPS].P2,
      nombre: EPS.DESCRIPCION[nombreEPS],
      valor: EPS.VARIABLE[nombreEPS],
    }));

    return variablesEficiente
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
  const generateOptions = (tipo) => {
    const bolsa = [...state.equipo.bolsa[tipo]];
    if (bolsa.length === 0) {
      return <option></option>;
    }
    const options = bolsa.map((objeto) => (
      <option key={objeto.clave} value={objeto.indice}>
        {objeto.nombre}
      </option>
    ));
    return options;
  };
  const modificarEquipo = (event, tipo) => {
    const indice = event.target.value;
    switch (tipo) {
      case "arma":
        console.log(`Modifica ${tipo}, Nuevoindice =${indice}`);

        setIndiceArma(indice);
        break;
      case "armadura":
        console.log(`Modifica ${tipo}, Nuevoindice =${indice}`);

        setIndiceArmadura(indice);

        break;
      case "joya":
        console.log(`Modifica ${tipo}, Nuevoindice =${indice}`);

        setIndiceJoya(indice);
        break;
      default:
        break;
    }
  };

  const renderEquipo = (slot) => {
    const boolBolsaVacia = state.equipo?.bolsa[slot].length == 0 ? true : false;
    const indice =
      slot == "arma"
        ? indexArma
        : slot == "armadura"
        ? indexArmadura
        : slot == "joya"
        ? indexJoya
        : null;
    const objeto = state.equipo?.bolsa[slot][indice];
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
    if (!boolBolsaVacia) {
      const statsMayoresCero = arrayStats.filter(
        (stat) => objeto[stat] && objeto[stat] > 0
      );

      return (
        <div className="div-equipo-stats-efecto">
          <div className=" contenedor-stats-equipo">
            {statsMayoresCero.map((stat, index) => (
              <div key={`stat${index}`} className="div-stat-equipo">
                {`${stat}: ${objeto[stat]}`}
              </div>
            ))}
          </div>
          <div className={`div-efecto-equipo-adicional`}>
            {objeto[`efecto`] ? `Efecto: ${objeto[`efecto`]}` : ``}
          </div>
        </div>
      );
    } else {
      return (
        <div className="equipo-indefinido">AUN NO HAY ITEMS EN ESTE SLOT</div>
      );
    }
  };
  useEffect(() => {
    const bolsa = { ...state.equipo.bolsa };

    if (bolsa[`arma`].length == 1 && indexArma === null) {
      setIndiceArma(0);
    } else if (bolsa[`armadura`].length == 1 && indexArmadura === null) {
      setIndiceArmadura(0);
    } else if (bolsa[`joya`].length == 1 && indexJoya === null) {
      setIndiceJoya(0);
    } else {
      setBlockEffect(true);
    }
  }, [state.equipo.bolsa]);
  useEffect(() => {
    console.log(
      `Indices actuales: arma ${indexArma}, armadura:${indexArmadura}, joya:${indexJoya}`
    );
  }, [indexArma, indexArmadura, indexJoya]);
  return (
    <div className="div-bajo div-buff-main">
      <div className={`div-casillero`}>Casillero: {state.casillero}</div>{" "}
      <div className={`div-efectosps-general`}>{renderVariables()} </div>
      <div className="div-equipo-explicacion">
        <div className="div-equipo-slot ">
          <select
            onChange={(event) => modificarEquipo(event, "arma")}
            className={`select-equipo-descripcion ${
              state.equipo.bolsa.arma.length > 0
                ? `select-activo`
                : `select-vacio`
            }`}
          >
            {generateOptions("arma")}
          </select>
          {renderEquipo("arma")}
        </div>
        <div className="div-equipo-slot ">
          <select
            onChange={(event) => modificarEquipo(event, "armadura")}
            className={`select-equipo-descripcion ${
              state.equipo.bolsa.armadura.length > 0
                ? `select-activo`
                : `select-vacio`
            }`}
          >
            {generateOptions("armadura")}
          </select>
          {renderEquipo("armadura")}
        </div>
        <div className="div-equipo-slot ">
          <select
            onChange={(event) => modificarEquipo(event, "joya")}
            className={`select-equipo-descripcion ${
              state.equipo.bolsa.joya.length > 0
                ? `select-activo`
                : `select-vacio`
            }`}
          >
            {generateOptions("joya")}
          </select>
          {renderEquipo("joya")}
        </div>
      </div>
    </div>
  );
}
