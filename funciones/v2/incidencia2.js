import { con } from "../../db/atlas.js";
import { Router } from "express";
import { limitGrt } from "../../limit/config.js";
import { validarToken } from '../../middlewares/middlewareJWT.js';


const incidencia2 = Router();
const db = await con();
const incidencias = db.collection("incidencia");

incidencia2.get("/incidencia/:Id_incidencia?",validarToken,limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    try {
       
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


incidencia2.post("/incidencia/",validarToken,limitGrt(), async(req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
let resul;
try { 
    resul = await incidencias.insertOne(req.body);
    res.status(201).send(resul);
} catch (error) {
    console.log(error);
    res.send();
}
});    

incidencia2.put("/incidencia//:Id_incidencia",validarToken,limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    try {
        const incidenciaID = parseInt(req.params.Id_incidencia);
        const updatedIncidencia = req.body; 
        const result = await incidencias.updateOne({ Id_incidencia: incidenciaID }, { $set: updatedIncidencia });
        if (result.matchedCount === 0) {
            res.status(404).send("incidencia no encontrada");
        } else {
            res.status(200).send("incidencia actualizada correctamente");
        }
    } catch (error) {
        console.error("Error al actualizar la incidencia:", error);
        res.status(500).send("Error interno del servidor");
    }
});

incidencia2.delete("/incidencia//:Id_incidencia",validarToken,limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    try {
        const incidenciaId = parseInt(req.params.Id_incidencia);
        const result = await incidencias.deleteOne({ Id_incidencia: incidenciaId });
        if (result.deletedCount === 0) {
            res.status(404).send("incidencia no encontrado");
        } else {
            res.status(200).send("incidencia eliminada correctamente");
        }
    } catch (error) {
        console.error("Error al eliminar la incidencia:", error);
        res.status(500).send("Error interno del servidor");
    }
});



export default incidencia2;