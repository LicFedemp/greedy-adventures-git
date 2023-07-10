import { useGeneralContext } from "./Provider";
import { ACCIONES } from "./MainReducer";
import { useRef, useState, useEffect } from "react";
import "../StyleSheets/Heading.css";
export function Heading() {
  const { state, dispatch } = useGeneralContext();
  const [vidaPrevia, setVidaPrevia] = useState(state.personaje.vidaBase);
  const [cambioVida, setCambioVida] = useState(0);
  const numDadoRef = useRef(null);
  const nivelDadoRef = useRef(null);

  const handleRoll = () => {
    if (state.personaje.energia > 0 && state.estadoTurno) {
      dispatch({ type: ACCIONES.ROLL_ALL });
    }
  };

  const handleClick = (event, ref, variable) => {
    const { top, height } = ref.current.getBoundingClientRect();
    const y = event.clientY - top;
    if (y <= height / 2) {
      switch (ref) {
        case numDadoRef:
          if (variable < 5) {
            dispatch({ type: ACCIONES.NUM_DADO, valor: 1 });
          }
          break;
      }
    } else {
      switch (ref) {
        case numDadoRef:
          if (variable > 1) {
            dispatch({ type: ACCIONES.NUM_DADO, valor: -1 });
          }
          break;
      }
    }
  };
  const handleNivelDado = () => {
    dispatch({ type: ACCIONES.PODER_DADO });
  };

  const activarHabilidad = () => {
    const personaje = parseInt(state.numeroClase) + parseInt(state.numeroSpec);
    dispatch({ type: ACCIONES.ACTIVAR_SKILL, personaje });
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
        <div className="div-recurso-secundario">
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
            Avanzas{" "}
            {Math.floor(
              state.personaje.mana +
                state.personaje.mana * (state.personaje.maleficio / 200)
            )}{" "}
            casilleros
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
            {(state.personaje.mana / 2) *
              Math.floor(state.personaje.maleficio / 30)}{" "}
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
            Haz retroceder al jugador mas cercano{" "}
            {state.personaje.mana * Math.floor(state.personaje.maleficio / 30)}{" "}
            casilleros.
          </button>
        );

      default:
        return <p>Sin mana no hay habilidad</p>;
    }
  };
  const toggleTurno = () => {
    dispatch({ type: ACCIONES.TOGGLE_TURNO });
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
    const selectedOption = event.target.options[event.target.selectedIndex];
    const indice = selectedOption.getAttribute("indice");
    console.log("Valor del parámetro 'indice':", indice);
    dispatch({ type: ACCIONES.MODIFICAR_EQUIPO, tipo, indice });
  };

  const pintarStats = (stat) => {
    if (
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
      console.log(`entra al condiiconal 1,stat= ${stat}`);
      return "stat-potenciado";
    } else if (
      state.equipo.actual.arma[0]?.[stat] < 0 ||
      state.equipo.actual.armadura[0]?.[stat] < 0 ||
      state.equipo.actual.joya[0]?.[stat] < 0
    ) {
      console.log(`entra al condiiconal 2`);

      return "stat-disminuido";
    } else if (
      state.equipo.actual.arma[0]?.[stat] == 0 ||
      state.equipo.actual.armadura[0]?.[stat] == 0 ||
      state.equipo.actual.joya[0]?.[stat] == 0
    ) {
      console.log(`entra al condiiconal 3`);

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
    <div className="div-roll">
      <div className="div-columna">
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
        <button onClick={handleRoll} className={`btn-mod`}>
          Rollear
        </button>
      </div>

      <button
        className={`btn-largo`}
        ref={numDadoRef}
        onClick={(event) => handleClick(event, numDadoRef, state.numDado)}
      >
        <p>#Dados</p>
        <p>{state.numDado}</p>
      </button>
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
            {state.personaje.vida}/{state.personaje.vidaBase}
          </p>
          <p
            className={`p-cambios-hp ${
              cambioVida == 0 ? `p-invisible ` : `p-visible `
            }${cambioVida < 0 ? ` p-visible-rojo` : ` p-visible-verde`} `}
          >
            {cambioVida > 0 ? `+` : ``}
            {cambioVida}
            {(cambioVida > 0 && cambioVida >= state.personaje.vidaBase * 0.3) ||
            (cambioVida < 0 &&
              cambioVida * -1 >= state.personaje.vidaBase * 0.3)
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
        {activaMana()}
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
