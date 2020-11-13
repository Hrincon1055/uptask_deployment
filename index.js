const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
require("dotenv").config({ path: "variables.env" });

// Hepers con funciones
const helpers = require("./helpers");
// Crear la conexion a la base de datos
const db = require("./config/db");
// Importar el modelo
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("Conectado a la db"))
  .catch((error) => console.log(error));
// Crear una aplicacion de express
const app = express();
// Donde cargar los archivos estaticos
app.use(express.static("public"));
// Habilitar pug
app.set("view engine", "pug");
// Habilitar bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
// Añadir la carpeta de vistas
app.set("views", path.join(__dirname, "./views"));

// Cookie
app.use(cookieParser());
// Sessiones nos permiten navegar entre distintas paginas
app.use(
  session({
    secret: "supersecreto",
    resave: false,
    saveUninitialized: false,
  })
);
//
app.use(passport.initialize());
app.use(passport.session());

// Agregar flash mesages
app.use(flash());
// Pasar vardump  a la app
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = { ...req.user } || null;
  next();
});

app.use("/", routes());
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 4000;
app.listen(port, host, () => {
  console.log("El server esta LISTO!");
});
