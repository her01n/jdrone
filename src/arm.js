const { subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorZ, rotate, rotateZ, translate, translateY, translateZ } = require('@jscad/modeling').transforms

const { eyeletPositive, eyeletNegative } = require('./eyelet')
const { hullRing } = require('./hulls')
const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { fourWayRotate } = require('./symmetries')

const cone = (r1, r2, h) => {
  const e = 0.001
  return hull(
    cylinder({ radius: r1, height: e, center: [0, 0, e/2] }),
    cylinder({ radius: r2, height: e, center: [0, 0, h - e/2] }))
}

const connectDiameter = 10
const connectClearance = 6.2 // connectThickness from core + 0.2
const connectDistance = 15
const connectWidth = 4

const screws = (shape) => {
  return [
    translateZ(connectDiameter/2, shape),
    translateZ(connectDiameter/2 + connectDistance, shape)]
}   

const centerPositive = 
  rotateZ(Math.PI/2,
    translateY(-connectWidth/2,
      hull(screws(printCylinder(connectDiameter / 2, connectWidth)))))

const centerNegative = 
  rotateZ(Math.PI/2,
    translateY(-connectWidth/2,
      union(
        screws(translateY(-50, printCylinderCut(3.2 / 2, 100))),
        hull(screws(translateY(-50, printCylinder(connectClearance, 50)))),
        hull(screws(translateY(connectWidth, printCylinder(connectClearance, 50)))))))
 
const link = (startWidth, startHeight, endWidth, endHeight, length) => {
  const startArea = startWidth*startHeight
  const endArea = endWidth*endHeight
  const segments = []
  const e = 0.5
  const q = 0.8
  for (let i = 0; i < length; i += e) {
    const area = startArea + (endArea - startArea) * Math.pow(i, q) / Math.pow(length, q)
    const width = startWidth + (endWidth - startWidth) * i / length
    const height = area / width
    segments.push(translateY(i, cuboid({ size: [width, e, height], center: [0, e / 2, height/2] })))
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
          cylinder({ radius: 4, height: motorHeight, center: [0, 0, motorHeight/2] })))),
    union(
      fourWayRotate(
        translate([radius, radius], cylinder({ radius: 3.2/2, height: 20 }))),
      cylinder({ radius: motorCenterRadius, height: 20 }),
      cone(motorCenterRadius + motorCenterCorner, motorCenterRadius, motorCenterCorner),
      translateZ(motorHeight - motorCenterCorner,
        cone(motorCenterRadius, motorCenterRadius + motorCenterCorner, motorCenterCorner))))
const motorNegative = cylinder({ radius: 15, height: 30, center: [0, 0, motorHeight + 15] })

// TODO calculate the y and angle values
const eyeletTR = [[[0, 60, 8.5], [-0.1, 0, 0]], [[0, 30, 14.6], [-0.2, 0, 0]]]

const linkLength = 100 - radius - 4
    
const arm = subtract(
  union(
    centerPositive,
    link(connectWidth, connectDiameter + connectDistance, 8, 5, linkLength),
    eyeletTR.map((tr) => { return translate(tr[0], rotate(tr[1], eyeletPositive())) }),
    translateY(100, motor)),
  union(
    centerNegative,
    eyeletTR.map((tr) => { return translate(tr[0], rotate(tr[1], eyeletNegative())) }),
    translateY(100, motorNegative)))

const main = () => {
  return arm
}

module.exports = { arm, main }

