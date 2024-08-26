const { subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorZ, rotate, rotateZ, translate, translateY, translateZ } = require('@jscad/modeling').transforms

const width = 11 + 0.4
const length = 16 + 0.4
const pcb = 1.2 + 0.2
const wall = 1.2
const overhang = 0.6
const height = 2*wall + pcb
const screwY = (wall + length + overhang) / 2
const screwOuterRadius = 4
const screwPositive = 
  cylinder({ radius: screwOuterRadius, height: height, center: [0, 0, height/2] })
const screwNegative = 
  cylinder({ radius: 3.2 / 2, height: 20 })
const screwX = 10
const screwsPositive = 
  hull(
    translate([-screwX, screwY], screwPositive),
    translate([screwX, screwY], screwPositive))
const screwsNegative =
  union(
    translate([-screwX, screwY], screwNegative),
    translate([screwX, screwY], screwNegative))

const pcbPositive =
  cuboid({
    size: [2*wall + width, wall + length + overhang, height],
    center: [0, (wall + length + overhang)/2, height/2] })
const pcbNegative =
  union(
    cuboid({
      size: [width, length, pcb],
      center: [0, wall + length/2, wall + pcb/2] }),
    cuboid({
      size: [width - overhang*2, 100, 100],
      center: [0, wall + 50, 0] }))

const rx = subtract(
  union(screwsPositive, pcbPositive),
  union(screwsNegative, pcbNegative))

const main = () => {
  return rx
}

module.exports = { main }

