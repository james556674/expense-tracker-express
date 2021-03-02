function getTotalAmount(records) {
  let totoalAmount = 0
  records.forEach(record => {
    totoalAmount += record.amount
  })
  return totoalAmount
}

module.exports = getTotalAmount 