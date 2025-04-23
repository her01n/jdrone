const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { top } = require('./top.js')
const { app } = require('./plate.js')
const { yy } = require('./symmetries.js')

const e = 0.001
const height = 20
const bottomThickness = 5.6
const topThickness = 2.4
const distance = 95

const hornPositive = hull(
  cuboid({ size: [20, bottomThickness, e], center: [0, bottomThickness/2, e/2] }),
  cuboid({ size: [10, topThickness, height], center: [0, topThickness/2, height/2] }))

const hornConnect = cuboid({
  size: [20, bottomThickness, 2],
  center: [0, bottomThickness/2, 2/2] })

const hornT = [0, distance/2]

const horns = union(top, yy(translate(hornT, hornPositive)))

const main = () => {
  return horns
}

module.exports = { horns, main }

