require('dotenv/config')
require('colors')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const GridFS = require('gridfs-stream')
const mainRoutes = require('./routes/mainRoutes')

const app = express()
const PORT = process.env.PORT
const MONGO_DB_URL = process.env.MONGO_DB_URL

// Middlewares.
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('public'))
app.use('/', mainRoutes)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// MongoDB Setup.
mongoose.connect(MONGO_DB_URL, {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true
})

// Database Connection
let gfs;
const conn = mongoose.connection
conn.on('error', console.error.bind('console', 'Failed To Connect To MongoDB'))
conn.once('open', () => {
  gfs = GridFS(conn.db, mongoose.mongo)
  gfs.collection('photos')
  console.log('Successfully Connected To MongoDB')
})

// All Image Files Route.
app.get('/files', async (req, res) => {
  try {
    await gfs.files.find({}).toArray((err, files) => {
      if(err) return res.status(200).json({
        error: err.message
      })
      if(!files || files.length === 0) return res.status(200).json({
        message: 'No File Exists'
      })
      res.json({
        files
      })
    })
  }catch(err) {
    res.json({
      error: err.message
    })
  }
})

// Single File route.
app.get('/image/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({filename: req.params.filename})
    const readStream = gfs.createReadStream(file.filename)
    readStream.pipe(res)
  }catch(err) {
    res.json({
      error: err.message
    })
  }
})

// index
app.get('/', async (req, res) => {
  try {
    await gfs.files.find({}).toArray((err, files) => {
      if(err) return res.status(200).json({
        error: err.message
      })
      if(!files || files.length === 0) return res.status(200).json({
        message: 'No File Exists'
      })
      res.render('index', {
        files
      })
    })
  }catch(err) {
    res.json({
      error: err.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server Started At Port - ${PORT}`)
})
