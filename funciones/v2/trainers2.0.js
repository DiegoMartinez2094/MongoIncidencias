import { con } from "../../db/atlas.js";
import { Router } from "express";
import trainer from "../v1/trainer.js";

const trainer2 = Router();
const db = await con();
const trainers = db.collection("trainer");

trainer2.get("/:Id_trainer?", async (req, res) => {
    try {
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

trainer2.post("/", async(req, res) => {
let resul;
try { 
    resul = await trainers.insertOne(req.body);
    res.status(201).send(resul);
} catch (error) {
    console.log(error);
    res.send();
}
});     


trainer2.put("/:Id_trainer", async (req, res) => {
    try {
        const trainerId = parseInt(req.params.Id_trainer);
        const updatedTrainer = req.body; 
        const result = await trainers.updateOne({ Id_trainer: trainerId }, { $set: updatedTrainer });
        if (result.matchedCount === 0) {
            res.status(404).send("Trainer no encontrado");
        } else {
            res.status(200).send("Trainer actualizado correctamente");
        }
    } catch (error) {
        console.error("Error al actualizar el trainer:", error);
        res.status(500).send("Error interno del servidor");
    }
});

trainer2.delete("/:Id_trainer", async (req, res) => {
    try {
        const trainerId = parseInt(req.params.Id_trainer);
        const result = await trainers.deleteOne({ Id_trainer: trainerId });
        if (result.deletedCount === 0) {
            res.status(404).send("Trainer no encontrado");
        } else {
            res.status(200).send("Trainer eliminado correctamente");
        }
    } catch (error) {
        console.error("Error al eliminar el trainer:", error);
        res.status(500).send("Error interno del servidor");
    }
});


export default trainer2;
