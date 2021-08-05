module.exports = {
  postImage: async (req, res) => {
    try {
      if(!req.file) return res.status(400).json({
        error: 'Bad Request, Image File Is Required.'
      })

      res.redirect('/')
    }catch(err) {
      res.status(500).json({
        error: err.message
      })
    }
  }
}
