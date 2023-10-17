import { useGeneralReducer } from "./MainReducer";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ACCIONES, A } from "./Objetos/Acciones";
const generalContext = React.createContext();

export function useGeneralContext() {
  return useContext(generalContext);
}
export function ContextProvider({ children }) {
  const [state, dispatch] = useGeneralReducer();
  const [firstRender, setFirstRender] = useState(true);
  const prevCasillero = useRef(state.casillero);
  const prevVida = useRef(state.personaje.vidaBase);
  const prevDados = useRef(state.dados.dadosTotales);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      dispatch({ type: A.DADO.HANDLE_NUMERO_DADOS });
    }
  }, [firstRender]);

  useEffect(() => {
    dispatch({ type: A.DADO.HANDLE_NUMERO_DADOS, tipo: "normal" });
  }, [
    state.dados.dadosBase,
    state.dados.dadoIra,
    state.dados.dadosAdd,
    state.dados.dadosTemporales,
    state.dados.dadosPermanentes,
  ]);

  useEffect(() => {
    if (!firstRender) {
      const array = [];
      for (let i = 0; i < state.dados.dadosTotales; i++) {
        array.push(state[`roll${i + 1}`].numero);
      }

      let tempArray = [...array];
      let valorCoincidente = [];
      for (let i = 0; i < state.dados.dadosTotales; i++) {
        let coincidencias = 0;
        for (let j = 0; j < state.dados.dadosTotales; j++) {
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
      dispatch({ type: A.DADO.ESPECIAL, arrayBase: array, valorCoincidente });
      dispatch({ type: A.DADO.NEGATIVO });
    }
  }, [state.rollFlag]);

  useEffect(() => {
    dispatch({
      type: A.GRAL.SELECCION_PERSONAJE,
      caso: "personaje",
      valor: state.numeroClase + state.numeroSpec,
    });
  }, [state.numeroClase, state.numeroSpec, state.muerteContador]);

  useEffect(() => {
    if (state.personaje.vida <= 0 || state.corruptosContador >= 19) {
      dispatch({ type: A.STATS.MUERTE });
    }
  }, [state.personaje.vida, state.corruptosContador]);

  useEffect(() => {
    if (state.personaje.energia > state.personaje.energiaMax) {
      dispatch({
        type: A.STATS.EXCESO_ENERGIA,
        caso: "exceso",
        valor: parseInt(
          Math.floor((state.personaje.energia - state.personaje.energiaMax) / 2)
        ),
      });
    }
  }, [state.personaje.energia]);

  useEffect(() => {
    if (state.numeroClase == 100) {
      dispatch({ type: A.STATS.IRA_DADOS });
    }
  }, [state.personaje.ira]);
  useEffect(() => {
    dispatch({ type: A.DADO.HANDLE_NUMERO_DADOS });
  }, [
    state.dados.dadoIra,
    state.dados.dadosAdd,
    state.dados.dadosTemporales,
    state.dados.dadosPermanentes,
    state.casillero,
  ]);
  useEffect(() => {
    dispatch({ type: A.STATS.CALCULAR_STATS });
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
    state.personaje.vidaMaximaBonus,
    state.personaje.regeneracionBonus,
    state.personaje.energiaBonus,
    state.personaje.reservaEnergiaBonus,
    state.personaje.ataqueBonus,
    state.personaje.defensaBonus,
    state.personaje.defensaMagicaBonus,
    state.personaje.criticoBonus,
    state.personaje.esquivarBonus,
    state.personaje.curacionBonus,
    state.personaje.maleficioBonus,
    state.personaje.vampirismoBonus,
    state.personaje.vida,
    state.equipo.actual,
    state.bonus,
    state.dados.dadosTotales,
    state.efectosPorSec
  ]);

  useEffect(() => {
    dispatch({
      type: A.STATS.PORCENTAJE_VIDA,
    });

    if (
      prevCasillero.current > state.casillero &&
      state.efectosPorSec.tickPsicosis > 0
    ) {
      dispatch({
        type: A.BUFF.PSICOSIS,
        fase: "golpe",
        retroceso: prevCasillero.current - state.casillero,
      });
    } else if (
      (prevVida.current > state.personaje.vida &&
        state.personaje.vida != state.personaje.vidaMaxima) ||
      prevCasillero.current > state.casillero
    ) {
      console.log(`entra al condicional de casillero previo mayor`);
      dispatch({
        type: A.STATS.HANDLE_IRA,
      });
    }
    prevCasillero.current = state.casillero;
    prevVida.current = state.personaje.vida;
    dispatch({ type: A.DADO.PODER_DADO_CASILLERO });
  }, [
    state.personaje.vida,
    state.personaje.vidaBase,
    state.casillero,
    state.personaje.vidaMaxima,
  ]);
  useEffect(() => {
    dispatch({
      type: A.STATS.HANDLE_IRA,
    });
  }, [state.bonus.enfurecido]);

  return (
    <div className="div-columna">
      <generalContext.Provider value={{ state, dispatch }}>
        {children}
      </generalContext.Provider>
    </div>
  );
}
