const express = require('express')

const app = express()

const PORT = 3000

app.get('/', (req, res) => {
  res.send('this is a expense tracker')
})

app.listen(PORT, () => {
  console.log(`this app is run on http://localhost:${PORT}`)
}) 