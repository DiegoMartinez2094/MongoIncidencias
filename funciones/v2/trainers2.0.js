import { con } from "../../db/atlas.js";
import { Router } from "express";

const trainer2 = Router();
const db = await con();

trainer2.get("/:Id_trainer?", async (req, res) => {
    try {
        const trainers = db.collection("trainer");
        if (req.params.Id_trainer) {  // Verificar si se proporcionó el parámetro Id_trainer en la URL
            const trainerId = parseInt(req.params.Id_trainer);
            const result = await trainers.findOne({ Id_trainer: trainerId });

            if (result) {
                res.send(result);
            } else {
                res.status(404).send("Trainer no encontrado");
            }
        } else {
            const allTrainers = await trainers.find().toArray();  // Manejar el caso en que no se proporciona el parámetro
            res.send(allTrainers);
        }
    } catch (error) {
        console.error("Error al obtener los trainers:", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default trainer2;
