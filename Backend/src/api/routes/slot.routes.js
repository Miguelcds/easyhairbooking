const express = require('express')

const {getSlots, createSlot, autoCreateSlot} = require('../controllers/slot.controller');

const {isAuth} = require("../../middlewares/auth.middleware");

const slotRouter = express.Router();

slotRouter.get("/", getSlots);

slotRouter.post("/",isAuth(["admin"]), createSlot);

slotRouter.post("/autoCreate", isAuth(["admin"]), autoCreateSlot)

module.exports = slotRouter;

