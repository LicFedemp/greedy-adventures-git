import "./App.css";
import { ContextProvider, useGeneralContext } from "./Componentes/Provider";
import { Heading } from "./Componentes/Heading";
import { RolleoZone } from "./StyleSheets/RolleoZone";
import { SeleccionPersonaje } from "./Componentes/SeleccionPersonaje";
import { Desplegable } from "./Componentes/Desplegable";
import { Buff } from "./Componentes/Buff";
function App() {
  const { state, dispatch } = useGeneralContext();
  const colorBackground = {
    100: `red`,
    200: `green`,
    300: `purple`,
    400: `blue`,
    500: `amarillo`,
  };

  return (
    <div
      className={`App background-${
        colorBackground[parseInt(state.numeroClase)]
      }`}
    >
      <SeleccionPersonaje />
      <Buff />
      <Heading />
      <Desplegable />
      <RolleoZone />
    </div>
  );
}

export default App;
