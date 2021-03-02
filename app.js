const express = require('express')
const exphbs = require('express-handlebars')
require('./config/mongoose')

const app = express()

const PORT = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
  const records = [
    {
      category: '餐飲',
      name: '午餐',
      date: '2020/10/16',
      amount: 50
    }
  ]
  res.render('index', { totalAmount: 1000, records })
})

app.listen(PORT, () => {
  console.log(`this app is run on http://localhost:${PORT}`)
}) 