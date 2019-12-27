"use strict";
let mongoose = require("mongoose");
let app = require('./app');
let port = 6000;

mongoose.set('useFindAndModify',false);
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/api_rest_blog", { useNewUrlParser: true })
  .then(() => {
      console.log('La conexión a la base de datos se ha realizado correctamente!!')
      //crear servidor y eschucha de peticiones HTTP  
        app.listen(port,()=>{
            console.log('servidor corriendo en http://localhost:'+port);
            
        })
    });
