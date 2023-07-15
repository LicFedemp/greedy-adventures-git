import { useGeneralContext } from "./Provider";
import { ACCIONES, A } from "./Objetos/Acciones";
import { useRef, useState, useEffect, useReducer } from "react";
import "../StyleSheets/Heading.css";
import "../StyleSheets/Desplegable.css";
import "../StyleSheets/Rolleo.css";

const estadoLocal = {
  casilleroMod: 0,
  vidaMod: 0,
  dpsMod: 1,
  ticks: 0,
  ataqueMult: 0.25,
  defensaEnemigo: 0,
  esquivarEnemigo: 0,
  psicosis: 5,
  ataque: false,
  ataqueResultado: [false, 0, 0],
};
const ACCIONES_LOCALES = {
  MODIFICAR_VARIABLES: "modificar-variables",
  CALCULAR_ATAQUE: "calcular-ataque",
};
const localReducer = (state, action) => {
  switch (action.type) {
    case ACCIONES_LOCALES.MODIFICAR_VARIABLES:
      return {
        ...state,
        [action.variable]: state[action.variable] + action.valor,
      };
    case ACCIONES_LOCALES.CALCULAR_ATAQUE:
      if (!state.ataque) {
        let resultadoArray = state.ataqueResultado;
        resultadoArray[0] =
          Math.floor(Math.random() * 100) + 1 <= action.critico ? true : false;
        const criticoMultiplicador = resultadoArray[0] ? 2 : 1;
        resultadoArray[1] =
          action.ataqueGlobal * state.ataqueMult * criticoMultiplicador;
        const vampirismoTotal = Math.floor(
          (resultadoArray[1] - state.defensaEnemigo) * (action.vampirismo / 100)
        );
        resultadoArray[2] = vampirismoTotal > 0 ? vampirismoTotal : 0;
        console.log(
          `Vampirismo = ${resultadoArray[2]}, primerCalculo= ${
            resultadoArray[1] - state.defensaEnemigo
          }, segundoCalculo = ${action.vampirismo / 100}`
        );
        return { ...state, ataqueResultado: resultadoArray, ataque: true };
      } else if (state.ataque) {
        return { ...state, ataque: false };
      }
    //index-variable: 0-critico, 1-ataque, 2-vampirismo
    default:
      return { ...state };
  }
};

export function Desplegable() {
  const [localState, localDispatch] = useReducer(localReducer, estadoLocal);
  const { state, dispatch } = useGeneralContext();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const casilleroModRef = useRef(null);
  const vidaModRef = useRef(null);
  const ataqueRef = useRef(null);
  const defensaRef = useRef(null);
  const psicosisRef = useRef(null);

  const intervalRef = useRef(null);
  const handleClick = (event, ref, variable) => {
    const { top, height } = ref.current.getBoundingClientRect();
    const y = event.clientY - top;
    let intervalId;
    setIsMouseDown(true);

    if (y <= height / 2) {
      switch (ref) {
        case casilleroModRef:
        case psicosisRef:
          localDispatch({
            type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
            variable,
            valor: 1,
          });

          intervalRef.current = setInterval(() => {
            localDispatch({
              type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
              variable,
              valor: 1,
            });
          }, 200);

          break;
        case vidaModRef:
        case defensaRef:
          localDispatch({
            type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
            variable,
            valor: 1,
          });

          intervalRef.current = setInterval(() => {
            localDispatch({
              type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
              variable,
              valor: 1,
            });
          }, 50);

          break;
        case ataqueRef:
          localDispatch({
            type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
            variable,
            valor: 0.25,
          });

          intervalRef.current = setInterval(() => {
            localDispatch({
              type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
              variable,
              valor: 0.25,
            });
          }, 200);
      }
    } else {
      switch (ref) {
        case casilleroModRef:
        case psicosisRef:
          if (ref == psicosisRef && localState.psicosis < 6) return;
          localDispatch({
            type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
            variable,
            valor: -1,
          });

          intervalRef.current = setInterval(() => {
            localDispatch({
              type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
              variable,
              valor: -1,
            });
          }, 200);

          break;
        case vidaModRef:
        case defensaRef:
          localDispatch({
            type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
            variable,
            valor: -1,
          });

          intervalRef.current = setInterval(() => {
            localDispatch({
              type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
              variable,
              valor: -1,
            });
          }, 50);

          break;
        case ataqueRef:
          if (localState.ataqueMult > 0) {
            localDispatch({
              type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
              variable,
              valor: -0.25,
            });
            intervalRef.current = setInterval(() => {
              localDispatch({
                type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
                variable,
                valor: -0.25,
              });
            }, 200);
          }
      }
    }
  };
  const handleMouseUp = () => {
    setIsMouseDown(false);
    clearInterval(intervalRef.current);

    // Limpia el temporizador si aún está activo
    if (typeof isMouseDown === "number") {
      clearInterval(intervalRef.current);
    }
  };
  const atacar = () => {
    localDispatch({
      type: ACCIONES_LOCALES.CALCULAR_ATAQUE,
      critico: state.personaje.critico,
      ataqueGlobal: state.personaje.ataque,
      vampirismo: state.personaje.vampirismo,
    });
  };
  const vampirismoClick = () => {
    dispatch({
      type: ACCIONES.STATS.MOD_VIDA,
      valor: -localState.ataqueResultado[2],
    });
  };
  const botonVampirismo = () => {
    if (localState.ataqueResultado[2] > 0) {
      return (
        <button
          onClick={vampirismoClick}
        >{`Vampireas ${localState.ataqueResultado[2]} puntos de vida`}</button>
      );
    }
  };

  const changeEffect = (modo) => {
    switch (modo) {
      case "click":
        localDispatch({
          type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
          variable: "dpsMod",
          valor: localState.dpsMod < 3 ? 1 : -2,
        });
        if (localState.dpsMod == 2) {
          localDispatch({
            type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
            variable: "vidaMod",
            valor: -(localState.vidaMod + 5),
          });
        } else if (localState.dpsMod == 3 && localState.vidaMod < 0) {
          localDispatch({
            type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
            variable: "vidaMod",
            valor: localState.vidaMod * -1 + 5,
          });
        }
        break;
      case "descripcion":
        switch (parseInt(localState.dpsMod)) {
          case 1:
            return "Hemorragia";
          case 2:
            return "Veneno";
          case 3:
            return "Rejuvenecimiento";
        }
        break;
      default:
        break;
    }
  };
  const toggleDesplegable = () => {
    dispatch({ type: ACCIONES.DESPLEGABLE });
  };
  const toggleMod = (direccion, modo) => {
    const modosArray = ["Recibir", "DPS", "Ataque", "Psicosis", "Casillero"];
    if (modo == "descripcion") {
      if (direccion == "der") {
        switch (parseInt(state.modDesplegable)) {
          case 1:
            return modosArray[0];
          case 2:
            return modosArray[1];
          case 3:
            return modosArray[2];
          case 4:
            return modosArray[3];
          case 5:
            return modosArray[4];
          default:
            break;
        }
      } else if (direccion == "izq") {
        switch (parseInt(state.modDesplegable)) {
          case 1:
            return modosArray[3];
          case 2:
            return modosArray[4];
          case 3:
            return modosArray[0];
          case 4:
            return modosArray[1];
          case 5:
            return modosArray[2];
          default:
            break;
        }
      }
    } else {
      dispatch({ type: ACCIONES.MOD_DESPLEGABLE, direccion });
    }
    //setMod(!mod);
  };
  const TIPO_DESPLEGABLE = {
    CASILLERO_VIDA: "casillero",
    VIDA: "vida",
    DPS: "dps",
    PSICOSIS: "psicosis",
  };

  const activarDesplegable = (tipo, variable) => {
    switch (tipo) {
      case TIPO_DESPLEGABLE.CASILLERO_VIDA:
        dispatch({
          type:
            variable == "casilleroMod"
              ? ACCIONES.MOD_CASILLERO
              : ACCIONES.STATS.MOD_VIDA,
          valor: localState[variable],
        });
        localDispatch({
          type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
          variable,
          valor: -localState.casilleroMod,
        });

        break;
      case TIPO_DESPLEGABLE.VIDA:
        break;
      case TIPO_DESPLEGABLE.DPS:
        break;
      case TIPO_DESPLEGABLE.PSICOSIS:
        dispatch({
          type: ACCIONES.PSICOSIS,
          fase: "carga",
          poder: localState.psicosis,
        });
        break;
      default:
        break;
    }
  };

  const activarDPS = () => {
    dispatch({
      type: ACCIONES.EFECTOS_PS,
      tipo: localState.dpsMod,
      valor: localState.vidaMod,
      ticks: localState.ticks,
    });
    for (let x = 0; x < 2; x++) {
      const variable = x == 0 ? "vidaMod" : "ticks";
      localDispatch({
        type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
        variable,
        valor: -localState[variable],
      });
    }
  };

  const changeBackground = (target) => {
    const estado = parseInt(state.modDesplegable);
    if (target == "div") {
      switch (estado) {
        case 1:
          if (localState.casilleroMod < 0) {
            return "estado-violeta";
          } else {
            return "estado-rojo";
          }
        case 2:
          if (localState.vidaMod < 0) {
            return "estado-celeste";
          } else {
            return "estado-violeta";
          }
        case 3:
          if (localState.dpsMod == 1) {
            return "estado-rojo";
          } else if (localState.dpsMod == 2) {
            return "estado-verde";
          } else {
            return "estado-celeste";
          }
        case 4:
          return "estado-rojo";
        case 5:
          return "estado-violeta";

        default:
          return "estado-gris";
      }
    } else if (target == "button") {
      switch (estado) {
        case 1:
          if (localState.casilleroMod < 0) {
            return "estado-violeta-shadow";
          } else {
            return "estado-rojo-shadow";
          }
        case 2:
          if (localState.vidaMod < 0) {
            return "estado-celeste-shadow";
          } else {
            return "estado-violeta-shadow";
          }
        case 3:
          if (localState.dpsMod == 1) {
            return "estado-rojo-shadow";
          } else if (localState.dpsMod == 2) {
            return "estado-verde-shadow";
          } else {
            return "estado-celeste-shadow";
          }
        case 4:
          return "estado-rojo-shadow";
        case 5:
          return "estado-violeta-shadow";

        default:
          return "estado-gris-shadow";
      }
    }
  };
  const handleTicks = (accion) => {
    console.log(`Entra a la funcion de ticks, ticks=${localState.ticks}`);
    // setTicks(accion == "-" && ticks > 0 ? ticks - 1 : ticks + 1);
    localDispatch({
      type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
      variable: "ticks",
      valor: accion == "-" ? (localState.ticks > 0 ? -1 : 0) : 1,
    });
  };
  const handleAtaqueDefensa = (accion) => {
    const valor = localState.dpsMod == 1 ? 1 : -1;

    localDispatch({
      type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
      variable: "dpsMod",
      valor,
    });
  };
  const changeAtaqueDefensa = (tipo) => {
    switch (tipo) {
      case "botonCentral":
        switch (localState.ataque) {
          case false:
            if (localState.dpsMod == 1) {
              return (
                <button
                  ref={ataqueRef}
                  //onClick={(event) => handleClick(event, ataqueRef, ataqueMult)}
                  onMouseDown={(event) =>
                    handleClick(event, ataqueRef, "ataqueMult")
                  }
                  onMouseUp={handleMouseUp}
                  className={`btn-mod-desplegable ${changeBackground(
                    "button"
                  )}`}
                >
                  <p className={`p-titulo-importante`}>Dano Base:</p>
                  <p>ataque X</p>
                  <p className={`p-valor-importante`}>
                    {localState.ataqueMult}
                  </p>
                </button>
              );
            } else if (localState.dpsMod == 2) {
              return (
                <button
                  ref={defensaRef}
                  onMouseUp={handleMouseUp}
                  onMouseDown={(event) =>
                    handleClick(event, defensaRef, "defensaEnemigo")
                  }
                  className={`btn-mod-desplegable ${changeBackground(
                    "button"
                  )}`}
                >
                  <p className={`p-titulo-importante`}>Defensa enemigo:</p>
                  <p className={`p-titulo-importante`}>
                    {localState.defensaEnemigo}
                  </p>
                </button>
              );
            }
          case true:
            return (
              //Describir ataque.
              <div className={`div-columna div-stats div-calculo-ataque `}>
                <p
                  style={{
                    maxWidth: `140px`,
                    textAlign: "center",
                    fontSize: "18px",
                  }}
                >
                  {`Has infligido ${
                    localState.ataqueResultado[1]
                  } puntos de daño ${
                    localState.ataqueResultado[0] ? "con un ataque critico" : ""
                  }
              `}
                </p>
                {botonVampirismo()}
              </div>
            );
        }
      case "botonInferior":
        switch (localState.ataque) {
          case false:
            return "Atacar";
          case true:
            return "Calcular";
        }
      default:
        break;
    }
  };

  useEffect(() => {
    if (localState.vidaMod < 0) {
      localDispatch({
        type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
        variable: "dpsMod",
        valor: 3 - localState.dpsMod,
      });
    } else if (localState.vidaMod > 0 && localState.dpsMod == 3) {
      localDispatch({
        type: ACCIONES_LOCALES.MODIFICAR_VARIABLES,
        variable: "dpsMod",
        valor: -2,
      });
    }
  }, [localState.vidaMod]);
  const buttonMods = () => {
    const modDesplegable = parseInt(state.modDesplegable);
    switch (modDesplegable) {
      case 1:
        return (
          <div className={`div-columna div-stats`}>
            <button
              ref={casilleroModRef}
              onMouseUp={handleMouseUp}
              onMouseDown={(event) =>
                handleClick(event, casilleroModRef, "casilleroMod")
              }
              className={`btn-mod-desplegable ${changeBackground("button")}`}
            >{`${localState.casilleroMod >= 0 ? "Avanzo" : "Retrocedo"} ${
              localState.casilleroMod < 0
                ? localState.casilleroMod * -1
                : localState.casilleroMod
            } casilleros`}</button>
            <button
              className={`${changeBackground("button")}`}
              onClick={() =>
                activarDesplegable(
                  TIPO_DESPLEGABLE.CASILLERO_VIDA,
                  "casilleroMod"
                )
              }
            >
              Mover!
            </button>
          </div>
        );
      case 2:
        return (
          <div className={`div-columna div-stats`}>
            <button
              ref={vidaModRef}
              onMouseUp={handleMouseUp}
              onMouseDown={(event) => handleClick(event, vidaModRef, "vidaMod")}
              className={`btn-mod-desplegable ${changeBackground("button")}`}
            >{`${localState.vidaMod >= 0 ? "Recibo" : "Te curas"} ${
              localState.vidaMod < 0
                ? localState.vidaMod * -1
                : localState.vidaMod
            } ${
              localState.vidaMod >= 0 ? "puntos de daño" : "de vida"
            }`}</button>
            <button
              className={`btn-dpsMod ${changeBackground("button")}`}
              onClick={() =>
                activarDesplegable(TIPO_DESPLEGABLE.CASILLERO_VIDA, "vidaMod")
              }
            >
              Ok
            </button>
          </div>
        );
      case 3:
        return (
          <div className={`div-columna div-stats`}>
            <button
              className={`${changeBackground("button")} btn-dpsMod`}
              onClick={() => changeEffect("click")}
            >
              {changeEffect("descripcion")}
            </button>

            <button
              ref={vidaModRef}
              onMouseUp={handleMouseUp}
              onMouseDown={(event) => handleClick(event, vidaModRef, "vidaMod")}
              className={`btn-mod-desplegable ${changeBackground("button")}`}
            >{`${localState.vidaMod >= 0 ? "Recibo" : "Te curas"} ${
              localState.vidaMod < 0
                ? localState.vidaMod * -1
                : localState.vidaMod
            } ${
              localState.vidaMod >= 0 ? "puntos de daño" : "de vida"
            }`}</button>
            <div className={`div-ticks  `}>
              <p className={`p-ticks`}>Ticks</p>
              <button
                onClick={() => handleTicks("-")}
                className={`${changeBackground("button")} btn-ticks`}
              >
                -
              </button>
              {localState.ticks}
              <button
                onClick={() => handleTicks("+")}
                className={`${changeBackground("button")} btn-ticks`}
              >
                +
              </button>
            </div>
            <button
              className={`${changeBackground("button")} btn-dpsMod`}
              onClick={activarDPS}
            >
              Ok
            </button>
          </div>
        );
      case 4:
        return (
          <div className={`div-columna div-stats`}>
            <div className={`div-ticks div-ataque  `}>
              <p className={`p-ticks-ataque`}>Variables</p>
              <button
                onClick={() => handleAtaqueDefensa("-")}
                className={`${changeBackground("button")} btn-ticks`}
              >
                Prev
              </button>
              <button
                onClick={() => handleAtaqueDefensa("+")}
                className={`${changeBackground("button")} btn-ticks`}
              >
                Next
              </button>
            </div>
            {changeAtaqueDefensa("botonCentral")}
            <button
              className={`btn-dpsMod ${changeBackground("button")}`}
              onClick={atacar}
            >
              {changeAtaqueDefensa("botonInferior")}
            </button>
          </div>
        );
      case 5:
        //psicosis
        return (
          <div className={`div-columna div-stats`}>
            <button
              ref={psicosisRef}
              onMouseUp={handleMouseUp}
              onMouseDown={(event) =>
                handleClick(event, psicosisRef, "psicosis")
              }
              className={`btn-mod-desplegable ${changeBackground("button")}`}
            >{`Poder de Psicosis = ${localState.psicosis}%`}</button>
            <button
              className={`${changeBackground("button")}`}
              onClick={() => activarDesplegable(TIPO_DESPLEGABLE.PSICOSIS)}
            >
              Sufre!
            </button>
          </div>
        );

      default:
        return;
    }
  };

  return (
    <div className={`desplegable-derecha `}>
      <button
        className={
          state.mostrarDesplegable
            ? `desplegable-toggle-open `
            : `desplegable-toggle `
        }
        onClick={toggleDesplegable}
      ></button>
      {state.mostrarDesplegable && (
        <div
          className={`desplegable-contenido div-columna ${changeBackground(
            "div"
          )}`}
        >
          {buttonMods()}
          <div className="div-desplegable-margen-inferior">
            {" "}
            <button
              className={`btn-toggleMod btn-izq ${changeBackground("button")}`}
              onClick={() => toggleMod("izq")}
            >
              {toggleMod("izq", "descripcion")}
            </button>
            <button
              className={`btn-toggleMod btn-der ${changeBackground("button")}`}
              onClick={() => toggleMod("der")}
            >
              {toggleMod("der", "descripcion")}{" "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
