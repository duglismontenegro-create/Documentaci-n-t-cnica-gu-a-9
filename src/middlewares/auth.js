const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { buscarPorId } = require('../services/authService');
const AppError = require('../utils/AppError');

/**
 * Middleware de autenticación basado en JWT.
 *
 * Lee el encabezado `Authorization: Bearer <token>`, verifica la firma y
 * expiración del token, carga el usuario activo y lo adjunta en `req.usuario`.
 *
 * @param {import('express').Request} req - Petición HTTP.
 * @param {import('express').Response} res - Respuesta HTTP.
 * @param {import('express').NextFunction} next - Siguiente middleware.
 * @returns {void}
 * @throws {AppError} 401 si el token falta, es inválido, expiró o el usuario
 *   no está activo.
 */
function autenticar(req, res, next) {
  const [esquema, token] = (req.headers.authorization || '').split(' ');
  if (esquema !== 'Bearer' || !token) return next(new AppError('Token requerido', 401));

  try {
    const payload = jwt.verify(token, jwtSecret);
    const usuario = buscarPorId(payload.id);
    if (!usuario || !usuario.activo) return next(new AppError('Usuario no válido', 401));
    req.usuario = usuario;
    next();
  } catch (e) {
    next(new AppError('Token inválido o expirado', 401));
  }
}

const permitir = (...roles) => (req, res, next) =>
  roles.includes(req.usuario.rol) ? next() : next(new AppError('No tiene permisos para esta acción', 403));

module.exports = { autenticar, permitir };
