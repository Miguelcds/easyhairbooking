const express = require("express");

const {getEmployees, getAllEmployees, createEmployee, editEmployee, toggleActiveEmployee} = require('../controllers/employee.controller')

const {isAuth} = require("../../middlewares/auth.middleware");

const employeeRouter = express.Router();

employeeRouter.get("/", getEmployees);

employeeRouter.get("/all",isAuth(["admin"]), getAllEmployees);

employeeRouter.post("/", isAuth(["admin"]), createEmployee);

employeeRouter.put("/:id",isAuth(["admin"]), editEmployee);

employeeRouter.patch("/:id", isAuth(["admin"]), toggleActiveEmployee);


/*

Provisional Admin

EMAIL: pacome@hotmail.com

CONTRA: 12345678998

token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWIyN2QyZjI1MTM4Mjc3ZjQ4ODVjZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MzA2OTUwMCwiZXhwIjoxNzczMjQyMzAwfQ.2IqfnF_42y4M6__pm3FuCuELOI_tyib2d8FSzgL_pVw



*/


module.exports = employeeRouter;