---IDEAS DE PERSONAJES---
Paladin: escudo antimagia, hechizos alcance mele
--Espec antimagia: escama de dragon, curacion progresiva.
--Spec reborn: pluma de fenix,
Vampiro: mucha vida, acciones con costo de vida, burst sacrificado, vampirismo.
Druida: transformaciones.
Monje: ying yang, las curaciones progresivas dan unos stats y los danos progresivos dan otros, se puede autinfligir ambos.

---INTERFACE---
Desplegable de equipo.

----CORRECCIONES----
--La adicion del dado hacerlo permanente? hacer un dado extra temp y 1 dado perma (D20).
--Revisar alcance de efectos (mele/distancia)
--Revisar retroceso de habilidad de warlok
---CAMBIOS PERSONAJES EXISTENTES---

---AGREGAR---
-Cambiar numero de dados maximo: casillero>20 limite=10:limite=5
-Panel inferior con descripcion de equipo:
--Ordenar stats de mayor bonus a menor.

---Formula poder warlock---
Destruccion: retroceso= 1cada 2 mana+1 cada 2 mana cada 50maleficio
Masas: same pero incrementa con 100maleficio

---formula poder avance--- +1 casillero \*mana con 200p habilidad
mana

---Algoritmo construccion dado---
-Descripcion-
--Estatico o dinamico?
-Segun color:
--Rojo: +1combo.
--Morado: +1mana brujo.
--Azul: +1 mana mago.
-Segun efecto:
--Negativo: esquivable?Combo
--Recibir Dano:esquivar, reduccion defensa.
--Realizar Dano:critico (combo), potenciador ataque, vampirismo.
\

---Stats items---
-LVL1-
-LVL2-
--ataque: arma: 3-5-20, armadura:0-5, accesorio:0-5
--defensa: arma: 0-5-10(escudo), armadura:5-20, accesorio:0-10
--esquivar: arma: 0-10, armadura:0-5-, accesorio:0-10
--critico: arma: 5-20, armadura:0-5, accesorio:0-10
--maleficio: arma: 5-20, armadura:0-25, accesorio:0-10
--curacion: arma: 0-15-30, armadura:0-30, accesorio:0-20
--regeneracion: arma: 0-, armadura:0-3, accesorio:0-2,
--vampirismo:arma: 0-10, armadura:0-5, accesorio:0-5

---CODIGO UTIL---
combo:
state.numeroClase == 200 &&
state.personaje.combo < state.personaje.comboMax
? state.personaje.combo + 1
: state.personaje.combo,

if (randomEsquivar) {
window.alert(`Has esquivado el efecto negativo!`);
if (state.numeroClase == 200) {
return {
...state,
[action.dado]: ESTADO_SHORTCOUT,
ataqueAcumulado: [],

                            personaje: {
                              ...state.personaje,
                              energia: state.personaje.energia + 1,
                            },
                          };
                        } else {
                          return {
                            ...state,
                            [action.dado]: ESTADO_SHORTCOUT,
                            ataqueAcumulado: [],
                          };
                        }
                      }
