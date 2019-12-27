"use strict";
let validator = require("validator");
let Article = require("../models/article");
let fs = require('fs')
let path = require('path')
let controller = {
  datosCurso: (req, res) => {
    let hola = req.body.hola;
    return res.status(200).send({
      id: "1",
      nombre: "Jesús David",
      apellido: "Arroyo Machado",
      email: "elmachado@hotmail.es",
      hola
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      menssage: "soy la accíon test de mi contralodor de articulos"
    });
  },
  save: (req, res) => {
    //Recoger los parámetros por POST.
    let params = req.body;
    console.log(params);
    //Validar datos.
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar !!"
      });
    }
    if (validate_title && validate_content) {
      //Crear el objeto a guardar.

      let article = new Article();

      //Asiganar valores.

      article.title = params.title;
      article.content = params.content;
      article.image = null;

      //Guardar el artículo.
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "error",
            messsage: "El artículo no se ha guardado"
          });
        }

        //Devolver una respuesta.
        return res.status(200).send({
          status: "success",
          article: articleStored
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        articles: "Los datos ingresados no son validos !!!"
      });
    }
  },

  getArticles: (req, res) => {
    let last = req.params.last;
    var queryLimit;
    console.log(last);

    if (last == 1) {
      queryLimit = 1;
    }
    if (last == 5) {
      queryLimit = 5;
    }
    if (last == 10) {
      queryLimit = 10;
    }

    // Find
    Article.find({})
      .limit(queryLimit)
      .sort("-_id")
      .exec((err, articles) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error al devolver los artículos"
          });
        }

        if (!articles) {
          return res.status(404).send({
            status: "error",
            articles: "No hay articulos para mostrar"
          });
        }

        return res.status(200).send({
          status: "success",
          articles
        });
      });
  },

  getArticle: (req, res) => {
    //Obtener el id de la URL
    let articleId = req.params.id;

    //Comprobar que el artículo existe
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "Error",
        message: "No existe el artículo"
      });
    }
    //Buscar artículo

    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(500).send({
          status: "error",
          message: "No existe el artículo"
        });
      }
      //Devolverlo en Json

      return res.status(200).send({
        status: "success",
        article
      });
    });
  },
  update: (req, res) => {
    //Recoger el id del artículo por la URL

    let articleId = req.params.id;

    //Obtener los datos que vienen por el método PUT
    let params = req.body;

    //Validar los datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(500).send({
        status: "error",
        message: "Faltan datos por enviar"
      });
    }
    if (validate_title && validate_content) {
      //Buscar y actualizar
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (err, articleUpdated) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar"
            });
          }

          if (!articleUpdated) {
            return res.status(404).send({
              status: "error",
              message: "No existe el artículo"
            });
          }

          return res.status(200).send({
            status: "Succes",
            article: articleUpdated
          });
        }
      );
    } else {
      //Devolver respuesta

      return res.status(500).send({
        status: "error",
        message: "La validación no es correcta"
      });
    }
  },
  delete: (req, res) => {
    //Recoger el id de la URL

    var articleId = req.params.id;

    //Find and delete
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemove) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al borrar"
        });
      }

      if(!articleRemove){
        return res.status(404).send({
            status: "error",
            message: "Error: no existe el articulo"
          });

      }
   
      return res.status(500).send({
        status: "Success",
        article: articleRemove
      });

    });  
  },
  uploadFile: (req, res) => {
     
    
    //Obtener el fichero de la petición
    var file_name = 'Imagen no subida...'
    
    if(!req.files){
        return res.status(404).send({
            status:'error',
            message:file_name
        })
    }


    //Obtener el nombre y la extención del archivo 
       let file_path = req.files.file0.path;
       let file_split = file_path.split('/');
       
    //Nombre del archivo
       file_name = file_split[2];

    //Extensión del fichero
    let extension_split = file_name.split('.')
    let file_ext = extension_split[1];

    //Comprobar la extensión, solo imagenes, si no es valido borrar el fichero

      if(file_ext != 'png' && file_ext != 'jpg' &&file_ext != 'jpeg'){
          //borarr el archivo subido
          fs.unlink(file_path, (err) => {
            return res.status(200).send({
              status: 'Error',
              message: 'La extensión de la imagen no es valida'
            });
          });
      }else{

          let articleId = req.params.id;

          //Buscar el artículo, asignarle el nombre de la imagen y actualizarlo
          Article.findOneAndUpdate({_id:articleId},{image:file_name},{new:true}, (err, articleUpdated) => {
               

            if(err || !articleUpdated){
            
              return res.status(500).send({
                status: 'success',
                message: 'Error al guardar la imagen de artículo'
              });
            
            }


            return res.status(500).send({
              status: 'success',
              article: articleUpdated
            });
          });
       
      }
    // Buscar el artículo y asiganarle el nombre de la imagen y actualizarlo
   
  },

  getImage:(req, res) => {

    let file = req.params.image;
    let path_file = './upload/articles/'+file;

    fs.exists(path_file, (exists) => {

      if(exists){

        return res.sendFile(path.resolve(path_file))

      }else{
        return res.status(404).send({
          status: 'error',
          message: 'La imágen no existe'
        })
      }


    })
  },

  search: (req, res) => {

      //Sacar el string a buscar

      let searchString = req.params.search;


      //Find or
      Article.find({"$or":[
      { "title":{"$regex": searchString, "$options": "i"}},
      { "content":{"$regex": searchString, "$options": "i"}},
    ]})
    .sort([['date', 'descending']])
    .exec((err,articles) => {
      
      if(err){

        return res.status(500).send({
            status: 'error',
            message: "Error en la petición",
            
        })
      }

      if(!articles || articles.length <= 0){
        return res.status(404).send({
          status : 'error',
          message: "No hay artículos que correspondan a tu búsqueda "
        })
      }
      

      return res.status(200).send({
        status: 'Success',
        articles
      })

    })
    



   

  }
};

module.exports = controller;
