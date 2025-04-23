const { subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorZ, rotate, rotateZ, translate, translateY, translateZ } = require('@jscad/modeling').transforms

const { hullRing } = require("./hulls.js")
const { xx } = require("./symmetries.js")

const wall = 1.6

const screwInnerDiameter = 3.2
const screwOuterDiameter = 6.4
const screwDistance = 20

const screwPositive = 
  cylinder({ radius: screwOuterDiameter/2, height: wall, center: [0, 0, wall/2] })
const screwConnect = 
  cylinder({ radius: screwInnerDiameter/2, height: wall, center: [0, 0, wall/2] })
const screwNegative = union(
  cylinder({ radius: screwInnerDiameter/2, height: 20 }),
  cylinder({ radius: screwOuterDiameter/2, height: 20, center: [0, 0, wall + 10] }))
const screwTs = [
  [screwDistance/2, screwDistance/2], [-screwDistance/2, screwDistance/2],
  [-screwDistance/2, -screwDistance/2], [screwDistance/2, -screwDistance/2]]
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
  center: [0, 0, wall + pcb/2] })
const pcbNegative = union(
  cuboid({ size: [width - 2*overhang, 200, 100], center: [0, -100 + length/2, 0] }),
  cuboid({ size: [width, length, pcb], center: [0, 0, wall + pcb/2] }),
  cuboid({ size: [width - 2*overhang, 100, 100], center: [0, 0, wall + pcb + 50] }))

const rx = subtract(
  union(screwsPositive, pcbPositive),
  union(screwsNegative, pcbNegative))

const main = () => {
  return rx
}

module.exports = { rx, main }

