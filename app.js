import express from 'express';
import dotenv from 'dotenv'
import versionRoutes from 'express-routes-versioning';
import { crearToken } from './middlewares/middlewareJWT.js';
import {check} from 'express-validator'

import trainer from "./funciones/v1/trainer.js";
import trainer2 from "./funciones/v2/trainers2.0.js";
import incidencia from './funciones/v1/incidencia.js';
import incidencia2 from './funciones/v2/incidencia2.js';
import rol from './funciones/v2/roles.js';

dotenv.config();
let app = express(); 

app.use (express.json());
const versionRoute = versionRoutes();
let config =JSON.parse(process.env.My_server);

app.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}`);
});

app.use((req, res, next) => {
    req.version = req.headers['accept-version'];
    next();
 });

 app.get('/token/:rol', crearToken);
 
//  {
//    "_id": {
//      "$oid": "64e9132550e9e586a68b37d4"
//    },
//    "Id_trainer": 1,
//    "nombre_trainer": "Miguel",
//    "Emails": {
//      "Email_personal": "entrenador1@example.com",
//      "Email_corporativo": "entrenador1@empresa.com"
//    },
//    "telefonos": {
//      "telefono_movil": "1234567890",
//      "telefono_residencia": "9876543210",
//      "telefono_empresa": "5555555555",
//      "telefono_mobil_empresa": "6666666666"
//    }
//  }

 app.use('/trainer',
 
 [check("Id_trainer")
 .notEmpty().withMessage('el Id_trainer es obligatorio')
 .isInt().withMessage('el Id_trainer debe ser numerico')],

 [check("nombre_trainer")
 .notEmpty().withMessage('el nombre_trainer es obligatorio')
 .isString().withMessage('el nombre_trainer debe ser string')],

 [check("Emails.Email_corporativo")
 .notEmpty().withMessage('el Email_corporativo es obligatorio')
 .isString().withMessage('el Email_corporativo debe ser string')],

 [check("telefonos.telefono_movil")
 .notEmpty().withMessage('el telefono_movil es obligatorio')
 .isString().withMessage('el telefono_movil debe ser string')],

  versionRoute({
    "1.0.0": trainer,
    "2.0.0": trainer2
 }));


//  {
//    Id_incidencia: 1,
//    tipo_incidencia: "leve",
//    area: "training",
//    lugar:"Apolo",
//    fecha: ISODate("2023-08-25"),
//    categoria:"hardware",
//    equipo: {Id_Equipo: 25564125,tipo_Equipo: "teclado"},
//    descripcion_incidencia: "Daño en el cable",
//    reportó_trainer: "Miguel"
//  }

 app.use('/incidencia',[check("Id_incidencia")
 .notEmpty().withMessage('el Id_incidencia es obligatorio')
 .isInt().withMessage('el Id_incidencia debe ser numerico')],

 [check("tipo_incidencia")
 .notEmpty().withMessage('el tipo_incidencia es obligatorio')
 .isString().withMessage('el tipo_incidencia debe ser string')],

 [check("area")
 .notEmpty().withMessage('el area es obligatorio')
 .isString().withMessage('el area debe ser string')],

 [check("lugar")
 .notEmpty().withMessage('el lugar es obligatorio')
 .isString().withMessage('el lugar debe ser string')],

 [check("fecha")
 .notEmpty().withMessage('el fecha es obligatorio')
 .isString().withMessage('el fecha debe ser string')],

 [check("categoria")
 .notEmpty().withMessage('la categoria es obligatoria')
 .isString().withMessage('la categoria debe ser string')],

  [check("Id_Equipo")
  .notEmpty().withMessage('el Id_Equipo es obligatorio')
  .isInt().withMessage('el Id_Equipo debe ser numero')],

  [check("tipo_Equipo")
  .notEmpty().withMessage('el tipo_Equipo es obligatorio')
  .isString().withMessage('el tipo_Equipo debe ser string')],

 [check("descripcion_incidencia")
 .notEmpty().withMessage('el descripcion_incidencia es obligatorio')
 .isString().withMessage('el descripcion_incidencia debe ser string')],

 [check("reportó_trainer")
 .notEmpty().withMessage('el reportó_trainer es obligatorio')
 .isString().withMessage('el reportó_trainer debe ser string')],

 versionRoute({
    "1.0.0": incidencia,
    "2.0.0": incidencia2
 }));

//  {
//    "_id": "64e96d0fbc43cea56f7f5b9a",
//    "Id_rol": 3,
//    "nombre_rol": "studiante",
//    "acceso_rol": [
//      "incidencia"
//    ]
//  }

 app.use('/rol',[check("Id_rol")
 .notEmpty().withMessage('el Id_rol es obligatorio')
 .isInt().withMessage('el Id_rol debe ser numerico')],

 [check("nombre_rol")
 .notEmpty().withMessage('el nombre_rol es obligatorio')
 .isString().withMessage('el nombre_rol debe ser string')],

 [check("acceso_rol")
 .notEmpty().withMessage('el acceso_rol es obligatorio')
 .isArray().withMessage('el acceso_rol debe ser un array')
 .custom(accesoRoles => {
   if (!accesoRoles.every(role => typeof role === 'string')) {
     throw new Error('todos los elementos en acceso_rol deben ser strings');
   }
   return true;
 })
],

  versionRoute({
   "2.0.0": rol
}));