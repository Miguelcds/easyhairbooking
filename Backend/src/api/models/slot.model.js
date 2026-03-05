const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    employee_id: {type:mongoose.Types.ObjectId, required:true, ref: "Employee"},
    date: {type: Date, required: true},
    hour: {type: String, required: true},
    isAvailable: {type: Boolean, required: true, default: true}
},
{
    timestamps: true
})

 /*
 * Índice Compuesto Único — employee_id + date + hour
 *
 * Garantiza que no puedan existir dos documentos en la colección Slots
 * con el mismo empleado, la misma fecha Y la misma hora simultáneamente.
 *
 * Ejemplo de lo que SÍ permite:
 *   - Empleado A | 2025-03-01 | 10:00  ✅
 *   - Empleado A | 2025-03-01 | 11:00  ✅ (misma fecha pero hora distinta)
 *   - Empleado B | 2025-03-01 | 10:00  ✅ (mismo día y hora pero empleado distinto)
 *
 * Ejemplo de lo que NO permite:
 *   - Empleado A | 2025-03-01 | 10:00  ✅ (primero)
 *   - Empleado A | 2025-03-01 | 10:00  ❌ (duplicado — MongoDB lanza error)
 *
 * El { unique: true } hace que MongoDB rechace el documento
 * antes de guardarlo si ya existe esa combinación.
 * El 1 indica orden ascendente, estándar para índices sin necesidad de ordenación específica.
 */

slotSchema.index({employee_id: 1, date: 1, hour: 1 }, { unique: true });


const Slot = mongoose.model("Slot", slotSchema);

module.exports = Slot;