import { con } from "../db/atlas.js";
import { Router } from "express";

const trainer2 = Router();
const db = await con();

trainer2.get("/:Id_trainer", async (req, res) => {
    try {
        const trainers = db.collection("trainer");
        const trainerId = parseInt(req.params.Id_trainer);
        const result = await trainers.findOne({ Id_trainer: trainerId });

        if (result) {
            res.send(result);
        } else {
            res.status(404).send("Trainer no encontrado");
        }
    } catch (error) {
        console.error("Error al obtener el trainer:", error);
        res.status(500).send("Error interno del servidor");
    }
});


export default trainer2;