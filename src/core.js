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

connectDiameter = 10
connectDistance = 15
connectWidth = 4
connectThickness = 6
connectThreadInsertY = 5.4

const armPositive = hull(
  translateZ(connectDiameter/2, printCylinder(connectDiameter / 2, connectThickness)),
  translateZ(connectDiameter/2 + connectDistance, printCylinderCut(connectDiameter / 2, connectThickness)))

const armNegative = union(
  translate([0, connectThreadInsertY, connectDiameter/2],
    mirrorY(threadInsertPrintNegative())),
  translate([0, connectThreadInsertY, connectDiameter/2 + connectDistance],
    mirrorY(threadInsertPrintNegative())),
  hull(
    translateZ(connectDiameter/2,
      mirrorY(printCylinder(connectDiameter/2 + 0.1, connectWidth))),
    translateZ(connectDiameter/2 + connectDistance,
      mirrorY(printCylinderCut(connectDiameter/2 + 0.1, connectWidth)))))

const height = 25

const pillarPositive = () => {
  return cylinder({ radius: 4, height: height, center: [0, 0, height/2]})
}

const pillarNegative = () => {
  return union(
    cylinder({ radius: 3.2/2, height: height, center: [0, 0, height/2]}),
    threadInsertNegative({ insertLength: 8 }),
    translateZ(height, mirrorZ(threadInsertNegative({ insertLength: 8 }))))
}

const length = 80
const width = 40

const pillarT = [width/2, length/2]
const armT = [width/2 + 4 + 5, length/2]

const armAlpha =
  Math.PI/4 - Math.asin(Math.sqrt(2)*(armT[1] - armT[0])/2/Math.sqrt(2*2 + 100*100)) +
  Math.atan2(2, 100)

const cornersPositive = fourWayMirror(
  hull(
    translate(pillarT, pillarPositive()),
    translate(armT, rotateZ(armAlpha, armPositive))))
const cornersNegative = fourWayMirror(
  union(translate(pillarT, pillarNegative()), translate(armT, rotateZ(armAlpha, armNegative))))

const armTest = translate(armT, rotateZ(armAlpha,
  cuboid({ size: [100, 4, 1], center: [50, -2, 0.5] })))
const diagonalTest = rotateZ(Math.PI/4, cuboid({ size: [400, 0.1, 0.1] }))

const test = []
// const test = union(armTest, diagonalTest)

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

const eyeletsY = length/2 - 6
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
  union(threadInsertsTs.map((t) => { return translate(t, threadInsertNegative({ screwLength: 6 })) })))

const smallStackThreadInsert = {
  screwDiameter: 2, insertLength: 4, outerDiameter: 3.2, constrainHeight: 4 }
const smallStackPositive =
  fourWayMirror(translate([10, 10], threadInsertPositive(smallStackThreadInsert)))
const smallStackNegative =
  fourWayMirror(translate([10, 10], threadInsertNegative(smallStackThreadInsert)))

const core = subtract(
  union(cornersPositive, frame, eyeletsPositive, bottom, threadInsertsPositive, smallStackPositive, test),
  union(cornersNegative, eyeletsNegative, threadInsertsNegative, smallStackNegative))

const main = () => {
  return core
}

module.exports = { armT, armAlpha, core, width, length, height, main }

