const express = require('express')
const multer = require('multer')
const ejs = require('ejs')

const path = require('path')

//creamos el storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

//inicializamos upload
const upload = multer({
    storage: storage
}).single('myImage')

//inicializamos la app
const app = express()

//EJS
app.set('view engine', 'ejs')

//carpeta publica
app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index'))

const port = 3000

app.listen(port, () => console.log(`Servidor ejecutándose en el puerto ${port}`))