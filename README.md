# Puesto de Chance API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Jest](https://img.shields.io/badge/Tested%20with-Jest-C21325?logo=jest&logoColor=white)
![Swagger](https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?logo=swagger&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

API REST para la administración de un **puesto de chance**: venta de tiquetes de
chance y Baloto, consulta y anulación de tiquetes, liquidación y pago de premios,
y cierre de caja diario. Incluye autenticación con JWT, control de acceso por
roles (`ADMIN` / `VENDEDOR`), documentación interactiva con Swagger y una suite de
pruebas automatizadas con Jest.

---

## Tabla de contenido

- [Descripción general](#descripción-general)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Prerrequisitos del sistema](#prerrequisitos-del-sistema)
- [Instalación local paso a paso](#instalación-local-paso-a-paso)
- [Variables de entorno](#variables-de-entorno)
- [Ejecución](#ejecución)
- [Documentación interactiva de la API](#documentación-interactiva-de-la-api)
- [Endpoints principales](#endpoints-principales)
- [Ejemplos de uso](#ejemplos-de-uso)
- [Pruebas automatizadas](#pruebas-automatizadas)
- [Documentación del código (JSDoc)](#documentación-del-código-jsdoc)
- [Matriz de Trazabilidad de Requisitos](#matriz-de-trazabilidad-de-requisitos)
- [Roles y seguridad](#roles-y-seguridad)
- [Licencia](#licencia)

---

## Descripción general

El sistema modela la operación diaria de un puesto de lotería. Un **vendedor**
inicia sesión, consulta los sorteos disponibles, vende tiquetes de chance o
Baloto, anula tiquetes dentro de una ventana de tiempo permitida, paga premios y
realiza el cierre de caja del día. Un **administrador** crea sorteos, registra
los resultados oficiales —lo que dispara la liquidación automática de los
tiquetes activos— y puede consultar la información de cualquier vendedor.

La persistencia es **en memoria** (`src/data/store.js`) con datos semilla, lo que
permite ejecutar el proyecto sin base de datos. Está pensada como proyecto
académico y como base para evolucionar a una persistencia real.

## Características

- Autenticación con JWT y contraseñas cifradas con bcrypt.
- Autorización por roles (`ADMIN`, `VENDEDOR`).
- Venta de chance con modalidades `DIRECTO` y `COMBINADO`.
- Venta de Baloto con jugadas manuales o aleatorias.
- Validación de reglas de negocio y manejo centralizado de errores HTTP.
- Liquidación automática de premios al registrar el resultado de un sorteo.
- Anulación de tiquetes con ventana de tiempo y motivo obligatorio.
- Cierre de caja con detección de cuadrado, sobrante o faltante.
- Documentación interactiva OpenAPI/Swagger.
- Pruebas de integración y unitarias con Jest + Supertest.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| [Node.js](https://nodejs.org/) | Entorno de ejecución (versión 18 o superior) |
| [Express 4](https://expressjs.com/) | Framework HTTP y enrutamiento |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | Emisión y verificación de tokens JWT |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Hash de contraseñas |
| [dotenv](https://www.npmjs.com/package/dotenv) | Carga de variables de entorno |
| [cors](https://www.npmjs.com/package/cors) | Habilitación de CORS |
| [morgan](https://www.npmjs.com/package/morgan) | Registro de peticiones HTTP |
| [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express) | Documentación interactiva de la API |
| [Jest](https://jestjs.io/) | Framework de pruebas |
| [Supertest](https://www.npmjs.com/package/supertest) | Pruebas de endpoints HTTP |
| [Nodemon](https://nodemon.io/) | Recarga automática en desarrollo |

## Estructura del proyecto

```text
documentacionApi/
├── docs/
│   ├── openapi.json          # Especificación OpenAPI 3.0 (Swagger)
│   └── RTM.md                # Matriz de Trazabilidad de Requisitos
├── src/
│   ├── config/index.js       # Lectura de variables de entorno
│   ├── controllers/          # Capa HTTP (request/response)
│   │   ├── authController.js
│   │   ├── cajaController.js
│   │   ├── sorteoController.js
│   │   └── ticketController.js
│   ├── data/store.js         # Persistencia en memoria + datos semilla
│   ├── middlewares/
│   │   ├── auth.js           # autenticar() y permitir()
│   │   └── errorHandler.js   # 404 y manejo centralizado de errores
│   ├── routes/index.js       # Definición de endpoints /api/v1
│   ├── services/             # Reglas de negocio
│   │   ├── authService.js
│   │   ├── balotoService.js
│   │   ├── cajaService.js
│   │   ├── chanceService.js
│   │   ├── sorteoService.js
│   │   └── ticketService.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── fechas.js
│   ├── app.js                # Configuración de Express y Swagger
│   └── server.js             # Arranque del servidor
├── tests/                    # Pruebas Jest + Supertest
├── .env.example              # Plantilla de variables de entorno
├── package.json
└── README.md
```

## Prerrequisitos del sistema

Antes de instalar, verifique que cuenta con:

- **Node.js 18 o superior** (recomendado 20 LTS). Verifique con `node --version`.
- **npm 9 o superior** (se incluye con Node.js). Verifique con `npm --version`.
- **Git** (opcional, para clonar el repositorio).
- Sistema operativo Windows, macOS o Linux.
- Puerto **3000** libre (o el que defina en `PORT`).

## Instalación local paso a paso

1. **Clonar el repositorio** (si aún no lo tiene en local):

   ```bash
   git clone <URL-del-repositorio>
   cd documentacionApi
   ```

2. **Instalar las dependencias**:

   ```bash
   npm install
   ```

3. **Crear el archivo de variables de entorno** a partir de la plantilla:

   ```bash
   # Linux / macOS
   cp .env.example .env

   # Windows PowerShell
   Copy-Item .env.example .env
   ```

4. **Ajustar el archivo `.env`** según su entorno. Como mínimo, cambie
   `JWT_SECRET` por un valor seguro en producción.

5. **Verificar la instalación ejecutando las pruebas**:

   ```bash
   npm test
   ```

6. **Levantar el servidor en modo desarrollo**:

   ```bash
   npm run dev
   ```

7. **Abrir la documentación interactiva** en el navegador:

   ```text
   http://localhost:3000/api-docs
   ```

## Variables de entorno

La plantilla completa está en [`.env.example`](./.env.example). Todas las
variables son opcionales salvo `JWT_SECRET`, que debe cambiarse en producción.

| Variable | Descripción | Valor por defecto | Obligatoria |
| --- | --- | --- | --- |
| `PORT` | Puerto HTTP del servidor. | `3000` | No |
| `JWT_SECRET` | Secreto para firmar tokens JWT. | `cambiar-este-secreto` | Sí (producción) |
| `JWT_EXPIRES_IN` | Vigencia del token (`8h`, `30m`, `7d`). | `8h` | No |
| `ZONA_HORARIA` | Zona horaria para fechas y cierres. | `America/Bogota` | No |
| `MINUTOS_ANULACION` | Ventana para anular tiquetes. | `10` | No |
| `MINUTOS_CIERRE_VENTAS` | Antelación de cierre de ventas. | `15` | No |
| `APUESTA_MIN_CHANCE` | Apuesta mínima de chance (COP). | `500` | No |
| `APUESTA_MAX_CHANCE` | Apuesta máxima de chance (COP). | `50000` | No |
| `VALOR_BALOTO` | Valor unitario por jugada de Baloto (COP). | `5700` | No |
| `DIAS_CADUCIDAD_PREMIO` | Días para reclamar un premio. | `365` | No |

Ejemplo mínimo de `.env`:

```env
PORT=3000
JWT_SECRET=un-secreto-largo-y-aleatorio
JWT_EXPIRES_IN=8h
ZONA_HORARIA=America/Bogota
```

## Ejecución

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor en modo producción. |
| `npm run dev` | Inicia el servidor con recarga automática (nodemon). |
| `npm test` | Ejecuta la suite de pruebas con Jest. |

Servidor local: `http://localhost:3000`
Verificación de salud: `GET http://localhost:3000/health`

### Usuarios de demostración (datos semilla)

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `admin` | `admin123` | `ADMIN` |
| `vendedor1` | `vende123` | `VENDEDOR` |
| `vendedor2` | `vende456` | `VENDEDOR` |

> Los datos viven en memoria: al reiniciar el servidor se restablecen los sorteos
> y se eliminan tiquetes, pagos y cierres creados.

## Documentación interactiva de la API

La API cuenta con documentación OpenAPI 3.0 servida con Swagger UI:

- **Swagger UI:** `http://localhost:3000/api-docs`
- **Especificación JSON:** `http://localhost:3000/api-docs.json`
- **Archivo fuente:** [`docs/openapi.json`](./docs/openapi.json)

Desde Swagger UI puede autenticarse con el botón **Authorize** usando el token
obtenido en `POST /api/v1/auth/login` y probar cada endpoint sin herramientas
externas.

## Endpoints principales

Base URL: `http://localhost:3000/api/v1`

| Método | Ruta | Rol | Descripción |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Público | Inicia sesión y devuelve el token JWT. |
| `GET` | `/auth/perfil` | Autenticado | Devuelve el perfil del usuario. |
| `GET` | `/sorteos` | Autenticado | Lista sorteos (filtros `tipo`, `estado`). |
| `GET` | `/sorteos/:id` | Autenticado | Obtiene un sorteo por ID. |
| `POST` | `/sorteos` | `ADMIN` | Crea un sorteo con fecha futura. |
| `POST` | `/sorteos/:id/resultado` | `ADMIN` | Registra el resultado y liquida premios. |
| `POST` | `/tickets/chance` | `VENDEDOR` | Vende un tiquete de chance. |
| `POST` | `/tickets/baloto` | `VENDEDOR` | Vende un tiquete de Baloto. |
| `GET` | `/tickets` | Autenticado | Lista tiquetes (filtros `fecha`, `estado`). |
| `GET` | `/tickets/:codigo` | Autenticado | Consulta un tiquete por código. |
| `POST` | `/tickets/:codigo/anular` | Autenticado | Anula un tiquete con motivo. |
| `POST` | `/tickets/:codigo/pagar` | `VENDEDOR` | Paga el premio de un tiquete. |
| `GET` | `/caja/resumen` | Autenticado | Resumen diario de caja del vendedor. |
| `POST` | `/caja/cierre` | `VENDEDOR` | Cierra la caja del día. |
| `GET` | `/health` | Público | Estado del servicio (fuera de `/api/v1`). |

## Ejemplos de uso

**1. Iniciar sesión**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"usuario\":\"vendedor1\",\"password\":\"vende123\"}"
```

**2. Vender un tiquete de chance** (reemplace `$TOKEN`)

```bash
curl -X POST http://localhost:3000/api/v1/tickets/chance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"sorteoId\":1,\"apuestas\":[{\"numero\":\"1234\",\"valor\":1000}]}"
```

**3. Vender un tiquete de Baloto con jugada aleatoria**

```bash
curl -X POST http://localhost:3000/api/v1/tickets/baloto \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"sorteoId\":3,\"jugadas\":[{\"aleatoria\":true}]}"
```

**4. Consultar un tiquete**

```bash
curl http://localhost:3000/api/v1/tickets/CH-A1B2C3D4 \
  -H "Authorization: Bearer $TOKEN"
```

**5. Consultar el resumen de caja**

```bash
curl http://localhost:3000/api/v1/caja/resumen \
  -H "Authorization: Bearer $TOKEN"
```

## Pruebas automatizadas

El proyecto usa **Jest** y **Supertest**. Ejecute:

```bash
npm test
```

| Archivo | Cobertura funcional |
| --- | --- |
| `tests/auth.test.js` | Login exitoso, credenciales inválidas y rutas protegidas. |
| `tests/chance.test.js` | Premios directos/combinados y validación de apuestas. |
| `tests/baloto.test.js` | Jugadas aleatorias, números repetidos y premios. |
| `tests/tickets.test.js` | Venta, sorteo cerrado, roles, anulación y pago de premios. |
| `tests/caja.test.js` | Resumen de caja, cierre con faltante y creación de sorteos. |

## Documentación del código (JSDoc)

Las funciones críticas del backend están documentadas con el estándar **JSDoc**
(`@param`, `@returns`, `@throws`). Entre ellas:

| Función | Archivo | Descripción |
| --- | --- | --- |
| `login()` | `src/services/authService.js` | Autenticación y emisión de JWT. |
| `autenticar()` | `src/middlewares/auth.js` | Verificación de token y carga del usuario. |
| `validarApuesta()` | `src/services/chanceService.js` | Reglas de validación de apuestas de chance. |
| `calcularPremio()` | `src/services/chanceService.js` | Cálculo de premios de chance. |
| `validarJugada()` | `src/services/balotoService.js` | Validación/generación de jugadas de Baloto. |
| `calcularPremio()` | `src/services/balotoService.js` | Cálculo de premios de Baloto. |
| `venderChance()` | `src/services/ticketService.js` | Registro de venta de chance. |
| `anular()` | `src/services/ticketService.js` | Reglas de anulación de tiquetes. |
| `pagarPremio()` | `src/services/ticketService.js` | Pago y caducidad de premios. |
| `registrarResultado()` | `src/services/sorteoService.js` | Resultado oficial y liquidación. |
| `cerrar()` | `src/services/cajaService.js` | Cierre y cuadre de caja. |

Para generar una vista HTML de la documentación del código puede instalar JSDoc
de forma global o local:

```bash
npx jsdoc -r src -d docs/jsdoc
```

## Matriz de Trazabilidad de Requisitos

La trazabilidad formal entre Historias de Usuario, implementación y pruebas está
en **[`docs/RTM.md`](./docs/RTM.md)**. Allí se detallan 23 Historias de Usuario
con su módulo/controlador y caso de prueba asociado, además del resumen de
cobertura y el backlog de QA para los requisitos pendientes.

## Roles y seguridad

- `ADMIN`: crea sorteos, registra resultados y consulta información de cualquier
  vendedor.
- `VENDEDOR`: vende tiquetes, los anula dentro de la ventana permitida, paga
  premios y cierra su caja.
- Las contraseñas se almacenan con **bcrypt** y nunca se devuelven en las
  respuestas.
- Los tokens JWT se envían en el encabezado `Authorization: Bearer <token>`.
- Las entradas se validan en la capa de servicios y los errores se normalizan en
  `src/middlewares/errorHandler.js`.

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulte el archivo
`LICENSE` si desea reutilizarlo.
