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
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).single('myImage')

//checamos el tipo de archivo
function checkFileType(file, cb) {
    //lista de archivos permitidos
    const filetypes = /jpeg|jpg|png|gif/

    //verificar la extension del archivo
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    //verificamos el mimetype
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        cb(null, true)
    } else {
        cb('Error: Solo se permiten subir imágenes')
    }
}

//inicializamos la app
const app = express()

//EJS
app.set('view engine', 'ejs')

//carpeta publica
app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index'))

app.post('/upload', (req, res) => {
    //res.send('test')
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            })
        } else {
            //console.log(req.file)
            //res.send('test')
            if (req.file == undefined) {
                res.render('index', {
                    msg: "Error: No seleccionaste un archivo"
                })
            } else {
                res.render('index', {
                    msg: "Archivo subido correctamente",
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

const port = 3000

app.listen(port, () => console.log(`Servidor ejecutándose en el puerto ${port}`))