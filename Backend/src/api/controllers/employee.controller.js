const Employee = require("../models/employee.model");

// GET Ruta Obtener Todos Empleados

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ active: true });

    if (!employees.length) {
      return res
        .status(400)
        .json({ error: "No Hay Ningun Empleado en la Base de datos" });
    }

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error Obteniendo todos los Empleados" });
    console.error(error);
  }
};

//  POST Modelo Para Crear Empeleados, solo Puede Añadirlo un Admin

const createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);

    const createdEmployee = await newEmployee.save();

    res.status(201).json(createdEmployee);
  } catch (error) {
    res.status(500).json({ error: "Error Creando Nuevo Empleado" });
    console.error(error);
  }
};

// PUT Editar Empleado, Solo Para Admin
// PUT reemplaza el documento completo. El cliente debe enviar todos los campos incluyendo el array completo de specialties actualizado.

const editEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const updateEmployee = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateEmployee) {
      return res.status(404).json({ error: "Usuario No localizado" });
    }

    res.status(200).json(updateEmployee);
  } catch (error) {
    res.status(500).json({ error: "Error Actualizando Empleado" });
    console.error(error);
  }
};

// PATCH Activar/ Desactivar Empleado, Solo Admin

const toggleActiveEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const actualState = await Employee.findById(id);

    if(!actualState){
        return res.status(404).json({ error: "Empleado No localizado"});
    }

    const updateEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        $set: { active: !actualState.active },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json(updateEmployee);
  } catch (error) {
    res.status(500).json({ error: "Error Cambiando De Estado Al Empleado" });
    console.error(error);
  }
};

module.exports = {getEmployees, createEmployee, editEmployee, toggleActiveEmployee};