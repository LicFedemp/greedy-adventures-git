import { ACCIONES, useGeneralReducer } from "./MainReducer";
import React, { useContext, useEffect, useState } from "react";

const generalContext = React.createContext();

export function useGeneralContext() {
  return useContext(generalContext);
}
export function ContextProvider({ children }) {
  const [state, dispatch] = useGeneralReducer();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
  }, [firstRender]);
  useEffect(() => {
    if (!firstRender) {
      const array = [];
      for (let i = 0; i < state.numDado; i++) {
        array.push(state[`roll${i + 1}`].numero);
      }

      let tempArray = [...array];
      let valorCoincidente = [];
      for (let i = 0; i < state.numDado; i++) {
        let coincidencias = 0;
        for (let j = 0; j < state.numDado; j++) {
          if (array[i] === tempArray[j]) {
            coincidencias++;

            tempArray[j] = null;
          }
        }
        if (coincidencias > 1) {
          for (let k = 1; k < coincidencias; k++) {
            valorCoincidente.push(array[i]);
          }
        }
      }
      console.log("El valor coincidente es: " + valorCoincidente);
      dispatch({ type: ACCIONES.ESPECIAL, arrayBase: array, valorCoincidente });
      dispatch({ type: ACCIONES.NEGATIVO });
    }
  }, [state.rollFlag]);

  useEffect(() => {
    dispatch({
      type: ACCIONES.SELECCION_PERSONAJE,
      caso: "personaje",
      valor: state.numeroClase + state.numeroSpec,
    });
  }, [state.numeroClase, state.numeroSpec]);
  useEffect(() => {
    dispatch({
      type: ACCIONES.PORCENTAJE_VIDA,
    });
  }, [state.personaje.vida, state.personaje.vidaBase]);

  useEffect(() => {
    if (state.personaje.energia > state.personaje.energiaMax) {
      dispatch({
        type: ACCIONES.STATS.EXCESO_ENERGIA,
        caso: "exceso",
        valor: parseInt(
          Math.floor((state.personaje.energia - state.personaje.energiaMax) / 2)
        ),
      });
    }
  }, [state.personaje.energia]);

  useEffect(() => {
    if (state.numeroClase == 100) {
      dispatch({ type: ACCIONES.IRA_DADOS });
    }
  }, [state.personaje.ira]);
  useEffect(() => {
    dispatch({ type: ACCIONES.PODER_DADO_CASILLERO });
  }, [state.casillero]);

  useEffect(() => {
    dispatch({ type: ACCIONES.CALCULAR_STATS });
  }, [
    state.personaje.ataqueBase,
    state.personaje.defensaBase,
    state.personaje.criticoBase,
    state.personaje.esquivarBase,
    state.personaje.curacionBase,
    state.personaje.maleficioBase,
    state.personaje.vampirismoBase,
    state.personaje.ira,
    state.personaje.combo,

    state.equipo.actual,
  ]);

  /*useEffect(() => {
    dispatch({ type: ACCIONES.CALCULAR_DEFENSA });
  }, [state.personaje.ira, state.personaje.defensaBase, state.equipo.actual]);

  useEffect(() => {
    if (state.numeroClase == 200 && state.numeroSpec == 2) {
      dispatch({ type: ACCIONES.CALCULAR_ESQUIVAR });
    }
    if (state.numeroClase == 200 && state.numeroSpec == 1) {
      dispatch({ type: ACCIONES.CALCULAR_CRITICO });
    }
  }, [state.personaje.combo, , state.equipo.actual]);*/

  return (
    <div className="div-columna">
      <generalContext.Provider value={{ state, dispatch }}>
        {children}
      </generalContext.Provider>
    </div>
  );
}
