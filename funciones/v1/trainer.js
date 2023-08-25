import { con } from "../../db/atlas.js";
import { Router } from "express";
import { limitGrt } from "../../limit/config.js";
import { validarToken } from '../../middlewares/middlewareJWT.js';


const trainer = Router();
const db = await con();

trainer.get("/trainer" ,validarToken, limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
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