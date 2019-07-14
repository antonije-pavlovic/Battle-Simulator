exports.rankRate = async (id, armies) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < armies.length; i += 1) {
      if (armies[i]._id.toString() == id) {
        resolve(i)
        break
      }
    }
  })
}
