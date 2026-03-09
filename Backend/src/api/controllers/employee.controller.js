const Employee = require("../models/employee.model");

// Ruta Obtener Todos Empleados

const getEmployees = async (req, res) => {

    try {
        const employees = await Employee.find()

        if(!employees.length){
           return res.status(400).json({error:"No Hay Ningun Empleado en la Base de datos"})
        }

        res.status(200).json(employees)
        
    } catch (error) {
        res.status(500).json({ error: "Error Obteniendo todos los Empleados" });
        console.error(error);
    }

}


const createEmployee = async (req, res) => {

    try {

        const newEmployee = new Employee(req.body);

        const createdEmployee = await newEmployee.save();

        res.status(201).json(createdEmployee);

        
    } catch (error) {
        res.status(500).json({ error: "Error Creando Nuevo Empleado" });
        console.error(error);    
    }
}