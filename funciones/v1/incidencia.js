import { con } from "../../db/atlas.js";
import { Router } from "express";

const incidencia = Router();
const db = await con();

incidencia.get("/", async (req, res) => {
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