const { subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { length, width } = require('./frame.js')
const { topPositive, topNegative, topThickness } = require('./top.js')
const { xx, yy } = require('./symmetries.js')

const e = 0.001
const height = 20
const baseThickness = 5.6
const peakThickness = 1.8
const distance = 95

const hornPositive = hull(
  cuboid({ size: [20, baseThickness, baseThickness], center: [0, baseThickness/2, baseThickness/2] }),
  cuboid({ size: [10, peakThickness, height], center: [0, peakThickness/2, height/2] }))

const hornConnect = cuboid({
  size: [20, baseThickness, topThickness],
  center: [0, baseThickness/2, topThickness/2] })

const hornT = [0, distance/2]

const screwConnect = cylinder({ radius: 4, height: topThickness, center: [0, 0, topThickness/2] })

const horns =
  subtract(
    union(
      topPositive,
      yy(translate(hornT, hornPositive)),
      yy(
        hullChain(
          translate([width/2, length/2], screwConnect),
          translate(hornT, hornConnect),
          translate([-width/2, length/2], screwConnect)))),
    topNegative)

const main = () => {
  return horns
}

module.exports = { horns, main }

