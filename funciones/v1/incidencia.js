import { con } from "../../db/atlas.js";
import { Router } from "express";
import { limitGrt } from "../../limit/config.js";
import { validarToken } from '../../middlewares/middlewareJWT.js';


const incidencia = Router();
const db = await con();

incidencia.get("/incidencia",validarToken,limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    try {
        const incidencias = db.collection("incidencia");
        const result = await incidencias.find({}).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error al obtener los incidencias:", error);
        res.status(500).send("Error interno del servidor");
    }
});



export default incidencia;