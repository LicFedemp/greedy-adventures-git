import { useGeneralReducer } from "./MainReducer";
import React, { useContext, useEffect, useRef, useState } from "react";
import { A } from "./Objetos/Acciones";
import { sounds, burnSounds, playAudio } from "./Objetos/Audios";
const generalContext = React.createContext();

export function useGeneralContext() {
  return useContext(generalContext);
}

export function ContextProvider({ children }) {
  const [state, dispatch] = useGeneralReducer();
  const [firstRender, setFirstRender] = useState(true);
  const [firstLvlUp, setFirstLvlUp] = useState(true);

  const prevCasillero = useRef(state.casillero);
  const prevVida = useRef(state.personaje.vidaBase);
  const prevSecundario = useRef(0);
  const prevEnergia = useRef(state.personaje.energiaMax);
  const prevMuerte = useRef(state.muerteContador);
  const secundarioArray = ["", "ira", "combo", "mana", "mana"];
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      dispatch({ type: A.DADO.HANDLE_NUMERO_DADOS });
    }
  }, [firstRender]);

  //burn
  useEffect(() => {
    if (state.estadoTurno && state.efectosPorSec.tickQuemadura > 0) {
      const randomSound = Math.floor(Math.random() * 3);
      playAudio(burnSounds[randomSound]);

      const frecuencia =
        state.efectosPorSec.quemadura <= 6
          ? 1150 - state.efectosPorSec.quemadura * 150
          : 150;
      intervaloRef.current = setInterval(() => {
        dispatch({ type: A.BUFF.EFECTOS_PS, tipo: "burnAccion" });
      }, frecuencia);
    } else {
      clearInterval(intervaloRef.current);
    }
  }, [state.estadoTurno, state.efectosPorSec.tickQuemadura]);

  //hemo tick hit
  useEffect(() => {
    if (
      state.personaje.energia < prevEnergia.current &&
      state.efectosPorSec.tickHemo > 0
    ) {
      dispatch({ type: A.BUFF.EFECTOS_PS, tipo: "hemoAccion" });
    }
    prevEnergia.current = state.personaje.energia;
  }, [state.personaje.energia]);

  // ajuste cambio pj
  useEffect(() => {
    dispatch({
      type: A.GRAL.SELECCION_PERSONAJE,
      clase: state.numeroClase,
      spec: state.numeroSpec,
    });
    prevVida.current = state.personaje.vidaMaxima;
  }, [state.muerteContador]);

  // muerte
  useEffect(() => {
    if (state.personaje.vida <= 0 || state.corruptosContador >= 19) {
      dispatch({ type: A.STATS.MUERTE });
    }
  }, [state.personaje.vida, state.corruptosContador]);

  useEffect(() => {
    //1 se ejecuta por el cambio en ceniza, pero aun tiene que esperar a morir (ultimo condicional)
    //cuando muere se ejecuta por segunda vez al modificar el contador de muerte
    // aca entra porque cumple el segundo condicional
    // se ejecuta el primer toggle turno
    // cuando quieras arrancar el siguiente turno se modifica cenizas y entra al segundo toggle con el mensaje
    // condicional eliminado state.casillero == 0 && !state.bonus.cenizas ||
    if (
      state.numeroClase != 500 ||
      (state.bonus.cenizas && prevMuerte.current == state.muerteContador)
    ) {
      // tiene que ser pala
      // tiene que haber disonancia de muerte con cenizas true
      return;
    }
    if (state.bonus.cenizas) {
      dispatch({ type: A.GRAL.TOGGLE_TURNO });
      prevMuerte.current = state.muerteContador;
    } else {
      window.alert(
        `Las cenizas COMIENZAN a encenderse nuevamente con la llama de la vida...`
      );
      dispatch({ type: A.GRAL.TOGGLE_TURNO });
      dispatch({ type: A.STATS.HEAL_ASCENSO });
    }
  }, [state.muerteContador, state.bonus.cenizas]);

  //control exceso de energia
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

  //dados e ira
  useEffect(() => {
    if (state.numeroClase == 100) {
      dispatch({ type: A.STATS.IRA_DADOS });
    }
  }, [state.personaje.ira]);

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
    dispatch({ type: A.DADO.HANDLE_NUMERO_DADOS });
  }, [
    state.dados.dadoIra,
    state.dados.dadosAdd,
    state.dados.dadosTemporales,
    state.dados.dadosPermanentes,
    state.casillero,
  ]);

  // useEffect(() => {
  //   if (!state.estadoTurno) {
  //     dispatch({ type: A.DADO.DADOS_FUTUROS });
  //   }
  // }, [state.estadoTurno]);

  useEffect(() => {
    dispatch({
      type: A.STATS.HANDLE_IRA,
    });
  }, [state.bonus.enfurecido]);

  //stats
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
    state.efectosPorSec,
  ]);

  //cambios de vida
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

  // ganancia de secundario sound
  useEffect(() => {
    const recursoSecundario = secundarioArray[state.numeroClase / 100];
    if (state.personaje[recursoSecundario] > prevSecundario.current) {
      new Audio(sounds.secundarioSound).play();
    }

    prevSecundario.current = state.personaje[recursoSecundario];
  }, [
    state.personaje.ira,
    state.personaje.combo,
    state.personaje.mana,
    state.numeroClase,
  ]);

  //Lvlup sonido
  useEffect(() => {
    if (firstLvlUp && state.casillero >= 20) {
      //play sound
      setFirstLvlUp(false);
      new Audio(sounds.lvlUp).play();
    }
  }, [state.casillero]);

  return (
    <div className="div-columna">
      <generalContext.Provider value={{ state, dispatch }}>
        {children}
      </generalContext.Provider>
    </div>
  );
}
