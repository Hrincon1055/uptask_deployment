const Proyecto = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.agregarTarea = async (req, res, next) => {
  const proyecto = await Proyecto.findOne({
    where: {
      url: req.params.url,
    },
  });
  const { tarea } = req.body;
  const estado = 0;
  const proyectoId = proyecto.id;

  const resultado = await Tareas.create({ tarea, estado, proyectoId });
  if (!resultado) {
    return next();
  }
  res.redirect(`/proyectos/${req.params.url}`);
};
exports.cambiarEstadoTarea = async (req, res, next) => {
  const { id } = req.params;
  const tarea = await Tareas.findOne({
    where: {
      id: id,
    },
  });
  // Cambiar el estado
  let estado = 0;
  if (tarea.estado === estado) {
    estado = 1;
  }
  tarea.estado = estado;
  const resultado = await tarea.save();
  if (!resultado) {
    return next();
  }
  res.status(200).send("Actualizado");
};
exports.eliminarTarea = async (req, res, next) => {
  const { id } = req.params;
  // Eliminar la tarea
  const resultado = await Tareas.destroy({
    where: {
      id,
    },
  });
  if (!resultado) {
    return next();
  }
  res.status(200).send("Tarea eliminada correctamente");
};
