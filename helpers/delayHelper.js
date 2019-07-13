exports.delayFun = (ms) => {
  console.log('dosao u promis')
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms )
  })
}
