import express from 'express';
import dotenv from 'dotenv'
import versionRoutes from 'express-routes-versioning';
import { crearToken } from './middlewares/middlewareJWT.js';



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
 
 app.use('/trainer', versionRoute({
    "1.0.0": trainer,
    "2.0.0": trainer2
 }));

 
 app.use('/incidencia', versionRoute({
    "1.0.0": incidencia,
    "2.0.0": incidencia2
 }));

 app.use('/rol', versionRoute({
   "2.0.0": rol
}));