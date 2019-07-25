/**
  *return position(rank) of army based on data from databased sorted desc
*/
exports.rankRate = async (id, armies) => new Promise((resolve, reject) => {
  for (let i = 0; i < armies.length; i += 1) {
    if (armies[i]._id.toString() == id) {
      resolve(i)
      break
    }
  }
})
