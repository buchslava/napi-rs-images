const fs = require('fs')
const path = require('path')

const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const fileUpload = require('express-fileupload')
const uuidv4 = require('uuid').v4

const { darker } = require('./index')

const STORAGE_DIR = 'storage'

const app = express()

app.use(fileUpload())
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use('/storage', express.static(path.join(__dirname, STORAGE_DIR)))
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
  let files = await fs.promises.readdir(path.join(__dirname, STORAGE_DIR))
  files = files
    .map((fileName) => ({
      name: fileName,
      time: fs.statSync(path.join(__dirname, STORAGE_DIR, fileName)).mtime.getTime(),
    }))
    .sort((a, b) => a.time - b.time)
    .map((v) => v.name)
  return res.render('upload', { files: files.reverse() })
})

app.post('/uploads', function (req, res) {
  const file = req.files.upload
  const extname = path.extname(file.name)
  const uuid = uuidv4()
  const filePath = path.join(__dirname, STORAGE_DIR, `${uuid}${extname}`)

  file.mv(filePath, (err) => {
    if (err) {
      return res.status(500).send(err)
    }
    try {
      darker(filePath, +req.body.saturation)
    } catch (e) {
      return res.status(500).send(e)
    }
    res.redirect('/')
  })
})

app.listen(3000)
