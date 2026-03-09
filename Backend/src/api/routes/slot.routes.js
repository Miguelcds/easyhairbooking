const express = require('express')

const {getSlots, createSlot} = require('../controllers/slot.controller');

const {isAuth} = require("../../middlewares/auth.middleware");

const slotRouter = express.Router();

slotRouter.get("/", getSlots);

slotRouter.post("/",isAuth(["admin"]), createSlot);

module.exports = slotRouter;

