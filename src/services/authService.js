const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../data/store');
const { jwtSecret, jwtExpiresIn } = require('../config');
const AppError = require('../utils/AppError');

/**
 * Autentica a un usuario y genera un token JWT firmado.
 *
 * Valida que las credenciales existan, que la contraseña coincida con el
 * hash almacenado y que la cuenta se encuentre activa.
 *
 * @param {string} usuario - Nombre de usuario registrado.
 * @param {string} password - Contraseña en texto plano a verificar.
 * @returns {{token: string, usuario: {id: number, usuario: string, nombre: string, rol: string}}}
 *   Token JWT y datos públicos del usuario autenticado.
 * @throws {AppError} 400 si faltan datos, 401 si las credenciales son inválidas
 *   o 403 si el usuario está inactivo.
 */
function login(usuario, password) {
  if (!usuario || !password) throw new AppError('Usuario y contraseña son obligatorios');

  const encontrado = getDb().usuarios.find((u) => u.usuario === usuario);
  if (!encontrado || !bcrypt.compareSync(password, encontrado.password)) {
    throw new AppError('Credenciales inválidas', 401);
  }
  if (!encontrado.activo) throw new AppError('Usuario inactivo', 403);

  const token = jwt.sign({ id: encontrado.id, rol: encontrado.rol }, jwtSecret, { expiresIn: jwtExpiresIn });
  return { token, usuario: perfil(encontrado) };
}

function perfil(u) {
  return { id: u.id, usuario: u.usuario, nombre: u.nombre, rol: u.rol };
}

function buscarPorId(id) {
  return getDb().usuarios.find((u) => u.id === id);
}

module.exports = { login, perfil, buscarPorId };
