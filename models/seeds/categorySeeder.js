const db = require('../../config/mongoose.js')
const categories = require('./data/category.json')
const Category = require('../category.js')

db.once('open', () => {
  console.log('Ready to create category seed data!')

  // seed data
  const promise = []
  categories.forEach((category, index) => {
    promise.push(Category.create({
      title: category.title,
      value: category.value,
      icon: category.icon
    }))
  })
  // waiting for all promised to be finished and disconnect db
  Promise.all(promise)
    .then(() => db.close())
    .then(() => console.log('The category seeds created successfully!'))
    .catch(err => console.error(err))
}) 