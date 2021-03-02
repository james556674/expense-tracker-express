const express = require('express')
const exphbs = require('express-handlebars')
const Record = require('./models/record.js')
const Category = require('./models/category.js')
const getTotalAmount = require('./config/getTotalAmount.js')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('./config/mongoose')

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

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
        categoryTitle: recordCategory.title,
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

app.get('/records/:id/edit', (req, res) => {
  const recordID = req.params.id

  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      // remove 'all' option
      categories.shift()
      Record.findById(recordID)
        .lean()
        .then(record => {
          res.render('edit', {
            record,
            date: record.date.toISOString().slice(0, 10), // yyyy-mm-dd
            categories: categories.map(category => category.title)
          })
        })
    })
})
// edit a record
app.put('/records/:id', (req, res) => {
  const recordID = req.params.id
  const { name, date, category, amount } = req.body

  Record.findById(recordID)
    .then(record => {
      record.name = name
      record.date = date
      record.amount = amount
      // change the category items
      Category.findOne({ title: category })
        .then(categoryInfo => {
          record.categoryTitle = categoryInfo.title
          record.categoryValue = categoryInfo.value
          record.categoryIcon = categoryInfo.icon
          record.save()
        })
    })
    .then(res.redirect('/'))
    .catch(err => console.error(err))
})
// delete a record
app.delete('/records/:id', (req, res) => {
  const recordID = req.params.id

  Record.findById(recordID)
    .then(record => record.remove())
    .then(res.redirect('/'))
    .catch(err => console.error(err))
})

app.listen(PORT, () => {
  console.log(`this app is run on http://localhost:${PORT}`)
}) 