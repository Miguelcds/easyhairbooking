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
    res.status(500).json({ error: "Error Obteniendo todos los usuarios" });
    console.log(error);
  }
};

// Creacion De SLots

const createSlot = async (req, res) => {
  try {
    const slot = new Slot(req.body);

    const createSlot = await slot.save();

    res.status(201).json(createSlot);
  } catch (error) {
    res.status(400).json({ error: "Error Creando el Slot" });
    console.log(error);
  }
};


/*  Para la introduccion de Datos De forma incremental
{
  "employee_id": "id_empleado",
  "date": "2026-04-02",
  "intervalMinutes": 45,
  "shifts": [
    { "start": "09:00", "end": "13:30" },
    { "start": "16:00", "end": "19:00" }
  ]
}

*/

const autoCreateSlot = async (req, res) => {
  try {
    const { employee_id, date, intervalMinutes, shifts } = req.body;

    const slots = [];

    for (let i = 0; i < shifts.length; i++) {

      // Serpara las horas y los minutos  ["09","00"]

      let actualHour = shifts[i].start.split(":");

      // Convierte la hora en mintuos calculados, siendo las 00:00 el punto de partida Ej --> 
      // Las 09:00 -->  09 * 60 + 00 --> 540 minutos
      // Las 0

      actualHour = +actualHour[0] * 60 + +actualHour[1];

      let endHour = shifts[i].end.split(":");

      endHour = +endHour[0] * 60 + +endHour[1];

      while (actualHour < endHour) {
        let hour = String(Math.floor(actualHour / 60)).padStart(2, 0);

        let minutes = String(actualHour % 60).padStart(2, 0);

        let finalHour = `${hour}:${minutes}`;

        slots.push({ employee_id, date, hour: finalHour });

        actualHour += intervalMinutes;
      }
    }

    await Slot.insertMany(slots);

    res.status(201).json("Todos los Slots Se han creado correctamente");

  } catch (error) {
    res.status(400).json({ error: "Error Creando el Slots" });
    console.log(error);
  }
};

module.exports = { getSlots, createSlot, autoCreateSlot };


