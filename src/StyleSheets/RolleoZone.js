import { useGeneralContext } from "../Componentes/Provider";
import { Rolleo } from "../Componentes/Rolleo";
import { DADOS } from "../Componentes/Objetos/Dados";
import "./RolleoZone.css";
import { useEffect, useState } from "react";

export function RolleoZone() {
  const { state, dispatch } = useGeneralContext();
  const [firstRender, setFirstRender] = useState(true);

  const calcularNuevoClari = (variable) => {
    const chanceClari = state.efectosPorSec.chanceClari;
    const clarividencia = state.efectosPorSec.clarividencia;
    let nuevaChanceClari;
    let nuevaClari;
    switch (chanceClari) {
      case 15:
      case 30:
        nuevaChanceClari = chanceClari + 15;
        nuevaClari = clarividencia;

        break;
      case 45:
      case 0:
        nuevaChanceClari = 15;
        nuevaClari = clarividencia + 1;
        break;

      default:
        break;
    }
    if (variable == "clari") {
      return nuevaClari;
    } else {
      return nuevaChanceClari;
    }
  };

  const cartaSkill = (tier) => {
    const personaje = parseInt(state.numeroClase) + parseInt(state.numeroSpec);
    if (tier == 1) {
      switch (personaje) {
        case 101:
          return `Cargar`;
        case 102:
          return `Blindado`;
        case 201:
          return `Golpe en los riñones`;
        case 202:
          return `Esfumarse: +30% esquivar`;
        case 301:
        case 302:
          return `Psicosis: el objetivo pierde ${state.bonus.poderPsicosis}% de vida x retroceso.`;
        case 401:
        case 402:
          return `Clarividencia: ${calcularNuevoClari(
            "chance"
          )}% +${calcularNuevoClari("clari")} Mana x turno`;
        default:
          break;
      }
    } else if (tier == 2) {
      switch (personaje) {
        case 101:
          return `Rage: +50% ataque, +50% vampirismo, 0 defensa`;
        case 102:
          return `Embate de escudo: inflige ${state.personaje.defensa} puntos de dano`;
        case 201:
          const ataqueSiniestro =
            state.personaje.ataque * 2 + state.personaje.maleficio * 1;
          return `Ataque siniestro: infliges ${ataqueSiniestro}. Critico = 300% `;
        case 202:
          return `Danza de Cuchillas: cada vez que esquivas infliges ${state.personaje.ataque} de dano al jugador +cercano`;
        case 301:
          return `Infliges ${
            state.personaje.maleficio
          } de dano a TODOS los jugadores. Te curas ${
            state.personaje.vidaMaxima * 0.1
          } hp por cada jugador afectado.`;
        case 302:
          return `Destruccion mental:+2% Dano de Psicosis.`;
        case 401:
          return `Teletransportacion: 2 jugadores intercambian posiciones`;
        case 402:
          return `Durante 1 turno las curaciones pueden ser críticas, +30% critico`;
        default:
          break;
      }
    }
  };

  const descripcion = (confusion, n, modo, dado) => {
    const numeroFinal = confusion ? n[0] : n;
    const modoFinal = confusion ? n[1] : modo;
    if (confusion) {
      console.log(
        `arrayConf en funcion = ${state.alertConfusion}// n=${n[0]}// modo=${n[1]}`
      );
    }

    if (modoFinal) {
      switch (numeroFinal) {
        case 1:
          const avanzarCasillero = 1 + Math.floor(state.personaje.ataque / 50);
          return `Avanzas ${avanzarCasillero} ${
            avanzarCasillero > 1 ? `casilleros` : `casillero`
          }`;
        case 2:
          return `${
            state.personaje.defensaMagica > 0
              ? `No pasa na. Antirretroceso OP?`
              : `Retrocedes 1 casillero`
          }`;
        case 3:
          return DADOS.D3.A.DECRIPCION;
        case 4:
          return `Lanzas D${
            state.automatico
              ? 4 + Math.floor(state.personaje.ataque / 50)
              : 4 + Math.floor(state.personaje.ataque / 100) * 2
          }, avanza el resultado`;
        case 5:
          return `${state[dado].estado == 2 ? `+2` : `+1`} Energia`;
        case 6:
          return DADOS.D6.A.DECRIPCION;
        case 7:
          const retrocesoPotenciado =
            1 + Math.floor(state.personaje.maleficio / 50);
          return `Haz retroceder ${retrocesoPotenciado} ${
            retrocesoPotenciado > 1 ? `casilleros` : `casillero`
          } a cualquier jugador.`;
        case 8:
          return `${state[dado].estado == 2 ? `+2` : `+1`} Energia & +1 Dado`;
        case 9:
          return DADOS.D9.A.DECRIPCION;
        case 10:
          return DADOS.D10.A.DECRIPCION;
        case 11:
          const clase = state.numeroClase;
          return `+1  ${
            clase == 100
              ? `punto de ira`
              : clase == 200
              ? `punto de combo`
              : `mana`
          }`;
        case 12:
          return cartaSkill(1);
        case 13:
          return DADOS.D13.A.DECRIPCION;
        case 14:
          return `+1 dado permanente`;
        case 15:
          const dano15 = Math.floor(
            state.personaje.ataque * 1.5 + state.personaje.maleficio * 0.5
          );
          const vampirismo15 = Math.floor(state.personaje.vampirismo + 20);
          return `Infliges ${dano15} de dano al jugador MAS CERCANO y te curas ${vampirismo15}% de lo infligido`;
        case 16:
          return `Campo de fuerza: 33% de chances de bloquear efectos negativos x 1Turno.`;

        case 17:
          return DADOS.D17.A.DECRIPCION;
        case 18:
          return `Purificacion: elimina debuffos y dados obligados.`;
        case 19:
          return `+3: Ataque, Maleficio, Vampirismo y Critico`;
        case 20:
          return cartaSkill(2);
        default:
          return ``;
      }
    } else if (!modoFinal) {
      switch (numeroFinal) {
        case 1:
          return `Infliges ${state.personaje.ataque} puntos de dano ${
            state.numeroClase == 100 || state.numeroClase == 200
              ? `al jugador mas cercano`
              : `a cualquier jugador`
          }`;
        case 2:
          const danoRecibido = 10 - state.personaje.defensa;
          return `Recibes ${
            danoRecibido <= 0 ? `0 ` : danoRecibido
          } puntos de dano`;
        case 3:
          return DADOS.D3.B.DECRIPCION;
        case 4:
          return DADOS.D4.B.DECRIPCION;
        case 5:
          return `Te curas ${state.personaje.curacion} puntos de vida`;
        case 6:
          return `Lanzas D6. Resultado <6: infliges ${Math.floor(
            state.personaje.ataque / 2
          )} PD. Si D6 == 6, recibiras ${Math.floor(
            state.personaje.ataque * 2
          )} PD`;
        case 7:
          const ataque7 = Math.floor(state.personaje.ataque * 0.5);
          const maleficio7 = Math.floor(state.personaje.maleficio * 1);
          return `Infliges ${Math.floor(ataque7 + maleficio7)} puntos de dano `;
        case 8:
          return DADOS.D8.B.DECRIPCION;
        case 9:
          return DADOS.D9.B.DECRIPCION;
        case 10:
          return DADOS.D10.A.DECRIPCION;
        case 11:
          const clase = state.numeroClase;
          return `Te curas ${
            clase == 100 || clase == 200
              ? Math.floor(state.personaje.curacion * 4)
              : Math.floor(state.personaje.curacion * 2)
          }`;
        case 12:
          return ` ${cartaSkill(1)}`;

        case 13:
          return `Corrupcion: corrompe 1 Num. Esparcible mientras utilices D20. `;
        case 14:
          return `Equipo lvl 3`;
        case 15:
          const dano15 = Math.floor(
            state.personaje.ataque * 0.8 + state.personaje.maleficio * 1.2
          );
          return `Infliges ${dano15} puntos de dano a CUALQUIER jugador. Daño crítico = +300%. `;
        case 16:
          return `+1 Antirretroceso permanente`;
        case 17:
          return DADOS.D17.B.DECRIPCION;
        case 18:
          const curacion18 = Math.floor(
            state.personaje.curacion * 2 + state.personaje.vidaMaxima * 0.2
          );
          return `Te curas ${curacion18} HP. 10HP overheal = +1HpMax`;
        case 19:
          return `+3 Defensa, Esquivar, Curacion & +5HP Max`;
        case 20:
          return `+1 de energia maxima. Maximo:5`;
        default:
          return ``;
      }
    }
  };
  const renderRolleo = () => {
    const numRolleos =
      state.dados.dadosTotales > state.numDadoMaximo
        ? state.numDadoMaximo
        : state.dados.dadosTotales;
    const rolleos = Array.from({ length: numRolleos }, (_, index) => (
      <Rolleo
        key={index}
        dado={`roll${index + 1}`}
        descripcion={descripcion(
          false,
          parseInt(state[`roll${index + 1}`].numero),
          state[`roll${index + 1}`].modo,
          `roll${index + 1}`
        )}
        // alertConfusion={descripcion(

        // )}
      />
    ));
    return rolleos;
  };
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
  }, [firstRender]);

  useEffect(() => {
    if (firstRender) return;
    const n = state.alertConfusion;
    window.alert(descripcion(true, n[0], n[1]));
  }, [state.alertConfusion]);

  return (
    <div className="div-roll-zone">
      <div className=" div-roll-zone-secundario">{renderRolleo()}</div>
    </div>
  );
}
