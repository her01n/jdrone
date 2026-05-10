const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { frontArrow, topPositive, topNegative, topThickness } = require('./top.js')

const bx = 21 / 2
const by = 31 / 2

const gpsTs = [[bx, by], [-bx, by], [-bx, -by], [bx, -by]]

const gpsPositive = union(
  hull(
    cylinder({ radius: 4, height: 4, center: [0, 0, 2] }),
    cylinder({ radius: 3, height: 6, center: [0, 0, 3] })),
  cylinder({ radius: 3, height: 8, center: [0, 0, 4] }))

const gpsNegative = union(
  cylinder({ radius: 5 / 2, height: 4, center: [0, 0, 2] }),
  cylinder({ radius: 3.2 / 2, height: 8, center: [0, 0, 4] }))

const topGps = subtract(
  union(
    topPositive,
    frontArrow,
    gpsTs.map((t) => translate(t, gpsPositive))),
  union(
    topNegative,
    gpsTs.map((t) => translate(t, gpsNegative))))

const main = () => {
  return topGps
}

module.exports = { main, topGps }

