import { con } from "../../db/atlas.js";
import { Router } from "express";
import { limitGrt } from "../../limit/config.js";
import { validarToken } from '../../middlewares/middlewareJWT.js';


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

// roles.post("/trainer",validarToken,limitGrt(), async(req, res) => {
//     if(!req.rateLimit) return; 
//     console.log(req.rateLimit);
// let resul;
// try { 
//     resul = await trainers.insertOne(req.body);
//     res.status(201).send(resul);
// } catch (error) {
//     console.log(error);
//     res.send();
// }
// });     

// roles.put("/trainer/:Id_trainer",validarToken,limitGrt(), async (req, res) => {
//     if(!req.rateLimit) return; 
//     console.log(req.rateLimit);
//     try {
//         const rolId = parseInt(req.params.Id_trainer);
//         const updatedTrainer = req.body; 
//         const result = await trainers.updateOne({ Id_trainer: rolId }, { $set: updatedTrainer });
//         if (result.matchedCount === 0) {
//             res.status(404).send("Trainer no encontrado");
//         } else {
//             res.status(200).send("Trainer actualizado correctamente");
//         }
//     } catch (error) {
//         console.error("Error al actualizar el trainer:", error);
//         res.status(500).send("Error interno del servidor");
//     }
// });

// roles.delete("/trainer/:Id_trainer",validarToken,limitGrt(), async (req, res) => {
//     if(!req.rateLimit) return; 
//     console.log(req.rateLimit);
//     try {
//         const rolId = parseInt(req.params.Id_trainer);
//         const result = await trainers.deleteOne({ Id_trainer: rolId });
//         if (result.deletedCount === 0) {
//             res.status(404).send("Trainer no encontrado");
//         } else {
//             res.status(200).send("Trainer eliminado correctamente");
//         }
//     } catch (error) {
//         console.error("Error al eliminar el trainer:", error);
//         res.status(500).send("Error interno del servidor");
//     }
// });


export default rol;