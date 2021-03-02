const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')
const Category = require('../../models/category.js')
const getTotalAmount = require('../../config/getTotalAmount.js')

router.get('/', (req, res) => {
  Category.find()
    .sort({ _id: 'asc' })
    .lean()
    .then(categories => {
      Record.find()
        .lean()
        .then(records => {
          records.forEach(record => {
            record.date = record.date.toISOString().slice(0, 10)
          })
          res.render('index', { totalAmount: getTotalAmount(records), categories, targetCategory: 'all', records })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})
module.exports = router 