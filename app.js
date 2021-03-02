const express = require('express')
const exphbs = require('express-handlebars')
const Record = require('./models/record.js')
const Category = require('./models/category.js')
const getTotalAmount = require('./config/getTotalAmount.js')
const bodyParser = require('body-parser')
require('./config/mongoose')

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    ifEquals: function (targetItem, iteratedItem, options) {
      return (targetItem === iteratedItem) ? options.fn(this) : options.inverse(this)
    }
  }
}))
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {

  Category.find()
    .sort({ _id: 'asc' })
    .lean()
    .then(categories => {
      Record.find()
        .lean()
        .then(records => {
          res.render('index', { totalAmount: getTotalAmount(records), categories, targetCategory: 'all', records })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

app.get('/filter', (req, res) => {
  const category = req.query.category
  console.log(category)

  Category.find()
    .sort({ _id: 'asc' })
    .lean()
    .then(categories => {
      if (category === 'all') {
        Record.find()
          .lean()
          .then(records => {
            res.render('index', { totalAmount: getTotalAmount(records), categories, targetCategory: category, records })
          })
      } else {
        Record.find({ categoryValue: category })
          .lean()
          .then(records => {
            res.render('index', { totalAmount: getTotalAmount(records), categories, targetCategory: category, records })
          })
      }
    })
})

app.get('/records/new', (req, res) => {
  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      // remove 'all' option
      categories.shift()
      res.render('new', { categories: categories.map(category => category.title) })
    })
})

app.post('/records', (req, res) => {
  const { name, date, category, amount } = req.body

  Category.findOne({ title: category })
    .then(recordCategory => {
      return Record.create({
        categoryValue: recordCategory.value,
        categoryIcon: recordCategory.icon,
        name,
        date,
        amount
      })
    })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))

})

app.listen(PORT, () => {
  console.log(`this app is run on http://localhost:${PORT}`)
}) 