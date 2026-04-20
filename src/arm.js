const { subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorZ, rotate, rotateZ, translate, translateY, translateZ } = require('@jscad/modeling').transforms

const { connect, screws } = require('./connect')
const { hullRing } = require('./hulls')
const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { fourWayRotate, yy } = require('./symmetries')

const cone = (r1, r2, h) => {
  const e = 0.001
  return hull(
    cylinder({ radius: r1, height: e, center: [0, 0, e/2] }),
    cylinder({ radius: r2, height: e, center: [0, 0, h - e/2] }))
}

const centerPositive = rotateZ(Math.PI/2, translateY(-2, connect({ length: 4 })))

const centerNegative = 
  rotateZ(Math.PI/2,
    screws(translateY(-50, printCylinderCut(3.2 / 2, 100))),
    yy(translateY(-10 - 2, connect({ length: 10, slack: 0.2 }))))
 
const link = (startWidth, startHeight, endWidth, endHeight, length) => {
  const startArea = (startWidth + endWidth) / 2 * startHeight
  const endArea = endWidth * endHeight
  const segments = []
  const e = 0.5
  const q = 0.8
  for (let i = 0; i < length; i += e) {
    const area = startArea + (endArea - startArea) * Math.pow(i, q) / Math.pow(length, q)
    const width = startWidth + (endWidth - startWidth) * i / length
    const height = area / (endWidth + width) * 2
    segments.push(translateY(i, hull(
      cuboid({ size: [width, e, height], center: [0, e / 2, height/2] }),
      cuboid({ size: [endWidth, e, e], center: [0, e / 2, e / 2] }))))
  }
  return hullChain(segments)
}

const radius = Math.sqrt(2)/2*8
const motorHeight = 5;
const motorCenterRadius = 4;
const motorCenterCorner = 1.2;
const motor = 
  subtract(
    hull(
      fourWayRotate(
        translate([radius, radius],
          cylinder({ radius: 4.2, height: motorHeight, center: [0, 0, motorHeight/2] }))),
      cuboid({ size: [8, 4.2, motorHeight], center: [0, -12, motorHeight/2] })),
    union(
      fourWayRotate(
        translate([radius, radius], cylinder({ radius: 3.2/2, height: 20 }))),
      cylinder({ radius: motorCenterRadius, height: 20 }),
      cone(motorCenterRadius + motorCenterCorner, motorCenterRadius, motorCenterCorner),
      translateZ(motorHeight - motorCenterCorner,
        cone(motorCenterRadius, motorCenterRadius + motorCenterCorner, motorCenterCorner))))
const motorNegative = cylinder({ radius: 15, height: 30, center: [0, 0, motorHeight + 15] })

const linkLength = 100 - radius - 4

const holeWidth = 3.2
const holeHeight = 2
const holeZ = 3

const holeNegative =
  union(
    cuboid({ size: [50, holeWidth, holeHeight], center: [0, 0, holeZ + holeHeight/2] }),
    cuboid({ size: [6, holeWidth, holeHeight], center: [0, 0, holeZ + holeHeight/2 - 1] }));

const holeTs = [[0, 30], [0, 60]]
    
const arm = subtract(
  union(
    centerPositive,
    link(4, 25, 8, 5, linkLength),
    translateY(100, motor)),
  union(
    centerNegative,
    holeTs.map((t) => translate(t, holeNegative)),
    translateY(100, motorNegative)))

const main = () => {
  return arm
}

module.exports = { arm, main }

