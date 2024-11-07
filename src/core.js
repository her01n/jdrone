const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { eyeletCornerPositive, eyeletCornerNegative } = require('./eyelet')
const { batteryLength, batteryWidth, plate } = require('./plate')
const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { fourWayMirror, fourWayRotate } = require('./symmetries')
const { threadInsertNegative, threadInsertPositive, threadInsertPrintNegative } = require('./thread-insert')

// TODO
// - [ ] Add a screw to reinforce layer adhesion near pillars
// - [ ] arrow somewhere also on top
//       visible when the controller is installed
// - [ ] rotations
// - [ ] motor numbers

connectDiameter = 10
connectDistance = 15
connectWidth = 4

const armScrews = (child) => {
  return translateY(connectWidth/2,
    rotateZ(Math.PI/4,
      union(
        translateZ(connectDiameter/2, child),
        translateZ(connectDiameter/2 + connectDistance, child))))
}

const armPositive = () => {
  s = armScrews(printCylinder(connectDiameter / 2, 6))
  return hull(s, s)
}

const a = armScrews(mirrorY(union(
  printCylinder(connectDiameter / 2 + 0.1, 99),
  printCylinderCut(connectDiameter / 2 + 0.1, 99))))
const armNegative = union(
  armScrews(threadInsertPrintNegative(4)),
  hull(a, a))

const height = 25

const pillarPositive = () => {
  return cylinder({ radius: 4, height: height, center: [0, 0, height/2]})
}

const pillarNegative = () => {
  return union(
    cylinder({ radius: 3.2/2, height: height, center: [0, 0, height/2]}),
    threadInsertNegative(),
    translateZ(height, mirrorZ(threadInsertNegative())))
}

const length = 80
const width = 40
const armRadius = width/2 + 9

const pillarT = [width/2, length/2]
const armT = [armRadius, armRadius]

const cornersPositive = fourWayMirror(
  hull(
    translate(pillarT, pillarPositive()),
    translate(armT, armPositive()),
    cylinder({ radius: 2, height: height, center: [width/2 + 2, armRadius + 2, height/2] })))
const cornersNegative = fourWayMirror(
  union(translate(pillarT, pillarNegative()), translate(armT, armNegative)))
 
const lAngleSize = 8;
const lAngleThickness = 4;
const lAngle = (length) => {
  return union(
    cuboid({ size: [lAngleSize, length, lAngleThickness], center: [0, length/2, lAngleThickness/2] }),
    cuboid({ size: [lAngleThickness, length, lAngleSize], center: [(lAngleSize - lAngleThickness) / 2, length/2, lAngleSize/2] }))
}
const lAngleRect = (length, width) => {
  return fourWayMirror(
    union(
      translateX(width/2 - lAngleSize/2, lAngle(length/2 - lAngleSize/2)),
      translateY(length/2 - lAngleSize/2, rotateZ(Math.PI/2, lAngle(width/2 - lAngleSize/2)))))
}
const frame = lAngleRect(length + 8, width + 8)

const bottom = plate(length, width)

const eyeletsY = length/2 - 13
const eyeletsPositive = fourWayMirror(
  translate([width/2, eyeletsY, 8],
    rotateZ(-Math.PI/2,
      eyeletCornerPositive(4, 2))))
const eyeletsNegative = fourWayMirror(
  translate([width/2, eyeletsY, 8],
    rotateZ(-Math.PI/2,
      eyeletCornerNegative(4))))

const threadInsertsTs = [
  [30.5/2, 30.5/2], [width/2, length/2 - 10], [width/2 - 10, length/2], [20, 20], [10, 30]];
const threadInsertsPositive = fourWayMirror(
  union(threadInsertsTs.map((t) => { return translate(t, threadInsertPositive()) })))
const threadInsertsNegative = fourWayMirror(
  union(threadInsertsTs.map((t) => { return translate(t, threadInsertNegative(6)) })))

const core = subtract(
  union(cornersPositive, frame, eyeletsPositive, bottom, threadInsertsPositive,),
  union(cornersNegative, eyeletsNegative, threadInsertsNegative))

const main = () => {
  return core
}

module.exports = { armRadius, core, width, length, height, main }

