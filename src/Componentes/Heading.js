import { useGeneralContext } from "./Provider";
import { ACCIONES, A } from "./Objetos/Acciones";
import { useRef, useState, useEffect } from "react";
import "../StyleSheets/Heading.css";
export function Heading() {
  const { state, dispatch } = useGeneralContext();
  const [vidaPrevia, setVidaPrevia] = useState(state.personaje.vidaMaxima);
  const [cambioVida, setCambioVida] = useState(0);
  const numDadoRef = useRef(null);
  const nivelDadoRef = useRef(null);

  const handleRoll = () => {
    if (state.personaje.energia > 0 && state.estadoTurno) {
      dispatch({ type: A.DADO.ROLL_ALL });
    }
  };

  const handleClick = (event, ref, variable) => {
    const { top, height } = ref.current.getBoundingClientRect();
    const y = event.clientY - top;
    if (y <= height / 2) {
      switch (ref) {
        case numDadoRef:
          if (state.dados.dadosTotales < state.numDadoMaximo) {
            dispatch({ type: A.DADO.NUM_DADO, valor: 1 });
          }
          break;
      }
    } else {
      switch (ref) {
        case numDadoRef:
          if (variable > 0) {
            dispatch({ type: A.DADO.NUM_DADO, valor: -1 });
          }
          break;
      }
    }
  };
  const handleNivelDado = () => {
    if (state.casillero < 20) {
      window.alert(`Todavía sos muy pequeñete para elegir`);
      return;
    }
    if (state.estadoTurno) {
      window.alert(`No puedes cambiar el dado durante tu turno`);
      return;
    }
    dispatch({ type: A.DADO.PODER_DADO });
  };

  const activarHabilidad = () => {
    const personaje = parseInt(state.numeroClase) + parseInt(state.numeroSpec);
    if (personaje == 101 || personaje == 102) {
      const totalRejuIra =
        state.personaje.ira * 0.1 * state.personaje.vidaMaxima;

      dispatch({
        type: A.BUFF.EFECTOS_PS,
        tipo: 3,
        valor: -totalRejuIra,
        ticks: 3,
      });
    }
    dispatch({ type: A.STATS.ACTIVAR_SKILL, personaje });
  };
  const recursoSecundario = (recurso) => {
    if (recurso == "secundario") {
      let recursoSec = null;
      const n = parseInt(state.numeroClase);
      switch (n) {
        case 100:
          recursoSec = state.personaje.iraMax;
          const recursoSecIra = Array.from(
            { length: recursoSec },
            (_, index) => (
              <p
                key={index}
                className={`div-ira ${
                  state.personaje.ira >= index + 1
                    ? `ira-activa`
                    : `estado-gris`
                }`}
                dado={`roll${index + 1}`}
              >
                {index + 1}
              </p>
            )
          );
          return (
            <div className="div-recurso-secundario">
              <p className="p-recursoSec">Ira</p> {recursoSecIra}
            </div>
          );

        //return <div><div className="div-ira"></div><p>Ira: {state.personaje.ira}</p>;</div>
        case 200:
          recursoSec = state.personaje.comboMax;
          const recursoSecCombo = Array.from(
            { length: recursoSec },
            (_, index) => (
              <p
                key={index}
                className={`div-ira ${
                  state.personaje.combo >= index + 1
                    ? `combo-activo`
                    : `estado-gris`
                }`}
                dado={`roll${index + 1}`}
              >
                {index + 1}
              </p>
            )
          );
          return (
            <div className="div-recurso-secundario">
              <p className="p-recursoSec">Combo</p> {recursoSecCombo}
            </div>
          );

        case 300:
        case 400:
          recursoSec = state.personaje.manaMax;
          const recursoSecMana = Array.from(
            { length: recursoSec },
            (_, index) => (
              <p
                key={index}
                className={`div-ira ${
                  state.personaje.mana >= index + 1
                    ? `mana-activa`
                    : `estado-gris`
                }`}
                dado={`roll${index + 1}`}
              >
                {index + 1}
              </p>
            )
          );
          return (
            <div className="div-recurso-secundario">
              <p className="p-recursoSec">Mana</p> {recursoSecMana}
            </div>
          );
        default:
          return <p>N/N</p>;
      }
    } else if (recurso == "energia") {
      const energiaMax = state.personaje.energiaMax;
      const recursoEnergia = Array.from({ length: energiaMax }, (_, index) => (
        <p
          key={index}
          className={`div-energia ${
            state.personaje.energia >= index + 1
              ? `energia-activa`
              : `estado-gris`
          }`}
          dado={`roll${index + 1}`}
        >
          {index + 1}
        </p>
      ));
      return (
        <div className="div-contenedor-energia">
          <p className="p-recursoSec">Energia</p> {recursoEnergia}
        </div>
      );
    }
  };
  const buttonStyles = {
    mago: {
      boxShadow: `0px 0px 10px ${
        state.personaje.mana * 2
      }px rgba(38, 202, 243,  ${0.685 + state.personaje.mana * 100})`,
    },
    brujo: {
      boxShadow: `0px 0px 10px ${
        state.personaje.mana * 2
      }px rgba(38, 202, 243,  ${0.685 + state.personaje.mana * 100})`,
    },
    rogue: {
      boxShadow: `0px 0px 10px 10px${
        state.personaje.combo * 2
      }px rgba(38, 202, 243,  ${0.685 + state.personaje.combo * 100})`,
    },
    warrior: {
      boxShadow: `0px 0px 10px ${state.personaje.ira * 2}px rgba(153, 0, 0,  ${
        0.685 + state.personaje.ira * 100
      })`,
    },
  };
  const activaMana = () => {
    const n = parseInt(state.numeroClase) + parseInt(state.numeroSpec);
    switch (n) {
      case 401:
        return (
          <button
            onClick={activarHabilidad}
            className={`btn-habilidad habilidad-mago`}
            style={{ boxShadow: `${buttonStyles.mago.boxShadow}` }}
          >
            {`Avanzas 
          ${Math.floor(
            state.personaje.mana +
              Math.floor(
                state.personaje.mana * (state.personaje.maleficio / 200)
              )
          )}
           casilleros`}
          </button>
        );
      case 402:
        return (
          <button
            onClick={activarHabilidad}
            className={`btn-habilidad habilidad-mago`}
            style={{ boxShadow: `${buttonStyles.mago.boxShadow}` }}
          >
            Te curas{" "}
            {Math.floor(state.personaje.mana * (state.personaje.curacion / 3))}{" "}
            de vida. Cada 10HP de overhealing +1 HP maximo.
          </button>
        );

      case 301:
        return (
          <button
            onClick={activarHabilidad}
            className={`btn-habilidad habilidad-brujo`}
            style={{ boxShadow: `${buttonStyles.brujo.boxShadow}` }}
          >
            Haz retroceder a todos los jugadores{" "}
            {Math.floor(
              state.personaje.mana / 2 +
                (state.personaje.mana / 2) *
                  Math.floor(state.personaje.maleficio / 100)
            )}{" "}
            casilleros.
          </button>
        );
      case 302:
        return (
          <button
            onClick={activarHabilidad}
            className={`btn-habilidad habilidad-brujo`}
            style={{ boxShadow: `${buttonStyles.brujo.boxShadow}` }}
          >
            Haz retroceder a cualquier jugador{" "}
            {Math.floor(
              state.personaje.mana / 2 +
                (state.personaje.mana / 2) *
                  Math.floor(state.personaje.maleficio / 50)
            )}{" "}
            casilleros.
          </button>
        );
      case 101:
      case 102:
        return (
          <button
            onClick={activarHabilidad}
            className={`btn-habilidad habilidad-warr`}
            style={{ boxShadow: `${buttonStyles.warrior.boxShadow}` }}
          >
            Consumes toda tu ira y regeneras{" "}
            {Math.floor(state.personaje.ira * 10)} % del maxHP en 3 turnos.
          </button>
        );
      case 201:
      case 202:
        return (
          <button
            onClick={activarHabilidad}
            className={`btn-habilidad habilidad-rogue`}
            style={{ boxShadow: `${buttonStyles.rogue.boxShadow}` }}
          >
            Consumes tus puntos de combo y recuperas{" "}
            {Math.floor(state.personaje.combo / 2)} punto
            {Math.floor(state.personaje.combo / 2) > 1 ? "s" : ""} de energia.
          </button>
        );
      default:
        return <p>Sin mana no hay habilidad</p>;
    }
  };
  const toggleTurno = () => {
    dispatch({ type: A.GRAL.TOGGLE_TURNO });
  };
  const updateLifeBar = () => {
    const lifeBar = document.querySelector(".life-bar-fill");
    lifeBar.style.width = `${state.porcentajeVida}%`;
    console.log(state.porcentajeVida);
  };

  const generateOptions = (tipo) => {
    switch (tipo) {
      case "arma":
        const bolsaArma = [...state.equipo.bolsa.arma];
        const optionsArma = bolsaArma.map((objeto) => (
          <option
            key={objeto.clave}
            value={objeto.clave}
            indice={objeto.indice}
          >
            {objeto.nombre}
          </option>
        ));
        return optionsArma;
      case "armadura":
        const bolsaArmadura = [...state.equipo.bolsa.armadura];
        const optionsArmadura = bolsaArmadura.map((objeto) => (
          <option
            key={objeto.clave}
            value={objeto.clave}
            indice={objeto.indice}
          >
            {objeto.nombre}
          </option>
        ));
        return optionsArmadura;
      case "joya":
        const bolsaJoya = [...state.equipo.bolsa.joya];
        const optionsJoya = bolsaJoya.map((objeto) => (
          <option
            key={objeto.clave}
            value={objeto.clave}
            indice={objeto.indice}
          >
            {objeto.nombre}
          </option>
        ));
        return optionsJoya;
      default:
        return <option>Aun no hay objetos</option>;
    }
  };

  const modificarEquipo = (event, tipo) => {
    let algunNegativo = false;
    for (let x = 1; x < 6; x++) {
      const dado = `roll${x}`;
      if (state[dado].estado == 3) {
        algunNegativo = true;
      }
    }

    if (state.personaje.energia == 0 || algunNegativo) return;
    const selectedOption = event.target.options[event.target.selectedIndex];
    const indice = selectedOption.getAttribute("indice");
    console.log("Valor del parámetro 'indice':", indice);
    dispatch({ type: A.STATS.MODIFICAR_EQUIPO, tipo, indice });
  };

  const pintarStats = (stat) => {
    if (
      (state.bonus.blindado &&
        state.numeroClase == 100 &&
        state.numeroSpec == 2 &&
        stat == "defensa") ||
      (state.bonus.esfumarse && state.numeroClase == 200 && stat == "esquivar")
    ) {
      return "stat-potenciado-extra";
    } else if (
      state.equipo.actual.arma[0]?.[stat] > 0 ||
      state.equipo.actual.armadura[0]?.[stat] > 0 ||
      state.equipo.actual.joya[0]?.[stat] > 0 ||
      (state.numeroClase == 100 &&
        state.numeroSpec == 1 &&
        state.personaje.ira > 0 &&
        stat == "ataque") ||
      (state.numeroClase == 100 &&
        state.numeroSpec == 2 &&
        state.personaje.ira > 0 &&
        stat == "defensa")
    ) {
      return "stat-potenciado";
    } else if (
      state.equipo.actual.arma[0]?.[stat] < 0 ||
      state.equipo.actual.armadura[0]?.[stat] < 0 ||
      state.equipo.actual.joya[0]?.[stat] < 0
    ) {
      return "stat-disminuido";
    } else if (
      state.equipo.actual.arma[0]?.[stat] == 0 ||
      state.equipo.actual.armadura[0]?.[stat] == 0 ||
      state.equipo.actual.joya[0]?.[stat] == 0
    ) {
      return "";
    }
  };
  useEffect(() => {
    updateLifeBar();
  }, [state.porcentajeVida]);
  useEffect(() => {
    setCambioVida(state.personaje.vida - vidaPrevia);
  }, [state.porcentajeVida]);

  setTimeout(() => {}, 1000);
  useEffect(() => {
    if (cambioVida != 0) {
      setTimeout(() => {
        setCambioVida(0);
        setVidaPrevia(state.personaje.vida);
      }, 900);
    }
  }, [cambioVida]);

  return (
    <div className=" div-center-main">
      <div className="div-seccion-izq">
        <div className="div-columna ">
          <button
            onClick={toggleTurno}
            className={state.estadoTurno ? `estado-amarillo` : `estado-gris`}
          >
            Turno
          </button>
          <button
            className={`btn-mod`}
            ref={nivelDadoRef}
            onClick={handleNivelDado}
          >
            {`D${state.poderDado}`}
          </button>
          <button onClick={handleRoll} className={`btn-roll`}>
            Roll
          </button>
        </div>

        <button
          className={`btn-largo`}
          ref={numDadoRef}
          onClick={(event) =>
            handleClick(event, numDadoRef, state.dados.dadosAdd)
          }
        >
          <p>#Dados</p>
          <p>
            {state.dados.dadosTotales > state.numDadoMaximo
              ? state.numDadoMaximo
              : state.dados.dadosTotales}
          </p>
        </button>
      </div>

      <div className={`div-columna div-stats-principal `}>
        <div
          className={`life-bar ${
            state.porcentajeVida <= 25 ? "life-bar-animation" : ""
          } ${
            state.efectosPorSec.tickVeneno > 0 ? "life-bar-poisonAnimation" : ""
          }`}
        >
          <p className={`p-life-bar `}>
            {" "}
            {state.personaje.vida}/{state.personaje.vidaMaxima}
          </p>
          <p
            className={`p-cambios-hp ${
              cambioVida == 0 ? `p-invisible ` : `p-visible `
            }${cambioVida < 0 ? ` p-visible-rojo` : ` p-visible-verde`} `}
          >
            {cambioVida > 0 ? `+` : ``}
            {cambioVida}
            {(cambioVida > 0 &&
              cambioVida >= state.personaje.vidaMaxima * 0.3) ||
            (cambioVida < 0 &&
              cambioVida * -1 >= state.personaje.vidaMaxima * 0.3)
              ? `!`
              : ``}
          </p>
          <div className="life-bar-fill"></div>
        </div>
        {recursoSecundario("secundario")}
        {recursoSecundario("energia")}
      </div>
      <div className={`div-columna`}>
        <div className={` div-stats-generales`}>
          <ul>
            <li className={pintarStats("ataque")}>
              Ataque: {state.personaje.ataque}
            </li>
            <li className={pintarStats("critico")}>
              %Critico: {state.personaje.critico}
            </li>
            <li className={pintarStats("maleficio")}>
              {`${
                state.numeroClase == 300 ? `P. maleficio` : `P. habilidad`
              }: ${state.personaje.maleficio}`}
            </li>
            <li className={pintarStats("vampirismo")}>
              %Vamp.: {state.personaje.vampirismo}
            </li>
          </ul>
          <ul>
            <li className={pintarStats("defensa")}>
              Defensa: {state.personaje.defensa}
            </li>
            <li className={pintarStats("esquivar")}>
              % Esquivar: {state.personaje.esquivar}
            </li>
            <li className={pintarStats("curacion")}>
              P. curacion: {state.personaje.curacion}
            </li>
            <li className={pintarStats("defensaMagica")}>
              Antiretroceso: {state.personaje.defensaMagica}
            </li>
          </ul>
        </div>
        <div className="div-habilidad">{activaMana()}</div>
      </div>
      <div className={`div-equipo div-columna`}>
        <select
          onChange={(event) => modificarEquipo(event, "arma")}
          className={`select-equipo`}
        >
          {generateOptions("arma")}
        </select>
        <select
          onChange={(event) => modificarEquipo(event, "armadura")}
          className={`select-equipo`}
        >
          {generateOptions("armadura")}
        </select>
        <select
          onChange={(event) => modificarEquipo(event, "joya")}
          className={`select-equipo`}
        >
          {generateOptions("joya")}
        </select>
      </div>
    </div>
  );
}
