# Matriz de Trazabilidad de Requisitos (RTM)

**Proyecto:** Puesto de Chance API
**Versión:** 1.0.0
**Estándar aplicado:** Trazabilidad Historia de Usuario → Requisito → Implementación → Prueba de calidad
**Fecha de actualización:** 2026-11-12

## Propósito

Esta matriz vincula formalmente cada Historia de Usuario (HU) con el módulo o
controlador que la implementa y con el caso de prueba automatizado que la
verifica. Permite responder preguntas como: *¿está implementado este requisito?*,
*¿está probado?* y *¿dónde vive el código que lo resuelve?*

## Leyenda de Estado QA

| Estado | Significado |
| --- | --- |
| **Aprobado** | Existe implementación y una prueba automatizada que se ejecuta correctamente. |
| **Pendiente** | Requisito implementado, pero sin prueba automatizada dedicada (cobertura parcial). |
| **En progreso** | Requisito en desarrollo o con prueba incompleta. |
| **Rechazado** | Requisito no cumple criterios de aceptación. |

## Matriz de Trazabilidad

| ID HU | Descripción Requisito | Módulo / Controlador | Caso de Prueba | Estado QA |
| --- | --- | --- | --- | --- |
| HU-001 | El sistema debe permitir iniciar sesión con usuario y contraseña, devolviendo un token JWT y el perfil sin exponer la contraseña. | `src/services/authService.js` → `login()` / `src/controllers/authController.js` → `login` | `tests/auth.test.js` → `test_login_exitoso` | Aprobado |
| HU-002 | El sistema debe rechazar credenciales inválidas con HTTP 401. | `src/services/authService.js` → `login()` | `tests/auth.test.js` → `test_login_credenciales_invalidas` | Aprobado |
| HU-003 | Las rutas privadas deben exigir un token JWT válido y activo. | `src/middlewares/auth.js` → `autenticar()` | `tests/auth.test.js` → `test_ruta_protegida_sin_token` | Aprobado |
| HU-004 | La venta de tiquetes de chance debe generar código único, total y estado ACTIVO, aceptando de 1 a 5 apuestas. | `src/services/ticketService.js` → `venderChance()` / `src/controllers/ticketController.js` → `venderChance` | `tests/tickets.test.js` → `test_venta_chance` | Aprobado |
| HU-005 | La venta de tiquetes de Baloto debe aceptar de 1 a 10 jugadas y calcular el total según el valor unitario. | `src/services/ticketService.js` → `venderBaloto()` / `src/controllers/ticketController.js` → `venderBaloto` | `tests/tickets.test.js` → `test_venta_baloto` | Aprobado |
| HU-006 | El sistema debe validar el número, la modalidad, el rango y los múltiplos de 100 en las apuestas de chance. | `src/services/chanceService.js` → `validarApuesta()` | `tests/chance.test.js` → `test_validacion_apuesta_invalida` | Aprobado |
| HU-007 | El sistema debe calcular premios directos de chance de 4, 3 y 2 cifras sobre las últimas cifras del resultado. | `src/services/chanceService.js` → `calcularPremio()` | `tests/chance.test.js` → `test_premio_directo_4_cifras`, `test_premio_directo_ultimas_cifras` | Aprobado |
| HU-008 | El sistema debe calcular premios de chance en modalidad COMBINADO dividiendo por el número de permutaciones. | `src/services/chanceService.js` → `calcularPremio()` / `permutaciones()` | `tests/chance.test.js` → `test_premio_combinado_divide_por_permutaciones` | Aprobado |
| HU-009 | El sistema debe validar jugadas de Baloto: 5 números únicos entre 1 y 43 y superbalota entre 1 y 16, o generación aleatoria. | `src/services/balotoService.js` → `validarJugada()` / `generarAleatoria()` | `tests/baloto.test.js` → `test_jugada_aleatoria_valida`, `test_jugada_numeros_repetidos` | Aprobado |
| HU-010 | El sistema debe calcular premios de Baloto según aciertos y superbalota, incluyendo el acumulado para 5+1. | `src/services/balotoService.js` → `calcularPremio()` | `tests/baloto.test.js` → `test_premio_por_aciertos` | Aprobado |
| HU-011 | Las ventas deben cerrarse automáticamente cuando falten los minutos configurados para el sorteo. | `src/services/sorteoService.js` → `verificarVentaPermitida()` | `tests/tickets.test.js` → `test_venta_sorteo_cerrado` | Aprobado |
| HU-012 | Solo el rol VENDEDOR puede vender tiquetes; el rol ADMIN no debe poder vender. | `src/routes/index.js` → `permitir('VENDEDOR')` / `src/middlewares/auth.js` → `permitir()` | `tests/tickets.test.js` → `test_admin_no_vende` | Aprobado |
| HU-013 | Un tiquete solo puede anularse dentro de la ventana de minutos configurada (salvo ADMIN). | `src/services/ticketService.js` → `anular()` / `src/config/index.js` → `minutosAnulacion` | `tests/tickets.test.js` → `test_anulacion_fuera_de_tiempo` | Aprobado |
| HU-014 | Solo el vendedor dueño del tiquete o un ADMIN pueden anularlo, exigiendo un motivo. | `src/services/ticketService.js` → `anular()` | `tests/tickets.test.js` → `test_anulacion_ticket` | Aprobado |
| HU-015 | El ADMIN debe poder registrar el resultado oficial de un sorteo y liquidar automáticamente los tiquetes activos. | `src/services/sorteoService.js` → `registrarResultado()` / `src/controllers/sorteoController.js` → `registrarResultado` | `tests/tickets.test.js` → `test_resultado_y_pago_premio` | Aprobado |
| HU-016 | El sistema debe permitir pagar un premio una sola vez, marcando el tiquete como PAGADO y registrando el comprobante. | `src/services/ticketService.js` → `pagarPremio()` / `src/controllers/ticketController.js` → `pagar` | `tests/tickets.test.js` → `test_resultado_y_pago_premio` | Aprobado |
| HU-017 | El ADMIN debe poder crear sorteos de tipo CHANCE o BALOTO con fecha futura y estado ABIERTO. | `src/services/sorteoService.js` → `crear()` / `src/controllers/sorteoController.js` → `crear` | `tests/caja.test.js` → `test_admin_crea_sorteo` | Aprobado |
| HU-018 | El vendedor debe consultar su resumen de caja diario: ventas, anulaciones, premios y saldo esperado. | `src/services/cajaService.js` → `resumen()` / `src/controllers/cajaController.js` → `resumen` | `tests/caja.test.js` → `test_resumen_caja_diario` | Aprobado |
| HU-019 | El vendedor debe poder cerrar su caja diaria y el sistema debe clasificar la diferencia como CUADRADA, SOBRANTE o FALTANTE, impidiendo doble cierre. | `src/services/cajaService.js` → `cerrar()` / `src/controllers/cajaController.js` → `cerrar` | `tests/caja.test.js` → `test_cierre_caja_con_faltante` | Aprobado |
| HU-020 | El sistema debe permitir consultar un tiquete por código, incluyendo el estado del sorteo y si es ganador. | `src/services/ticketService.js` → `consultar()` / `src/controllers/ticketController.js` → `consultar` | `tests/tickets.test.js` → `test_resultado_y_pago_premio` (consulta del ganador) | Aprobado |
| HU-021 | El sistema debe permitir listar y filtrar tiquetes por vendedor, fecha y estado. | `src/services/ticketService.js` → `listar()` / `src/controllers/ticketController.js` → `listar` | Sin prueba dedicada | Pendiente |
| HU-022 | El sistema debe permitir listar y consultar sorteos por tipo, estado e ID. | `src/services/sorteoService.js` → `listar()`, `obtener()` / `src/controllers/sorteoController.js` | Sin prueba dedicada (solo uso indirecto en autenticación) | Pendiente |
| HU-023 | Los premios deben caducar después de los días configurados y no poder pagarse vencido el plazo. | `src/services/ticketService.js` → `pagarPremio()` / `src/config/index.js` → `diasCaducidadPremio` | Sin prueba dedicada | Pendiente |

## Resumen de Cobertura

| Estado QA | Cantidad de HU | Porcentaje |
| --- | ---: | ---: |
| Aprobado | 20 | 87 % |
| Pendiente | 3 | 13 % |
| En progreso | 0 | 0 % |
| **Total** | **23** | **100 %** |

> La cobertura se calcula sobre las Historias de Usuario listadas en esta matriz.
> Para actualizar un estado, ejecute `npm test` y verifique el caso de prueba
> asociado.

## Requisitos Pendientes de Prueba (Backlog de QA)

1. **HU-021** — Agregar `test_listar_tickets_filtros` en `tests/tickets.test.js`
   verificando el aislamiento por vendedor (un vendedor no ve tiquetes ajenos) y
   los filtros `fecha` y `estado`.
2. **HU-022** — Agregar `test_listar_sorteos_filtros` en un nuevo
   `tests/sorteos.test.js`, cubriendo filtros por `tipo`/`estado` y el 404 de
   `obtener()` con un ID inexistente.
3. **HU-023** — Agregar `test_premio_caducado` simulando `sorteo.jugadoEn` con
   más de `DIAS_CADUCIDAD_PREMIO` días de antigüedad y esperando HTTP 410.

## Convención de Nombres de Pruebas

Todos los casos siguen el patrón `test_<accion>_<condicion>`, por ejemplo
`test_anulacion_fuera_de_tiempo` o `test_cierre_caja_con_faltante`, lo que
facilita su búsqueda directa en la matriz y en el reporte de Jest.

## Trazabilidad Inversa (Prueba → HU)

| Archivo de prueba | Casos | HU cubiertas |
| --- | --- | --- |
| `tests/auth.test.js` | 3 | HU-001, HU-002, HU-003 |
| `tests/chance.test.js` | 4 | HU-006, HU-007, HU-008 |
| `tests/baloto.test.js` | 3 | HU-009, HU-010 |
| `tests/tickets.test.js` | 7 | HU-004, HU-005, HU-011, HU-012, HU-013, HU-014, HU-015, HU-016, HU-020 |
| `tests/caja.test.js` | 3 | HU-017, HU-018, HU-019 |
