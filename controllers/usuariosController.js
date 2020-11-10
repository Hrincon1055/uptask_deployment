const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");
exports.formCrearCuenta = (req, res, next) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear Cuenta en Uptask",
  });
};
exports.formIniciarSession = (req, res, next) => {
  const { error } = res.locals.mensajes;
  res.render("iniciarSession", {
    nombrePagina: "Iniciar session en uptask",
    error,
  });
};
exports.crearCuenta = async (req, res, next) => {
  // Leer los datos
  const { email, password } = req.body;
  try {
    // Crear el usuario
    await Usuarios.create({ email, password });
    // Crear una url de confirmacion
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
    // Crear el objeto
    const usuario = {
      email,
    };
    // Enviar Email
    await enviarEmail.enviar({
      usuario,
      subject: "Corfirma tu cuenta",
      confirmarUrl,
      archivo: "confirmar-cuenta",
    });
    // Redirigir el usuario
    req.flash("correcto", "Enviamos un correo, confirma tu cuenta");
    res.redirect("/iniciar-session");
  } catch (error) {
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("crearCuenta", {
      mensajes: req.flash(),
      nombrePagina: "Crear Cuenta en Uptask",
      email,
      password,
    });
  }
};

exports.formRestablecerPassword = (req, res) => {
  res.render("restablecer", {
    nombrePagina: "Restablecer Contraseña",
  });
};
// Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo,
    },
  });
  if (!usuario) {
    req.flash("error", "No valido");
    res.redirect("/crear-cuenta");
  }
  usuario.activo = 1;
  await usuario.save();
  req.flash("correcto", "cuenta creada");
  res.redirect("/iniciar-session");
};
