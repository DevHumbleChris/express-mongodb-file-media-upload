const mongoose = require('mongoose')

module.exports = {
  connect: async (gfs) => {
    try {
      // MongoDB Setup
      await mongoose.connect(process.env.MONGO_DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
      })

      // Database Connection.
      const conn = mongoose.connection
      conn.on('error', console.error.bind('console', `Failed To Connect To MongoDB`.bold.red))
      conn.once('open', () => {
        gfs = GridFS(conn.db, mongoose.mongo)
        gfs.collection('photos')
        console.log(`Successfully Connected To MongoDB`.bold.blue)
      })
    }catch(err) {
      console.log(`${err.message}`.bold.red)
    }
  }
}
