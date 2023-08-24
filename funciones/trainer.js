import { con } from "../db/atlas.js";
import { Router } from "express";

const trainer = Router();
const db = await con();

trainer.get("/", async (req, res) => {
    try {
        const trainers = db.collection("trainer");
        const result = await trainers.find({}).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error al obtener los trainers:", error);
        res.status(500).send("Error interno del servidor");
    }
});



export default trainer;