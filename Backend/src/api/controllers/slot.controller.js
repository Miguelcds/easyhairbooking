const Slot = require("../models/slot.model");

// Creacion De Slots

// Obtener Slot

const getSlots = async (req, res) => {
  try {
    // Para Obtener Los Datos, no los obtendremos por params, sino por queryParams
    // Estos los obtenemos mediante req.query

    const { employee, date } = req.query;

    //

    const availableSlot = await Slot.find({
      employee_id: employee,
      date: date,
      isAvailable: true,
    });

    if (!availableSlot.length) {
      return res.status(404).json({ error: "No hay Slots Disponibles" });
    }

    res.status(200).json(availableSlot);

  } catch (error) {
    res.status(500).json({error: "Error Obteniendo todos los usuarios"});
    console.log(error);
    

  }
};



// Creacion De SLots


const createSlot = async (req, res) => {
    try {
        const slot = new Slot(req.body);

        const createSlot = await slot.save();

        res.status(201).json(createSlot)
        
    } catch (error) {
        res.status(400).json({ error: "Error Creando el Slot"})
        console.log(error);
        
    }
}


module.exports = {getSlots, createSlot}