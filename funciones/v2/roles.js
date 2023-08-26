import { con } from "../../db/atlas.js";
import { Router } from "express";
import { limitGrt } from "../../limit/config.js";
import { validarToken } from '../../middlewares/middlewareJWT.js';
import { validationResult } from "express-validator";


const rol = Router();
const db = await con();
const roles = db.collection("rol");

rol.get("/rol/:Id_rol?",validarToken,limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    try {
        if (req.params.Id_rol) {  // Verificar si se proporcionó el parámetro Id_rol en la URL
            const rolId = parseInt(req.params.Id_rol);
            const result = await roles.findOne({ Id_rol: rolId });

            if (result) {
                res.send(result);
            } else {
                res.status(404).send("rol no encontrado");
            }
        } else {
            const allroles = await roles.find().toArray();  // Manejar el caso en que no se proporciona el parámetro
            res.send(allroles);
        }
    } catch (error) {
        console.error("Error al obtener los roles:", error);
        res.status(500).send("Error interno del servidor");
    }
});

 rol.post("/rol",validarToken,limitGrt(), async(req, res) => {
     if(!req.rateLimit) return; 
     console.log(req.rateLimit);
     const {errors} = validationResult(req)
     res.status(200).json(errors);
 let resul;
 try { 
     resul = await roles.insertOne(req.body);
     res.status(201).send(resul);
 } catch (error) {
     console.log(error);
     res.send();
 }
 });     

 rol.put("/rol/:Id_rol",validarToken,limitGrt(), async (req, res) => {
     if(!req.rateLimit) return; 
     console.log(req.rateLimit);
    
     try {
         const rolId = parseInt(req.params.Id_rol);
         const updatedrol = req.body; 
         const {errors} = validationResult(req)
         res.status(200).json(errors);
         const result = await roles.updateOne({ Id_rol: rolId }, { $set: updatedrol });
         if (result.matchedCount === 0) {
             res.status(404).send("rol no encontrado");
         } else {
             res.status(200).send("rol actualizado correctamente");
         }
     } catch (error) {
         console.error("Error al actualizar el rol:", error);
         res.status(500).send("Error interno del servidor");
     }
 });

 rol.delete("/rol/:Id_rol",validarToken,limitGrt(), async (req, res) => {
     if(!req.rateLimit) return; 
     console.log(req.rateLimit);
     try {
         const rolId = parseInt(req.params.Id_rol);
         const result = await roles.deleteOne({ Id_rol: rolId });
         if (result.deletedCount === 0) {
             res.status(404).send("rol no encontrado");
         } else {
             res.status(200).send("rol eliminado correctamente");
         }
     } catch (error) {
         console.error("Error al eliminar el rol:", error);
         res.status(500).send("Error interno del servidor");
     }
 });


export default rol;