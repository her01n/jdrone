const { subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorZ, rotate, rotateZ, translate, translateY, translateZ } = require('@jscad/modeling').transforms

const { hullRing } = require("./hulls.js")
const { xx } = require("./symmetries.js")

const wall = 1.6

const screwInnerDiameter = 3.2
const screwOuterDiameter = 6.4
const screwX = 10

const screwPositive = 
  cylinder({ radius: screwOuterDiameter/2, height: wall, center: [0, 0, wall/2] })
const screwConnect = screwPositive
const screwNegative = union(
  cylinder({ radius: screwInnerDiameter/2, height: 20 }),
  cylinder({ radius: screwOuterDiameter/2, height: 20, center: [0, 0, wall + 10] }))
const screwTs = [[screwX, 0], [-screwX, 0]]
const screwsPositive = union(
  screwTs.map((t) => translate(t, screwPositive)),
  hull(screwTs.map((t) => translate(t, screwConnect))))
const screwsNegative = union(screwTs.map((t) => translate(t, screwNegative)))

const width = 11 + 0.4
const length = 16 + 0.4
const pcb = 1.2 + 0.2
const overhang = 0.6

const pcbPositive = cuboid({
  size: [wall*2 + width, 2*wall + length, wall*2 + pcb],
  center: [0, -(2*wall + length) / 2, wall + pcb/2] })
const pcbNegative = union(
  cuboid({ size: [width - 2*overhang, 100, 100], center: [0, -50 - wall, 0] }),
  cuboid({ size: [width, length, pcb], center: [0, -(2*wall + length) / 2, wall + pcb/2] }),
  cuboid({ size: [width - 2*overhang, 100, 100], center: [0, 0, wall + pcb + 50] }))
const pcbT = [0, length - 4]

const rx = subtract(
  union(screwsPositive, translate(pcbT, pcbPositive)),
  union(screwsNegative, translate(pcbT, pcbNegative)))

const main = () => {
  return rx
}

module.exports = { rx, main }

