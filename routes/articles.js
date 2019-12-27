'use strict'
const express = require('express')
const ArticleController = require('../controllers/article')
const router = express.Router();
const multiparty = require('connect-multiparty')
//Configuración del modulo connect multiparty router/aricle.js
const md_upload = multiparty({uploadDir: './upload/articles'})
//Rutas de prueba
router.post('/datos-curso',ArticleController.datosCurso);
router.get('/test-de-controlador',ArticleController.test);

//Rutas útiles 

router.post('/save',ArticleController.save)
router.get('/articles/:last?',ArticleController.getArticles)
router.get('/article/:id',ArticleController.getArticle)
router.put('/article/:id',ArticleController.update)
router.delete('/article/:id',ArticleController.delete)
router.post('/upload-image/:id',md_upload,ArticleController.uploadFile)
router.get('/get-image/:image',ArticleController.getImage)
router.get('/search/:search', ArticleController.search)
module.exports = router;