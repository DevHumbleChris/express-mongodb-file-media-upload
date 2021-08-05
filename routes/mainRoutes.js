const route = require('express').Router()
const upload = require('../middlewares/upload')
const mainController = require('../controllers/mainControllers')

route.post('/upload', upload.single('file'), mainController.postImage)

module.exports = route
