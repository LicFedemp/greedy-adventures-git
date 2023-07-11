import { useGeneralContext } from "../Componentes/Provider";
import { Rolleo } from "../Componentes/Rolleo";
import "./RolleoZone.css";

export function RolleoZone() {
  const { state, dispatch } = useGeneralContext();
  const renderRolleo = () => {
    const numRolleos =
      state.numDado +
      state.bonus.dadosTemporales +
      state.bonus.dadosPermanentes;
    const rolleos = Array.from({ length: numRolleos }, (_, index) => (
      <Rolleo key={index} dado={`roll${index + 1}`} />
    ));
    return rolleos;
  };

  return <div className="div-roll-zone">{renderRolleo()}</div>;
}
