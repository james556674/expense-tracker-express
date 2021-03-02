const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')
const Category = require('../../models/category.js')


router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      // remove 'all' option
      categories.shift()
      res.render('new', { categories: categories.map(category => category.title) })
    })
})

router.post('/', (req, res) => {
  const { name, date, category, amount } = req.body

  Category.findOne({ title: category })
    .then(categoryInfo => {
      return Record.create({
        categoryTitle: categoryInfo.title,
        categoryValue: categoryInfo.value,
        categoryIcon: categoryInfo.icon,
        name,
        date,
        amount
      })
    })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))

})

router.get('/:id/edit', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const recordID = req.params.id

  Record.findById(recordID)
    .then(record => record.remove())
    .then(res.redirect('/'))
    .catch(err => console.error(err))
})

module.exports = router 