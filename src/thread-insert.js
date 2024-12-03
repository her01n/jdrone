const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder } = require('@jscad/modeling').primitives
const { mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { printCylinderCut } = require('./print-cylinder.js')

const diameter = 4.7;
const h = 4.1;
const screw = 3.2;
const wall = 1.2;
const lead = 0.2;

const threadInsertPositive = ({ outerDiameter = 5, insertLength = 4, constrainHeight = 999 } = {}) => {
  const height = Math.min(constrainHeight, insertLength + 0.1 + wall)
  return cylinder({
    radius: (outerDiameter - 0.3)/2 + wall,
    height: height,
    center: [0, 0, height/2]});
}

const threadInsertNegative = ({ outerDiameter = 5, insertLength = 4, screwDiameter = 3, screwLength = 16 } = {}) => {
  const diameter = outerDiameter - 0.3
  const h = insertLength + 0.1
  const screw = screwDiameter + 0.2
  const t = (diameter - screw) / 2
  return union(
    hull(
      cylinder({ radius: diameter/2, height: h - t, center: [0, 0, (h - t)/2] }),
      cylinder({ radius: screw/2, height: h, center: [0, 0, h/2] })),
    hull(
      cylinder({ radius: diameter/2 + lead, height: 0.001, center: [0, 0, 0.001 / 2] }),
      cylinder({ radius: diameter/2, height: lead, center: [0, 0, lead/2] })),
    cylinder({ radius: screw/2, height: screwLength, center: [0, 0, screwLength/2] }))
}

const threadInsertPrintNegative = (screwLength = 16) => {
  return union(
    hull(
      printCylinderCut(diameter / 2, screw),
      printCylinderCut(screw / 2, h)),
    hull(
      printCylinderCut(diameter/2 + lead/2, 0.001),
      printCylinderCut(diameter/2, lead)),
    printCylinderCut(screw/2, screwLength),
    translateY(-16, printCylinderCut(diameter/2 + lead/2, 16)))
}

const main = () => {
  return union(
    subtract(threadInsertPositive(), threadInsertNegative()),
    translateX(20, threadInsertPrintNegative()))
}

module.exports = { main, threadInsertNegative, threadInsertPositive, threadInsertPrintNegative }

