const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')
const Category = require('../../models/category.js')
const getTotalAmount = require('../../config/getTotalAmount.js')


router.get('/', (req, res) => {
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
            records.forEach(record => {
              record.date = record.date.toISOString().slice(0, 10)
            })

            res.render('index', { totalAmount: getTotalAmount(records), categories, targetCategory: category, records })
          })
      } else {
        Record.find({ categoryValue: category })
          .lean()
          .then(records => {
            records.forEach(record => {
              record.date = record.date.toISOString().slice(0, 10)
            })
            res.render('index', { totalAmount: getTotalAmount(records), categories, targetCategory: category, records })
          })
      }
    })
})


module.exports = router 