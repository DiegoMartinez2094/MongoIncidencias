import { con } from "../../db/atlas.js";
import { Router } from "express";

const incidencia2 = Router();
const db = await con();

incidencia2.get("/:Id_incidencia?", async (req, res) => {
    try {
        const incidencias = db.collection("incidencia");
        if (req.params.Id_incidencia) {  // Verificar si se proporcionó el parámetro Id_incidencia en la URL
            const incidenciaId = parseInt(req.params.Id_incidencia);
            const result = await incidencias.findOne({ Id_incidencia: incidenciaId });

            if (result) {
                res.send(result);
            } else {
                res.status(404).send("incidencia no encontrada");
            }
        } else {
            const allIncidencias = await incidencias.find().toArray();// Manejar el caso en que no se proporciona el parámetro
            res.send(allIncidencias);
        }
    } catch (error) {
        console.error("Error al obtener las incidencias:", error);
        res.status(500).send("Error interno del servidor");
    }
});



export default incidencia2;