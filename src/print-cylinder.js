const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder } = require('@jscad/modeling').primitives
const { mirrorZ, rotate, rotateZ, translate, translateY, translateZ } = require('@jscad/modeling').transforms

const box = (width, length, height) => {
  if (width <= 0) throw new Error('not positive width: ' + width)
  if (length <= 0) throw new Error('not positive length: ' + length)
  if (height <= 0) throw new Error('not positive height: ' + height)
  return cuboid({size: [width, length, height], center: [width/2, length/2, height/2] })
}

const printCylinder = (radius, length) => {
  const alpha = 45 *2*Math.PI/360;
  const b = radius*((1 - Math.sin(alpha)) / Math.cos(alpha));
  return hull(
    rotate([-Math.PI/2, 0, 0], cylinder({ radius: radius, height: length, center: [0, 0, length/2] })),
    translate([-b, 0, -radius], box(b*2, length, radius)))
}

const printCylinderCut = (radius, length) => {
  const alpha = 45 *2*Math.PI/360;
  const b = radius*((1 - Math.sin(alpha)) / Math.cos(alpha));
  return hull(
    rotate([-Math.PI/2, 0, 0], cylinder({ radius: radius, height: length, center: [0, 0, length/2] })),
    translate([-b, 0, 0], box(b*2, length, radius)))
}

module.exports = { printCylinder, printCylinderCut }

