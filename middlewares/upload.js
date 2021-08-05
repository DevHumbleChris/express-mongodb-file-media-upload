const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')

const storage = new GridFsStorage({
  url: process.env.MONGO_DB_URL,
  options: {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  file: (req, file) => {
    const match = ['image/jpeg', 'image/png']

    if(match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-am-chris-${file.originalname}`
      return filename
    }

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-am-chris-${file.originalname}`
    }
  }
})

module.exports = multer({
  storage
})
