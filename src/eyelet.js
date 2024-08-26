const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder } = require('@jscad/modeling').primitives
const { mirrorX, rotateX, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const wire = 3.2

const hex = (radius, length) => {
  return rotateX(-Math.PI/2,
    cylinder({ radius: radius, height: length, segments: 6, center: [0, 0, length/2] }))
}

const wires = (shape) => {
  return [
    translate([-wire/2, 0, wire/2], shape),
    translate([wire/2, 0, wire/2], shape),
    translate([0, 0, wire/2 + Math.sqrt(3)/2*wire], shape)]
}

const eyeletPositive = (length = 6, wall = 1.2) => {
  return hull(wires(hex(wire/2 + wall, length)))
}

const eyeletNegative = (length = 6) => {
  return hull(wires(translateY(-length, hex(wire/2, length*3))))
}

const projectX = (shape) => {
  return intersect(
    hull(shape, mirrorX(shape)),
    cuboid({size: [200, 200, 200], center: [100, 0, 0]}))
}

const a = wire/2 * (1 - Math.sqrt(3)/2)
const d = Math.sqrt(3)/2*wire

const cornerWires = (radius, length, x = 0) => {
  return projectX(
    union(
      translate([wire + wire/2, 0, wire/2 - a], hex(radius, length)),
      translate([wire, 0, wire/2 - a + d], hex(radius, length))))
}

const eyeletCornerNegative = (length = 6) => {
  return translateY(-length, cornerWires(wire/2, length*3))
}

const eyeletCornerPositive = (length = 6, wall = 1.2) => {
  const positive = subtract(cornerWires(wire/2 + wall, length), eyeletCornerNegative(length))
  return intersect(
    union(positive, mirrorX(positive)),
    cuboid({size: [200, 200, 200], center: [100 - wire, 0, 0]}))
}

const main = () => {
  return subtract(eyeletPositive(), eyeletNegative())
}

module.exports = { main, eyeletCornerPositive, eyeletCornerNegative, eyeletPositive, eyeletNegative }

