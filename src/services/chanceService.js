const AppError = require('../utils/AppError');
const { apuestaMinChance, apuestaMaxChance } = require('../config');

const TABLA_PAGOS = { 4: 4500, 3: 400, 2: 50, 1: 5 };
const MODALIDADES = ['DIRECTO', 'COMBINADO'];

function permutaciones(numero) {
  if (numero.length <= 1) return new Set([numero]);
  const resultado = new Set();
  [...numero].forEach((digito, i) => {
    const resto = numero.slice(0, i) + numero.slice(i + 1);
    permutaciones(resto).forEach((p) => resultado.add(digito + p));
  });
  return resultado;
}

/**
 * Valida y normaliza una apuesta de chance.
 *
 * Comprueba el formato del número (1 a 4 dígitos), la modalidad, el monto
 * permitido y que el valor sea múltiplo de 100. En modalidad COMBINADO
 * exige al menos 3 cifras y que no todas sean iguales.
 *
 * @param {{numero: string, modalidad?: 'DIRECTO'|'COMBINADO', valor: number}} apuesta
 *   Datos de la apuesta enviada por el cliente.
 * @returns {{numero: string, cifras: number, modalidad: string, valor: number}}
 *   Apuesta validada y lista para almacenarse.
 * @throws {AppError} Si el número, la modalidad o el valor no cumplen las reglas.
 */
function validarApuesta(apuesta) {
  const { numero, modalidad = 'DIRECTO', valor } = apuesta || {};

  if (typeof numero !== 'string' || !/^\d{1,4}$/.test(numero)) {
    throw new AppError('El número debe tener entre 1 y 4 dígitos');
  }
  if (!MODALIDADES.includes(modalidad)) {
    throw new AppError(`Modalidad inválida: ${modalidad}`);
  }
  if (modalidad === 'COMBINADO' && numero.length < 3) {
    throw new AppError('La modalidad COMBINADO solo aplica para 3 o 4 cifras');
  }
  if (modalidad === 'COMBINADO' && permutaciones(numero).size === 1) {
    throw new AppError('Un número con todas las cifras iguales no se puede combinar');
  }
  if (!Number.isInteger(valor) || valor < apuestaMinChance || valor > apuestaMaxChance) {
    throw new AppError(`El valor debe estar entre ${apuestaMinChance} y ${apuestaMaxChance}`);
  }
  if (valor % 100 !== 0) {
    throw new AppError('El valor debe ser múltiplo de 100');
  }

  return { numero, cifras: numero.length, modalidad, valor };
}

/**
 * Calcula el premio de una apuesta de chance frente al resultado oficial.
 *
 * En modalidad DIRECTO compara el número completo con las últimas cifras del
 * resultado. En modalidad COMBINADO considera cualquier permutación del número
 * y reparte el premio entre la cantidad de combinaciones posibles.
 *
 * @param {{numero: string, cifras: number, modalidad: string, valor: number}} apuesta
 *   Apuesta previamente validada.
 * @param {string} resultado - Resultado oficial del sorteo (4 dígitos).
 * @returns {number} Valor del premio en pesos; 0 si la apuesta no gana.
 */
function calcularPremio(apuesta, resultado) {
  const ganador = resultado.slice(-apuesta.cifras);
  const factor = TABLA_PAGOS[apuesta.cifras];

  if (apuesta.modalidad === 'DIRECTO') {
    return apuesta.numero === ganador ? apuesta.valor * factor : 0;
  }

  const combinaciones = permutaciones(apuesta.numero);
  if (!combinaciones.has(ganador)) return 0;
  return Math.floor((apuesta.valor * factor) / combinaciones.size);
}

function validarResultado(resultado) {
  if (typeof resultado !== 'string' || !/^\d{4}$/.test(resultado)) {
    throw new AppError('El resultado de chance debe ser un número de 4 dígitos');
  }
  return resultado;
}

module.exports = { validarApuesta, calcularPremio, validarResultado, permutaciones, TABLA_PAGOS };
