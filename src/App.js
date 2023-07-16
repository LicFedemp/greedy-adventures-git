import "./App.css";
import { ContextProvider, useGeneralContext } from "./Componentes/Provider";
import { Heading } from "./Componentes/Heading";
import { RolleoZone } from "./StyleSheets/RolleoZone";
import { SeleccionPersonaje } from "./Componentes/SeleccionPersonaje";
import { Desplegable } from "./Componentes/Desplegable";
import { Buff } from "./Componentes/Buff";
function App() {
  const { state, dispatch } = useGeneralContext();
  const background = () => {
    const clase = parseInt(state.numeroClase);
    switch (clase) {
      case 100:
        return `red`;
      case 200:
        return `green`;
      case 300:
        return `purple`;
      case 400:
        return `blue`;
      default:
        return `red`;
    }
  };

  return (
    <div className={`App background-${background()}`}>
      <SeleccionPersonaje />
      <Buff />
      <Heading />
      <Desplegable />
      <RolleoZone />
    </div>
  );
}

export default App;
