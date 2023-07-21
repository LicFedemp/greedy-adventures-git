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
import { useEffect, useState } from "react";

export function Buff(params) {
  const { state, dispatch } = useGeneralContext();
  const [indexArma, setIndiceArma] = useState(null);
  const [indexArmadura, setIndiceArmadura] = useState(null);
  const [indexJoya, setIndiceJoya] = useState(null);
  const [blockEffect, setBlockEffect] = useState(false);

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
    if (typeof objeto !== "undefined" && indice !== null) {
      console.log(`El objeto del tipo ${slot} se llama asi ${objeto.nombre}`);

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
    console.log(`Bolsa en useeffect = ${bolsa[`arma`]}`);
    console.log(
      `Longituds = ${bolsa[`arma`].length},${bolsa[`armadura`].length},${
        bolsa[`joya`].length
      }`
    );

    if (bolsa[`arma`].length == 1 && indexArma === null) {
      setIndiceArma(0);
      console.log(`entra al efect arma y el indice es ${indexArma}`);
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
