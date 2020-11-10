const express = require("express");
const router = express.Router();
// importar express validator
const { body } = require("express-validator/check");

// importar el controllador
const proyectosController = require("../controllers/proyectosController");
const tareasController = require("../controllers/tareasController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");
module.exports = function () {
  // Ruta para el home
  router.get(
    "/",
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );
  router.get(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
  );
  router.post(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,
    body("nombre").not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
  );
  // Listar proyecto
  router.get(
    "/proyectos/:url",
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl
  );
  // Actualizar proyecto
  router.get(
    "/proyecto/editar/:id",
    authController.usuarioAutenticado,
    proyectosController.formularioEditar
  );
  router.post(
    "/nuevo-proyecto/:id",
    authController.usuarioAutenticado,
    body("nombre").not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto
  );
  // Eliminar Proyecto
  router.delete(
    "/proyectos/:url",
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto
  );
  // Tareas
  router.post(
    "/proyectos/:url",
    authController.usuarioAutenticado,
    tareasController.agregarTarea
  );
  // Actualizar tareas
  router.patch(
    "/tareas/:id",
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
  );
  // Eliminar tareas
  router.delete(
    "/tareas/:id",
    authController.usuarioAutenticado,
    tareasController.eliminarTarea
  );
  // Crear nueva cuenta
  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post("/crear-cuenta", usuariosController.crearCuenta);
  router.get("/confirmar/:correo", usuariosController.confirmarCuenta);
  // Iniciar sessón
  router.get("/iniciar-session", usuariosController.formIniciarSession);
  router.post("/iniciar-session", authController.autenticarUsuario);

  // Cerrar sesion
  router.get("/cerrar-session", authController.cerrarSession);
  // restablecer contraseña
  router.get("/restablecer", usuariosController.formRestablecerPassword);
  router.post("/restablecer", authController.enviarToken);
  router.get("/restablecer/:token", authController.validarToken);
  router.post("/restablecer/:token", authController.actualizarPassword);
  return router;
};
