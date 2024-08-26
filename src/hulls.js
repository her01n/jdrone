const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls

const flatten = (arr) => arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), [])

const hullRing = (...geometries) => {
  geometries = flatten(geometries)
  const hulls = []
  for (let i = 0; i != geometries.length; i++) {
    hulls.push(hull(geometries[i], geometries[(i + 1) % geometries.length]))
  }
  return union(hulls)
}

module.exports = { hullRing }

