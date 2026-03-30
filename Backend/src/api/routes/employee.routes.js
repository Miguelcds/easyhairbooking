const express = require("express");

const {getEmployees, getAllEmployees, createEmployee, editEmployee, toggleActiveEmployee} = require('../controllers/employee.controller')

const {isAuth} = require("../../middlewares/auth.middleware");

const employeeRouter = express.Router();

employeeRouter.get("/", getEmployees);

employeeRouter.get("/all",isAuth(["admin"]), getAllEmployees);

employeeRouter.post("/", isAuth(["admin"]), createEmployee);

employeeRouter.put("/:id",isAuth(["admin"]), editEmployee);

employeeRouter.patch("/:id", isAuth(["admin"]), toggleActiveEmployee);


module.exports = employeeRouter;