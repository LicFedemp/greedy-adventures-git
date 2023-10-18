import impacto1 from "../../sounds/soundEffects/draw-sword1-44724.mp3";
import bigImpact1 from "../../sounds/soundEffects/big-impact-7054.mp3";
import lvlUp from "../../sounds/soundEffects/lvl-up-1.mp3";
import secundarioSound from "../../sounds/soundEffects/secundario-1.mp3";
import equipoSound from "../../sounds/soundEffects/item-equip-1.mp3";
import flipCard from "../../sounds/soundEffects/flipcard-1.mp3";
import psicosis from "../../sounds/soundEffects/psicosis-1.mp3";

import discharge from "../../sounds/sonidosUi/discharge.mp3";
import recharge from "../../sounds/sonidosUi/recharche.mp3";
import simpleClick from "../../sounds/sonidosUi/simple-click.mp3";
//habilidades
import cargar from "../../sounds/habilidades/cargar-1.mp3";
import rage from "../../sounds/habilidades/rage-1.mp3";
import siniestro from "../../sounds/habilidades/ataque-siniestro.mp3";
import golpeKidney from "../../sounds/habilidades/golpe-rinones.mp3";
import blindado from "../../sounds/habilidades/blindado-1.mp3";
import iluminado from "../../sounds/habilidades/iluminado.wav";
import heal12 from "../../sounds/habilidades/heal-12.mp3";
import teleport20 from "../../sounds/habilidades/teleport-20.mp3";
import teleportSimple from "../../sounds/habilidades/teleport-simple.mp3";
import clarividencia from "../../sounds/habilidades/clarividencia-1.wav";
import esfumarse from "../../sounds/habilidades/esfumarse.ogg";
import warlockSimple from "../../sounds/habilidades/warlock-skill-simple.wav";
import warlockMass from "../../sounds/habilidades/warlok-mass-D20.mp3";

//atmosfericos
import dark1 from "../../sounds/atmospheric and thunder/atmosphere-dark-1.mp3";
import dark2 from "../../sounds/atmospheric and thunder/atmosphere-dark-2.mp3";
import dark3 from "../../sounds/atmospheric and thunder/atmosphere-dark-3.mp3";
import dark4 from "../../sounds/atmospheric and thunder/atmosphere-dark-4.mp3";
import dark5 from "../../sounds/atmospheric and thunder/atmosphere-dark-5.mp3";
import dark6 from "../../sounds/atmospheric and thunder/atmosphere-dark-6.mp3";
import dark7 from "../../sounds/atmospheric and thunder/atmosphere-dark-7.mp3";
import celtic1 from "../../sounds/atmospheric and thunder/celtic-1.mp3";
import celtic2 from "../../sounds/atmospheric and thunder/celtic-2.mp3";
import celtic3 from "../../sounds/atmospheric and thunder/celtic-3.mp3";
import rainThunder from "../../sounds/atmospheric and thunder/rain-and-thunder-1.mp3";
import villageTheme from "../../sounds/atmospheric and thunder/village-theme-1.mp3";
import fairyTheme from "../../sounds/atmospheric and thunder/fairy-intro-1.mp3";

export function playAudio(audio) {
  new Audio(audio).play();
}

export const sounds = {
  impacto1,
  bigImpact1,
  discharge,
  recharge,
  simpleClick,
  lvlUp,
  secundarioSound,
  equipoSound,
  flipCard,
  psicosis,
  rage,
  cargar,
  siniestro,
  golpeKidney,
  blindado,
  iluminado,
  heal12,
  teleport20,
  teleportSimple,
  clarividencia,
  esfumarse,
  warlockMass,
  warlockSimple,
};
export const atmosphereSounds = [
  0,
  [rainThunder, villageTheme, fairyTheme, celtic1, celtic2, celtic3],
  [dark1, dark2, dark3, dark4, dark5, dark6, dark7],
];
