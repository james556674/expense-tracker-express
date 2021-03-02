const express = require('express')
const router = express.Router()


const home = require('./modules/home.js')
const records = require('./modules/record.js')
const filter = require('./modules/filter.js')


router.use('/', home)
router.use('/records', records)
router.use('/filter', filter)

module.exports = router 