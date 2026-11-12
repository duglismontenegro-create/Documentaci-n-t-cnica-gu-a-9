const AppError = require('../utils/AppError');

const MAX_NUMERO = 43;
const MAX_SUPERBALOTA = 16;

const PREMIOS = {
  '5+1': 'ACUMULADO',
  '5+0': 50000000,
  '4+1': 2000000,
  '4+0': 150000,
  '3+1': 40000,
  '3+0': 12000,
  '2+1': 9000,
  '1+1': 5700,
  '0+1': 5700,
};

function aleatorioEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarAleatoria() {
  const numeros = new Set();
  while (numeros.size < 5) numeros.add(aleatorioEntre(1, MAX_NUMERO));
  return {
    numeros: [...numeros].sort((a, b) => a - b),
    superbalota: aleatorioEntre(1, MAX_SUPERBALOTA),
  };
}

/**
 * Valida una jugada de Baloto o genera una automáticamente.
 *
 * Acepta `{ aleatoria: true }` para producir 5 números únicos entre 1 y 43 más
 * una superbalota entre 1 y 16. Si la jugada es manual, valida cantidad,
 * rango y ausencia de números repetidos.
 *
 * @param {{aleatoria?: boolean, numeros?: number[], superbalota?: number}} jugada
 *   Jugada enviada por el cliente.
 * @returns {{numeros: number[], superbalota: number}} Jugada validada y ordenada.
 * @throws {AppError} Si los números o la superbalota no cumplen las reglas.
 */
function validarJugada(jugada) {
  if (jugada && jugada.aleatoria === true) return generarAleatoria();

  const { numeros, superbalota } = jugada || {};
  if (!Array.isArray(numeros) || numeros.length !== 5) {
    throw new AppError('Cada jugada debe tener exactamente 5 números');
  }
  if (!numeros.every((n) => Number.isInteger(n) && n >= 1 && n <= MAX_NUMERO)) {
    throw new AppError(`Los números deben estar entre 1 y ${MAX_NUMERO}`);
  }
  if (new Set(numeros).size !== 5) {
    throw new AppError('Los números de una jugada no se pueden repetir');
  }
  if (!Number.isInteger(superbalota) || superbalota < 1 || superbalota > MAX_SUPERBALOTA) {
    throw new AppError(`La superbalota debe estar entre 1 y ${MAX_SUPERBALOTA}`);
  }
  return { numeros: [...numeros].sort((a, b) => a - b), superbalota };
}

/**
 * Calcula el premio de una jugada de Baloto según los aciertos.
 *
 * Cruza los números acertados y la superbalota contra la tabla oficial de
 * premios. Cuando la jugada acierta 5 + 1 devuelve el acumulado del sorteo.
 *
 * @param {{numeros: number[], superbalota: number}} jugada - Jugada validada.
 * @param {{numeros: number[], superbalota: number}} resultado - Resultado oficial.
 * @param {number} [acumulado=0] - Valor acumulado del sorteo para el premio mayor.
 * @returns {number} Valor del premio en pesos; 0 si no hay aciertos premiados.
 */
function calcularPremio(jugada, resultado, acumulado = 0) {
  const aciertos = jugada.numeros.filter((n) => resultado.numeros.includes(n)).length;
  const sb = jugada.superbalota === resultado.superbalota ? 1 : 0;
  const premio = PREMIOS[`${aciertos}+${sb}`];
  if (!premio) return 0;
  return premio === 'ACUMULADO' ? acumulado : premio;
}

module.exports = { validarJugada, calcularPremio, generarAleatoria, PREMIOS };
