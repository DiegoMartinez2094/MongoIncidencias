import express from 'express';
import dotenv from 'dotenv'
import versionRoutes from 'express-routes-versioning';

import trainer from "./funciones/v1/trainer.js";
import trainer2 from "./funciones/v2/trainers2.0.js";
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
 
 app.use('/trainer', versionRoute({
    "1.0.0": trainer,
    "2.0.0": trainer2
 }));

 
