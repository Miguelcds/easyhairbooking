const express = require("express");

const {loginUser, registerUser, getMe } = require('../controllers/auth.controller')

const {isAuth} = require("../../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.get("/me", isAuth(), getMe)

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

module.exports = authRouter;




