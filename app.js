"use strict";

//carga de modulos para crear el servidor

let express = require("express");
let bodyParser = require("body-parser");

//ejecutar express (http)

let app = express();

//cargar  ficheros, rutas

let article_routes = require('./routes/articles')

//cargar Middlewares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos o rutas / cargar rutas
app.use('/',article_routes);

// Exportar modulo
module.exports = app;
